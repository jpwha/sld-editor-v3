export type ClassificationMethod = 'equalInterval' | 'quantile' | 'jenks' | 'stdDev';

export interface ClassificationOptions {
  method: ClassificationMethod;
  numBins: number;
  roundIncrement: number;
  includeMissing: boolean;
}

export interface ClassificationResult {
  breaks: number[];
  statistics: { min: number; max: number; mean: number; stdDev: number };
}

export class ClassificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClassificationError';
  }
}