"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function expectArraysClose(actual, expected, tolerance = 0.0001) {
    expect(actual.length).toBe(expected.length);
    actual.forEach((val, i) => expect(val).toBeCloseTo(expected[i], 4));
}
describe('calculateEqualIntervalBreaks', () => {
    it('creates equal interval breaks', () => {
        const values = [0, 25, 50, 75, 100];
        const stats = { min: 0, max: 100 };
        const breaks = (0, index_1.calculateEqualIntervalBreaks)(values, 4, stats);
        expectArraysClose(breaks, [0, 25, 50, 75, 100]);
    });
    it('handles odd number of breaks', () => {
        const values = [0, 30, 60, 90];
        const stats = { min: 0, max: 90 };
        const breaks = (0, index_1.calculateEqualIntervalBreaks)(values, 3, stats);
        expectArraysClose(breaks, [0, 30, 60, 90]);
    });
});
describe('calculateQuantileBreaks', () => {
    it('creates quantile breaks with even distribution', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const breaks = (0, index_1.calculateQuantileBreaks)(values, 4);
        expectArraysClose(breaks, [1, 3, 6, 8, 10]);
    });
    it('handles uneven distribution', () => {
        const values = [1, 1, 2, 2, 3, 4, 5, 10];
        const breaks = (0, index_1.calculateQuantileBreaks)(values, 4);
        expect(breaks[0]).toBe(1);
        expect(breaks[breaks.length - 1]).toBe(10);
    });
});
describe('calculateStdDevBreaks', () => {
    it('creates breaks based on standard deviation', () => {
        const values = [2, 4, 6, 8, 10];
        const stats = { mean: 6, stdDev: 2 };
        const breaks = (0, index_1.calculateStdDevBreaks)(values, 5, stats);
        expectArraysClose(breaks, [2, 4, 6, 8, 10]);
    });
    it('handles even number of bins', () => {
        const values = [1, 3, 5, 7];
        const stats = { mean: 4, stdDev: 2 };
        const breaks = (0, index_1.calculateStdDevBreaks)(values, 4, stats);
        expect(breaks.length).toBe(5);
        expect(breaks[Math.floor(breaks.length / 2)]).toBeCloseTo(stats.mean);
    });
});
describe('calculateJenksBreaks', () => {
    it('creates natural breaks', () => {
        const values = [1, 2, 2, 3, 3, 3, 4, 4, 5, 10, 20, 30, 40];
        const breaks = (0, index_1.calculateJenksBreaks)(values, 3);
        expect(breaks.length).toBe(4);
        expect(breaks[0]).toBe(1);
        expect(breaks[breaks.length - 1]).toBe(40);
    });
    it('handles small datasets', () => {
        const values = [1, 2, 3];
        const breaks = (0, index_1.calculateJenksBreaks)(values, 2);
        expectArraysClose(breaks, [1, 2, 3]);
    });
});
describe('calculateBreaks', () => {
    const validOptions = { method: 'equalInterval', numBins: 4, roundIncrement: 0, includeMissing: false };
    it('handles valid input for each method', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8];
        const methods = ['equalInterval', 'quantile', 'stdDev', 'jenks'];
        methods.forEach(method => {
            const result = (0, index_1.calculateBreaks)(values, Object.assign(Object.assign({}, validOptions), { method }));
            expect(result.breaks.length).toBe(validOptions.numBins + 1);
            expect(result.statistics).toBeDefined();
        });
    });
    it('applies rounding increment correctly', () => {
        const values = [1.1, 2.2, 3.3, 4.4, 5.5];
        const result = (0, index_1.calculateBreaks)(values, Object.assign(Object.assign({}, validOptions), { roundIncrement: 1 }));
        result.breaks.forEach(break_ => expect(break_ % 1).toBe(0));
    });
    it('filters invalid values', () => {
        const values = [1, 2, NaN, 4, -999, 6];
        const result = (0, index_1.calculateBreaks)(values, Object.assign(Object.assign({}, validOptions), { includeMissing: true }));
        expect(result.breaks.length).toBe(validOptions.numBins + 1);
        expect(result.statistics.min).toBe(1);
    });
});
//# sourceMappingURL=binning.test.js.map