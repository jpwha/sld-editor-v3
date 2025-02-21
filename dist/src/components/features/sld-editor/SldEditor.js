"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SldEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const BinningControls_1 = require("../binning/BinningControls");
const Card_1 = require("../../common/ui/Card");
const SldEditorContext_1 = require("../../../context/SldEditorContext");
const SldEditor = () => {
    const { state } = (0, SldEditorContext_1.useSldEditorContext)();
    const { error, entries } = state;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(BinningControls_1.BinningControls, {}), (0, jsx_runtime_1.jsxs)(Card_1.Card, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Entries Preview" }), error && (0, jsx_runtime_1.jsx)("div", { className: "text-red-600 mb-4", children: error }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: entries.map((entry, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 border border-gray-300", style: { backgroundColor: entry.color } }), (0, jsx_runtime_1.jsx)("span", { children: entry.label })] }, index))) })] })] }));
};
exports.SldEditor = SldEditor;
//# sourceMappingURL=SldEditor.js.map