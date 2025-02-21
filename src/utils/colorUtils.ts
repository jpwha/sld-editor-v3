export function getMultiStopColor(colors: string[], t: number): string {
    if (colors.length === 0) return '#000000';
    if (colors.length === 1) return colors[0];
    if (t <= 0) return colors[0];
    if (t >= 1) return colors[colors.length - 1];
  
    const segment = (colors.length - 1) * t;
    const i = Math.floor(segment);
    const frac = segment - i;
  
    const c1 = hexToRgb(colors[i]);
    const c2 = hexToRgb(colors[i + 1]);
    const r = Math.round(c1.r + (c2.r - c1.r) * frac);
    const g = Math.round(c1.g + (c2.g - c1.g) * frac);
    const b = Math.round(c1.b + (c2.b - c1.b) * frac);
  
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }