import { ColorMapEntry, BinningControls, EditableLegend, DataType, Unit } from './sld.types';

export type SldEditorAction =
  | { type: 'SET_ENTRIES'; payload: ColorMapEntry[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_BINNING'; payload: Partial<BinningControls> }
  | { type: 'SET_SLD_TEXT'; payload: string }
  | { type: 'SET_OUTPUT_SLD'; payload: string }
  | { type: 'SET_DATA_TYPE'; payload: DataType }
  | { type: 'SET_UNIT'; payload: Unit }
  | { type: 'UPDATE_LEGEND'; payload: Partial<EditableLegend> };