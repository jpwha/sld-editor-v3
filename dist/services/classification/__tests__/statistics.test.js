"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('calculateStatistics', () => {
    it('calculates basic statistics correctly', () => {
        const values = [1, 2, 3, 4, 5];
        const stats = (0, index_1.calculateStatistics)(values);
        expect(stats).toEqual({
            min: 1,
            max: 5,
            mean: 3,
            stdDev: Math.sqrt(2),
        });
    });
    it('throws ClassificationError for empty array', () => {
        expect(() => (0, index_1.calculateStatistics)([])).toThrow(index_1.ClassificationError);
        expect(() => (0, index_1.calculateStatistics)([])).toThrow('No values provided for statistics calculation');
    });
    it('handles non-numeric values', () => {
        const values = [1, 2, NaN, 4, 5];
        expect(() => (0, index_1.calculateStatistics)(values)).toThrow(index_1.ClassificationError);
        expect(() => (0, index_1.calculateStatistics)(values)).toThrow('Non-numeric values detected');
    });
    it('handles single value arrays', () => {
        const stats = (0, index_1.calculateStatistics)([5]);
        expect(stats).toEqual({
            min: 5,
            max: 5,
            mean: 5,
            stdDev: 0,
        });
    });
});
//# sourceMappingURL=statistics.test.js.map