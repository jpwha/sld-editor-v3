"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        var _a;
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-red-50 text-red-600 rounded", children: (0, jsx_runtime_1.jsxs)("h2", { children: ["Error: ", (_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message] }) }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map