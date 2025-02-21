"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function expectArraysClose(actual, expected, tolerance = 0.0001) {
    expect(actual.length).toBe(expected.length);
    actual.forEach((val, i) => expect(val).toBeCloseTo(expected[i], 4));
}
describe('Statistics Edge Cases', () => {
    it('handles extreme value ranges', () => {
        const tinyStats = (0, index_1.calculateStatistics)([0.0000001, 0.0000002, 0.0000003]);
        const hugeStats = (0, index_1.calculateStatistics)([1e10, 2e10, 3e10]);
        expect(tinyStats.mean).toBeCloseTo(0.0000002, 10);
        expect(hugeStats.mean).toBeCloseTo(2e10, 0);
    });
    it('handles negative and mixed sign values', () => {
        const stats = (0, index_1.calculateStatistics)([-10, -5, 0, 5, 10]);
        expect(stats).toEqual({
            min: -10,
            max: 10,
            mean: 0,
            stdDev: Math.sqrt(50),
        });
    });
    it('handles values with high precision', () => {
        const stats = (0, index_1.calculateStatistics)([1.23456789, 2.34567890, 3.45678901]);
        expect(stats.mean).toBeCloseTo(2.34567860, 8);
    });
    it('handles repeated values', () => {
        const stats = (0, index_1.calculateStatistics)([1, 1, 1, 1, 1]);
        expect(stats).toEqual({ min: 1, max: 1, mean: 1, stdDev: 0 });
    });
});
describe('Classification Edge Cases', () => {
    it('handles skewed distributions', () => {
        const result = (0, index_1.calculateBreaks)([1, 2, 3, 100, 101, 102], {
            method: 'equalInterval',
            numBins: 3,
            roundIncrement: 0,
            includeMissing: false,
        });
        expectArraysClose(result.breaks, [1, 34.67, 68.33, 102]);
    });
    it('handles outliers in quantile classification', () => {
        const result = (0, index_1.calculateBreaks)([1, 2, 3, 4, 5, 1000], {
            method: 'quantile',
            numBins: 3,
            roundIncrement: 0,
            includeMissing: false,
        });
        expect(result.breaks.length).toBe(4);
        expect(result.breaks[0]).toBe(1);
        expect(result.breaks[result.breaks.length - 1]).toBe(1000);
    });
    it('handles precision with decimal rounding', () => {
        const result = (0, index_1.calculateBreaks)([1.23, 2.34, 3.45, 4.56, 5.67], {
            method: 'equalInterval',
            numBins: 4,
            roundIncrement: 0.1,
            includeMissing: false,
        });
        result.breaks.forEach(value => expect(value % 0.1).toBeCloseTo(0, 10));
    });
    it('gracefully handles numBins > unique values', () => {
        const result = (0, index_1.calculateBreaks)([1, 2, 3], {
            method: 'equalInterval',
            numBins: 10,
            roundIncrement: 0,
            includeMissing: false,
        });
        expect(result.breaks.length).toBeLessThanOrEqual(4);
    });
});
//# sourceMappingURL=edge-cases.test.js.map