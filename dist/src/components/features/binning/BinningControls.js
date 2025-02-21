"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinningControls = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SldEditorContext_1 = require("../../../context/SldEditorContext");
const useClassification_1 = require("../../../hooks/useClassification");
const sldEditor_1 = require("../../../actions/sldEditor");
const Card_1 = require("../../common/ui/Card");
const Button_1 = require("../../common/ui/Button");
const BinningControls = () => {
    const { state, dispatch } = (0, SldEditorContext_1.useSldEditorContext)();
    const { applyClassification } = (0, useClassification_1.useClassification)();
    const { binningControls, loading } = state;
    const handleNumBinsChange = (value) => {
        const numBins = Math.max(2, Math.min(20, parseInt(value, 10) || 2));
        dispatch(sldEditor_1.sldEditorActions.updateBinning({ numBins }));
    };
    const handleMethodChange = (value) => {
        dispatch(sldEditor_1.sldEditorActions.updateBinning({ method: value }));
    };
    const handleRoundIncrementChange = (value) => {
        const roundIncrement = parseFloat(value) || 0;
        dispatch(sldEditor_1.sldEditorActions.updateBinning({ roundIncrement }));
    };
    const handleIncludeMissingChange = (e) => {
        dispatch(sldEditor_1.sldEditorActions.updateBinning({ includeMissing: e.target.checked }));
    };
    return ((0, jsx_runtime_1.jsxs)(Card_1.Card, { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Classification" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Number of Classes" }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "2", max: "20", value: binningControls.numBins, onChange: e => handleNumBinsChange(e.target.value), className: "w-full p-2 border rounded", disabled: loading })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Classification Method" }), (0, jsx_runtime_1.jsxs)("select", { value: binningControls.method, onChange: e => handleMethodChange(e.target.value), className: "w-full p-2 border rounded", disabled: loading, children: [(0, jsx_runtime_1.jsx)("option", { value: "equalInterval", children: "Equal Interval" }), (0, jsx_runtime_1.jsx)("option", { value: "quantile", children: "Quantile" }), (0, jsx_runtime_1.jsx)("option", { value: "stdDev", children: "Standard Deviation" }), (0, jsx_runtime_1.jsx)("option", { value: "jenks", children: "Jenks Natural Breaks" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Round Increment" }), (0, jsx_runtime_1.jsx)("input", { type: "number", step: "any", value: binningControls.roundIncrement, onChange: e => handleRoundIncrementChange(e.target.value), className: "w-full p-2 border rounded", disabled: loading, placeholder: "0 for no rounding" })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: binningControls.includeMissing, onChange: handleIncludeMissingChange, disabled: loading }), (0, jsx_runtime_1.jsx)("span", { children: "Include Missing Values" })] }) }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: applyClassification, disabled: loading, children: loading ? 'Classifying...' : 'Apply Classifications' })] })] }));
};
exports.BinningControls = BinningControls;
//# sourceMappingURL=BinningControls.js.map