import { ColorMapEntry } from '../../types/sld.types';

export const generateSld = (entries: ColorMapEntry[], originalSld: string): string => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(originalSld, 'application/xml');
    const sldNS = 'http://www.opengis.net/sld';
    const colorMap = xmlDoc.getElementsByTagNameNS(sldNS, 'ColorMap')[0];
    if (!colorMap) return originalSld;

    while (colorMap.firstChild) {
      colorMap.removeChild(colorMap.firstChild);
    }

    // Create a map of label to color for unique labels
    const labelColorMap = new Map<string, string>();
    entries.forEach(entry => {
      if (!labelColorMap.has(entry.label)) {
        labelColorMap.set(entry.label, entry.color);
      }
    });

    // Group entries by label, preserving all original quantities
    const uniqueLabels = Array.from(new Set(entries.map(e => e.label)));
    const groupedEntries = entries.reduce((acc, entry) => {
      if (!acc[entry.label]) acc[entry.label] = [];
      acc[entry.label].push(entry);
      return acc;
    }, {} as Record<string, ColorMapEntry[]>);

    uniqueLabels.forEach(label => {
      const color = labelColorMap.get(label) || '#000000';
      const group = groupedEntries[label] || [];
      group.forEach(entry => {
        const newEntry = xmlDoc.createElementNS(sldNS, 'sld:ColorMapEntry');
        newEntry.setAttribute('color', color);
        newEntry.setAttribute('quantity', entry.quantity); // Preserve original quantity
        newEntry.setAttribute('label', label);
        newEntry.setAttribute('opacity', entry.opacity || '1.0');
        colorMap.appendChild(newEntry);
      });
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc).replace(/>\s*</g, '>\n<');
  } catch (err) {
    console.error('Error generating SLD:', err);
    return originalSld;
  }
};