import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { ColorMapEntry, BinningControls, EditableLegend, DataType, Unit } from '../types/sld.types';
import { SldEditorAction } from '../types/actions.types';

export interface SldEditorState {
  entries: ColorMapEntry[];
  initialEntries: ColorMapEntry[];
  binningControls: BinningControls;
  dataType: DataType;
  selectedUnit: Unit;
  sldText: string;
  outputSld: string;
  editableLegend: EditableLegend;
  loading: boolean;
  error: string | null;
}

const initialState: SldEditorState = {
  entries: [],
  initialEntries: [],
  binningControls: {
    numBins: 5,
    method: 'equalInterval',
    roundIncrement: 0,
    includeMissing: false,
  },
  dataType: {
    id: 'roads',
    label: 'Roads',
    units: [
      { id: 'km', label: 'Kilometers (km)' },
      { id: 'mi', label: 'Miles (mi)' },
    ],
    defaultBins: 5,
    defaultColors: ['#ff0000', '#00ff00'],
  },
  selectedUnit: { id: 'km', label: 'Kilometers (km)' },
  sldText: '',
  outputSld: '',
  editableLegend: {
    colorPickerType: 'chrome',
    gradientPreset: 'Spectral',
    reverseRangeDisplay: false,
    decimalPlaces: 2,
    displayAsPercentage: false,
  },
  loading: false,
  error: null,
};

const SldEditorContext = createContext<{
  state: SldEditorState;
  dispatch: React.Dispatch<SldEditorAction>;
} | undefined>(undefined);

function sldEditorReducer(state: SldEditorState, action: SldEditorAction): SldEditorState {
  switch (action.type) {
    case 'SET_ENTRIES':
      // If sldText is present and initialEntries is empty, this is a parse action
      const isParseAction = state.sldText && state.initialEntries.length === 0;
      return {
        ...state,
        entries: action.payload,
        initialEntries: isParseAction ? action.payload : state.initialEntries,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_BINNING':
      return { ...state, binningControls: { ...state.binningControls, ...action.payload } };
    case 'SET_SLD_TEXT':
      return { ...state, sldText: action.payload, initialEntries: [], entries: [] }; // Reset on new SLD input
    case 'SET_OUTPUT_SLD':
      return { ...state, outputSld: action.payload };
    case 'SET_DATA_TYPE':
      return {
        ...state,
        dataType: action.payload,
        selectedUnit: action.payload.units[0],
        binningControls: { ...state.binningControls, numBins: action.payload.defaultBins },
      };
    case 'SET_UNIT':
      return { ...state, selectedUnit: action.payload };
    case 'UPDATE_LEGEND':
      return { ...state, editableLegend: { ...state.editableLegend, ...action.payload } };
    default:
      return state;
  }
}

export const SldEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sldEditorReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SldEditorContext.Provider value={value}>{children}</SldEditorContext.Provider>;
};

export function useSldEditorContext() {
  const context = useContext(SldEditorContext);
  if (!context) throw new Error('useSldEditorContext must be used within SldEditorProvider');
  return context;
}