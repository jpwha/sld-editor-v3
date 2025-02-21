"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationError = void 0;
class ClassificationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ClassificationError';
    }
}
exports.ClassificationError = ClassificationError;
//# sourceMappingURL=types.js.map