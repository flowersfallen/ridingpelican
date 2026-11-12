function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Normalizes an archived SVG string for safe, responsive preview inside an <img> tag
 * without altering the raw source string displayed in the code inspector.
 */
export function prepareSvgDataUri(rawSvg: string): string {
  let svg = rawSvg.trim();

  // Ensure XML namespace exists so browsers render data:image/svg+xml reliably
  if (!/\bxmlns\s*=/i.test(svg)) {
    svg = svg.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Ensure a viewBox exists so fixed-pixel SVGs scale cleanly inside responsive cards
  if (!/\bviewBox\s*=/i.test(svg)) {
    const svgTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
    const widthMatch = svgTag.match(/(?:^|\s)width\s*=\s*["']?(\d+(?:\.\d+)?)/i);
    const heightMatch = svgTag.match(/(?:^|\s)height\s*=\s*["']?(\d+(?:\.\d+)?)/i);
    const w = widthMatch ? widthMatch[1] : '800';
    const h = heightMatch ? heightMatch[1] : '600';
    svg = svg.replace(/<svg\b/i, `<svg viewBox="0 0 ${w} ${h}"`);
  }

  // Normalize root width/height so the vector fills its container proportionally
  svg = svg.replace(/<svg([^>]*)>/i, (_full, attrs: string) => {
    const cleaned = attrs
      .replace(/(^|\s)width\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, '$1')
      .replace(/(^|\s)height\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, '$1');
    return `<svg${cleaned} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
  });

  return `data:image/svg+xml;base64,${toBase64Utf8(svg)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
