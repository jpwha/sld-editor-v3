"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button = ({ children, onClick, disabled, className = '', }) => ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, disabled: disabled, className: `p-2 bg-blue-500 text-white rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} ${className}`, children: children }));
exports.Button = Button;
//# sourceMappingURL=Button.js.map