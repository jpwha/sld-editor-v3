"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSld = void 0;
const generateSld = (entries, originalSld) => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(originalSld, 'application/xml');
        const sldNS = 'http://www.opengis.net/sld';
        const colorMap = xmlDoc.getElementsByTagNameNS(sldNS, 'ColorMap')[0];
        if (!colorMap)
            return originalSld;
        while (colorMap.firstChild) {
            colorMap.removeChild(colorMap.firstChild);
        }
        entries.forEach(entry => {
            const newEntry = xmlDoc.createElementNS(sldNS, 'sld:ColorMapEntry');
            newEntry.setAttribute('color', entry.color);
            newEntry.setAttribute('quantity', entry.quantity);
            newEntry.setAttribute('label', entry.label);
            newEntry.setAttribute('opacity', entry.opacity || '1.0');
            colorMap.appendChild(newEntry);
        });
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc).replace(/>\s*</g, '>\n<');
    }
    catch (err) {
        console.error('Error generating SLD:', err);
        return originalSld;
    }
};
exports.generateSld = generateSld;
//# sourceMappingURL=generator.js.map