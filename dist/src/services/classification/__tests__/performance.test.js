"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('Classification Performance', () => {
    const generateLargeDataset = (size) => Array.from({ length: size }, (_, i) => Math.random() * 1000);
    it('handles large datasets efficiently - equal interval', () => {
        const largeValues = generateLargeDataset(10000);
        const start = performance.now();
        const result = (0, index_1.calculateBreaks)(largeValues, { method: 'equalInterval', numBins: 10, roundIncrement: 0, includeMissing: false });
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(100);
        expect(result.breaks.length).toBe(11);
    });
    it('handles large datasets efficiently - quantile', () => {
        const largeValues = generateLargeDataset(10000);
        const start = performance.now();
        const result = (0, index_1.calculateBreaks)(largeValues, { method: 'quantile', numBins: 10, roundIncrement: 0, includeMissing: false });
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(150);
        expect(result.breaks.length).toBe(11);
    });
    it('handles large datasets efficiently - jenks', () => {
        const largeValues = generateLargeDataset(10000);
        const start = performance.now();
        const result = (0, index_1.calculateBreaks)(largeValues, { method: 'jenks', numBins: 10, roundIncrement: 0, includeMissing: false });
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(500);
        expect(result.breaks.length).toBe(11);
    });
    it('maintains accuracy with large datasets', () => {
        const size = 10000;
        const values = Array.from({ length: size }, (_, i) => i);
        const result = (0, index_1.calculateBreaks)(values, { method: 'equalInterval', numBins: 10, roundIncrement: 0, includeMissing: false });
        expect(result.breaks[0]).toBe(0);
        expect(result.breaks[result.breaks.length - 1]).toBe(size - 1);
        const step = (size - 1) / 10;
        result.breaks.forEach((break_, i) => expect(break_).toBeCloseTo(i * step, 0));
    });
});
//# sourceMappingURL=performance.test.js.map