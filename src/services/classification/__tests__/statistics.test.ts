 
import { calculateStatistics, ClassificationError } from '../index';

describe('calculateStatistics', () => {
  it('calculates basic statistics correctly', () => {
    const values = [1, 2, 3, 4, 5];
    const stats = calculateStatistics(values);
    expect(stats).toEqual({
      min: 1,
      max: 5,
      mean: 3,
      stdDev: Math.sqrt(2),
    });
  });

  it('throws ClassificationError for empty array', () => {
    expect(() => calculateStatistics([])).toThrow(ClassificationError);
    expect(() => calculateStatistics([])).toThrow('No values provided for statistics calculation');
  });

  it('handles non-numeric values', () => {
    const values = [1, 2, NaN, 4, 5];
    expect(() => calculateStatistics(values)).toThrow(ClassificationError);
    expect(() => calculateStatistics(values)).toThrow('Non-numeric values detected');
  });

  it('handles single value arrays', () => {
    const stats = calculateStatistics([5]);
    expect(stats).toEqual({
      min: 5,
      max: 5,
      mean: 5,
      stdDev: 0,
    });
  });
});