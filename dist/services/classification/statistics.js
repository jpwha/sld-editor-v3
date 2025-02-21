"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStatistics = calculateStatistics;
const types_1 = require("./types");
function calculateStatistics(values) {
    if (!values.length)
        throw new types_1.ClassificationError('No values provided for statistics calculation');
    if (!values.every(v => typeof v === 'number' && !isNaN(v))) {
        throw new types_1.ClassificationError('Non-numeric values detected');
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return { min, max, mean, stdDev };
}
//# sourceMappingURL=statistics.js.map