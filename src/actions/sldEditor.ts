import { ColorMapEntry, BinningControls, EditableLegend, DataType, Unit } from '../types/sld.types';

export const sldEditorActions = {
  setEntries: (entries: ColorMapEntry[]) => ({ type: 'SET_ENTRIES' as const, payload: entries }),
  setError: (error: string | null) => ({ type: 'SET_ERROR' as const, payload: error }),
  setLoading: (loading: boolean) => ({ type: 'SET_LOADING' as const, payload: loading }),
  updateBinning: (updates: Partial<BinningControls>) => ({ type: 'UPDATE_BINNING' as const, payload: updates }),
  setSldText: (sldText: string) => ({ type: 'SET_SLD_TEXT' as const, payload: sldText }),
  setOutputSld: (outputSld: string) => ({ type: 'SET_OUTPUT_SLD' as const, payload: outputSld }),
  setDataType: (dataType: DataType) => ({ type: 'SET_DATA_TYPE' as const, payload: dataType }),
  setUnit: (unit: Unit) => ({ type: 'SET_UNIT' as const, payload: unit }),
  updateLegend: (updates: Partial<EditableLegend>) => ({ type: 'UPDATE_LEGEND' as const, payload: updates }),
};