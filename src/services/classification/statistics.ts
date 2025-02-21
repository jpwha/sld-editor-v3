import { ClassificationError } from './types';

export function calculateStatistics(values: number[]): {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
} {
  if (!values.length) throw new ClassificationError('No values provided for statistics calculation');
  if (!values.every(v => typeof v === 'number' && !isNaN(v))) {
    throw new ClassificationError('Non-numeric values detected');
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { min, max, mean, stdDev };
}