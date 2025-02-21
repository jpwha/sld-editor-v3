"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSld = exports.SldParsingError = void 0;
class SldParsingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SldParsingError';
    }
}
exports.SldParsingError = SldParsingError;
const parseSld = (sldText) => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sldText, 'application/xml');
        const sldNS = 'http://www.opengis.net/sld';
        const colorMapEntries = xmlDoc.getElementsByTagNameNS(sldNS, 'ColorMapEntry');
        const entries = Array.from(colorMapEntries).map(entry => ({
            color: entry.getAttribute('color') || '#000000',
            quantity: entry.getAttribute('quantity') || '0',
            label: entry.getAttribute('label') || entry.getAttribute('quantity') || '0',
            opacity: entry.getAttribute('opacity') || '1.0',
            baseLabel: entry.getAttribute('label') || entry.getAttribute('quantity') || '0',
        }));
        entries.sort((a, b) => parseFloat(a.quantity) - parseFloat(b.quantity));
        return entries;
    }
    catch (err) {
        throw new SldParsingError(`Error parsing SLD: ${err.message}`);
    }
};
exports.parseSld = parseSld;
//# sourceMappingURL=parser.js.map