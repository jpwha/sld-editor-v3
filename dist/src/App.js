"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const SldEditorContext_1 = require("./context/SldEditorContext");
const ErrorBoundary_1 = require("./components/common/ErrorBoundary");
const SldEditor_1 = require("./components/features/sld-editor/SldEditor");
const App = () => ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(SldEditorContext_1.SldEditorProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-4", children: "SLD Editor" }), (0, jsx_runtime_1.jsx)(SldEditor_1.SldEditor, {})] }) }) }));
exports.default = App;
//# sourceMappingURL=App.js.map