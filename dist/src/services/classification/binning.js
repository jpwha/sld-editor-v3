"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEqualIntervalBreaks = calculateEqualIntervalBreaks;
exports.calculateQuantileBreaks = calculateQuantileBreaks;
exports.calculateStdDevBreaks = calculateStdDevBreaks;
exports.calculateJenksBreaks = calculateJenksBreaks;
exports.calculateBreaks = calculateBreaks;
const statistics_1 = require("./statistics");
const types_1 = require("./types");
function normalizeBreaks(breaks) {
    return [...new Set(breaks)].sort((a, b) => a - b);
}
function calculateEqualIntervalBreaks(values, numBins, stats) {
    const { min, max } = stats;
    const step = (max - min) / numBins;
    return Array.from({ length: numBins + 1 }, (_, i) => min + step * i);
}
function calculateQuantileBreaks(values, numBins) {
    const sorted = [...values].sort((a, b) => a - b);
    const breaks = [sorted[0]];
    for (let i = 1; i < numBins; i++) {
        const index = Math.floor((i / numBins) * sorted.length);
        breaks.push(sorted[index]);
    }
    breaks.push(sorted[sorted.length - 1]);
    return normalizeBreaks(breaks);
}
function calculateStdDevBreaks(values, numBins, stats) {
    const { mean, stdDev } = stats;
    const halfBins = Math.floor(numBins / 2);
    return Array.from({ length: numBins + 1 }, (_, i) => mean - (halfBins - i) * stdDev);
}
function calculateJenksBreaks(values, numBins) {
    const sorted = [...values].sort((a, b) => a - b);
    let breaks = Array.from({ length: numBins + 1 }, (_, i) => sorted[Math.floor((i / numBins) * (sorted.length - 1))]);
    const maxIterations = 10;
    let lastGVF = -1;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const gvf = calculateGVF(sorted, breaks);
        if (Math.abs(gvf - lastGVF) < 0.0001)
            break;
        lastGVF = gvf;
        for (let i = 1; i < breaks.length - 1; i++) {
            const classValues = sorted.filter(v => v >= breaks[i - 1] && v <= breaks[i + 1]);
            if (classValues.length)
                breaks[i] = classValues.reduce((sum, v) => sum + v, 0) / classValues.length;
        }
    }
    return normalizeBreaks(breaks);
}
function calculateGVF(values, breaks) {
    const classes = Array.from({ length: breaks.length - 1 }, () => []);
    values.forEach(val => {
        for (let i = 0; i < breaks.length - 1; i++) {
            if (val >= breaks[i] && val <= breaks[i + 1]) {
                classes[i].push(val);
                break;
            }
        }
    });
    const totalMean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const SDAM = values.reduce((sum, val) => sum + Math.pow(val - totalMean, 2), 0);
    const SDCM = classes.reduce((sum, cls) => {
        if (!cls.length)
            return sum;
        const classMean = cls.reduce((s, v) => s + v, 0) / cls.length;
        return sum + cls.reduce((s, v) => s + Math.pow(v - classMean, 2), 0);
    }, 0);
    return SDAM ? (SDAM - SDCM) / SDAM : 0;
}
function calculateBreaks(values, options) {
    if (!values.length)
        throw new types_1.ClassificationError('No values provided for classification');
    if (options.numBins < 2 || options.numBins > 20) {
        throw new types_1.ClassificationError('Number of bins must be between 2 and 20');
    }
    const validValues = values.filter(v => !isNaN(v) && v !== null && v !== undefined && v !== -999);
    if (!validValues.length)
        throw new types_1.ClassificationError('No valid values found after filtering');
    const statistics = (0, statistics_1.calculateStatistics)(validValues);
    let breaks;
    switch (options.method) {
        case 'equalInterval':
            breaks = calculateEqualIntervalBreaks(validValues, options.numBins, statistics);
            break;
        case 'quantile':
            breaks = calculateQuantileBreaks(validValues, options.numBins);
            break;
        case 'stdDev':
            breaks = calculateStdDevBreaks(validValues, options.numBins, statistics);
            break;
        case 'jenks':
            breaks = calculateJenksBreaks(validValues, options.numBins);
            break;
        default:
            throw new types_1.ClassificationError(`Unknown classification method: ${options.method}`);
    }
    if (options.roundIncrement > 0) {
        breaks = breaks.map(b => Math.round(b / options.roundIncrement) * options.roundIncrement);
    }
    return { breaks: normalizeBreaks(breaks), statistics };
}
//# sourceMappingURL=binning.js.map