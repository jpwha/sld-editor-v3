"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sldEditorActions = void 0;
exports.sldEditorActions = {
    setEntries: (entries) => ({ type: 'SET_ENTRIES', payload: entries }),
    setError: (error) => ({ type: 'SET_ERROR', payload: error }),
    setLoading: (loading) => ({ type: 'SET_LOADING', payload: loading }),
    updateBinning: (updates) => ({ type: 'UPDATE_BINNING', payload: updates }),
    setSldText: (sldText) => ({ type: 'SET_SLD_TEXT', payload: sldText }),
    setOutputSld: (outputSld) => ({ type: 'SET_OUTPUT_SLD', payload: outputSld }),
    setDataType: (dataType) => ({ type: 'SET_DATA_TYPE', payload: dataType }),
    setUnit: (unit) => ({ type: 'SET_UNIT', payload: unit }),
    updateLegend: (updates) => ({ type: 'UPDATE_LEGEND', payload: updates }),
};
//# sourceMappingURL=sldEditor.js.map