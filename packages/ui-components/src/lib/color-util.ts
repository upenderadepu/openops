type HSL = {
  hue: number;
  saturation: number;
  lightness: number;
};

const hexToHslString = (hex: string): string => {
  if (hex === '#fff' || hex === '#ffffff') {
    return 'hsl(0, 0%, 100%)';
  }
  if (hex === '#000' || hex === '#000000') {
    return 'hsl(0, 0%, 0%)';
  }

  const { hue, saturation, lightness } = parseToHsl(hex);
  return `${hue.toFixed(1)} ${(saturation * 100).toFixed(1)}% ${(
    lightness * 100
  ).toFixed(1)}%`;
};

const parseToHsl = (hex: string): HSL => {
  // Remove the '#' character if it exists
  hex = hex.replace(/^#/, '');

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the maximum and minimum values to get lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate lightness
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;

    // Calculate saturation
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate hue
    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }

    hue /= 6;
  }

  // Convert hue to degrees
  hue = hue * 360;

  return {
    hue,
    saturation,
    lightness,
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const colorsUtils = {
  hexToHslString,
  parseToHsl,
  hslToHex,
};
