export interface ColorMapEntry {
    color: string;
    quantity: string;
    label: string;
    opacity?: string;
    baseLabel?: string;
  }
  
  export interface Unit {
    id: string;
    label: string;
  }
  
  export interface DataType {
    id: string;
    label: string;
    units: Unit[];
    defaultBins: number;
    defaultColors: string[];
  }
  
  export interface BinningControls {
    numBins: number;
    method: 'equalInterval' | 'quantile' | 'jenks' | 'stdDev';
    roundIncrement: number;
    includeMissing: boolean;
  }
  
  export interface EditableLegend {
    colorPickerType: string;
    gradientPreset: string;
    reverseRangeDisplay: boolean;
    decimalPlaces: number;
    displayAsPercentage: boolean;
  }