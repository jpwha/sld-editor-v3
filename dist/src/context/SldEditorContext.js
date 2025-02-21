"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SldEditorProvider = void 0;
exports.useSldEditorContext = useSldEditorContext;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const initialState = {
    entries: [],
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
const SldEditorContext = (0, react_1.createContext)(undefined);
function sldEditorReducer(state, action) {
    switch (action.type) {
        case 'SET_ENTRIES':
            return Object.assign(Object.assign({}, state), { entries: action.payload, error: null });
        case 'SET_ERROR':
            return Object.assign(Object.assign({}, state), { error: action.payload });
        case 'SET_LOADING':
            return Object.assign(Object.assign({}, state), { loading: action.payload });
        case 'UPDATE_BINNING':
            return Object.assign(Object.assign({}, state), { binningControls: Object.assign(Object.assign({}, state.binningControls), action.payload) });
        case 'SET_SLD_TEXT':
            return Object.assign(Object.assign({}, state), { sldText: action.payload });
        case 'SET_OUTPUT_SLD':
            return Object.assign(Object.assign({}, state), { outputSld: action.payload });
        case 'SET_DATA_TYPE':
            return Object.assign(Object.assign({}, state), { dataType: action.payload, selectedUnit: action.payload.units[0], binningControls: Object.assign(Object.assign({}, state.binningControls), { numBins: action.payload.defaultBins }) });
        case 'SET_UNIT':
            return Object.assign(Object.assign({}, state), { selectedUnit: action.payload });
        case 'UPDATE_LEGEND':
            return Object.assign(Object.assign({}, state), { editableLegend: Object.assign(Object.assign({}, state.editableLegend), action.payload) });
        default:
            return state;
    }
}
const SldEditorProvider = ({ children }) => {
    const [state, dispatch] = (0, react_1.useReducer)(sldEditorReducer, initialState);
    const value = (0, react_1.useMemo)(() => ({ state, dispatch }), [state]);
    return (0, jsx_runtime_1.jsx)(SldEditorContext.Provider, { value: value, children: children });
};
exports.SldEditorProvider = SldEditorProvider;
function useSldEditorContext() {
    const context = (0, react_1.useContext)(SldEditorContext);
    if (!context)
        throw new Error('useSldEditorContext must be used within SldEditorProvider');
    return context;
}
//# sourceMappingURL=SldEditorContext.js.map