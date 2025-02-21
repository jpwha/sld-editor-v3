"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassification = useClassification;
const react_1 = require("react");
const SldEditorContext_1 = require("../context/SldEditorContext");
const classification_1 = require("../services/classification");
const sldEditor_1 = require("../actions/sldEditor");
function useClassification() {
    const { state, dispatch } = (0, SldEditorContext_1.useSldEditorContext)();
    const applyClassification = (0, react_1.useCallback)(() => {
        dispatch(sldEditor_1.sldEditorActions.setLoading(true));
        try {
            const values = state.entries.map(e => parseFloat(e.quantity)).filter(v => !isNaN(v));
            const result = (0, classification_1.calculateBreaks)(values, {
                method: state.binningControls.method,
                numBins: state.binningControls.numBins,
                roundIncrement: state.binningControls.roundIncrement,
                includeMissing: state.binningControls.includeMissing,
            });
            const newEntries = result.breaks.slice(0, -1).map((start, i) => {
                var _a;
                const end = result.breaks[i + 1];
                const label = state.editableLegend.displayAsPercentage
                    ? `${(i * 100 / state.binningControls.numBins).toFixed(state.editableLegend.decimalPlaces)}% - ${((i + 1) * 100 / state.binningControls.numBins).toFixed(state.editableLegend.decimalPlaces)}%`
                    : state.editableLegend.reverseRangeDisplay
                        ? `${end.toFixed(state.editableLegend.decimalPlaces)} - ${start.toFixed(state.editableLegend.decimalPlaces)}`
                        : `${start.toFixed(state.editableLegend.decimalPlaces)} - ${end.toFixed(state.editableLegend.decimalPlaces)}`;
                return {
                    color: ((_a = state.entries[i]) === null || _a === void 0 ? void 0 : _a.color) || '#000000',
                    quantity: start.toString(),
                    label,
                    opacity: '1.0',
                    baseLabel: label,
                };
            });
            if (state.binningControls.includeMissing) {
                newEntries.push({
                    color: '#000000',
                    quantity: (result.statistics.max + 1).toString(),
                    label: 'Missing (nan/na/null/-999)',
                    opacity: '1.0',
                    baseLabel: 'Missing (nan/na/null/-999)',
                });
            }
            dispatch(sldEditor_1.sldEditorActions.setEntries(newEntries));
        }
        catch (error) {
            dispatch(sldEditor_1.sldEditorActions.setError(error instanceof classification_1.ClassificationError ? error.message : 'Unexpected error during classification'));
        }
        finally {
            dispatch(sldEditor_1.sldEditorActions.setLoading(false));
        }
    }, [state.entries, state.binningControls, state.editableLegend, dispatch]);
    return { applyClassification };
}
//# sourceMappingURL=useClassification.js.map