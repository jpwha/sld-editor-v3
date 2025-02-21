import { ColorMapEntry } from '../../types/sld.types';

export class SldParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SldParsingError';
  }
}

export const parseSld = (sldText: string): ColorMapEntry[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sldText, 'application/xml');
    const sldNS = 'http://www.opengis.net/sld';
    const colorMapEntries = xmlDoc.getElementsByTagNameNS(sldNS, 'ColorMapEntry');
    const entries: ColorMapEntry[] = Array.from(colorMapEntries).map(entry => ({
      color: entry.getAttribute('color') || '#000000',
      quantity: entry.getAttribute('quantity') || '0', // Grayscale index
      label: entry.getAttribute('label') || entry.getAttribute('quantity') || '0', // Data value to classify
      opacity: entry.getAttribute('opacity') || '1.0',
      baseLabel: entry.getAttribute('label') || entry.getAttribute('quantity') || '0',
    }));
    // Keep original order for now; classification will sort by label if needed
    return entries;
  } catch (err) {
    throw new SldParsingError(`Error parsing SLD: ${(err as Error).message}`);
  }
};