function svg(w: number, content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${w}" height="${w}" fill="none">${content}</svg>`;
}

// Minimal sun - just a circle
const SUN = `<circle cx="32" cy="32" r="14" fill="#F0C040"/>`;

// Minimal small sun (peeking)
const SUN_SM = `<circle cx="16" cy="18" r="10" fill="#F0C040"/>`;

// Minimal cloud
const CL = `<path d="M18 44h28c6 0 10-4 10-9s-4-9-8-9c0-8-6-14-15-14-7 0-13 5-14 11-6 1-11 5-11 11 0 6 4 10 10 10z" fill="#90A4C0"/>`;

// Darker cloud
const CLD = `<path d="M18 44h28c6 0 10-4 10-9s-4-9-8-9c0-8-6-14-15-14-7 0-13 5-14 11-6 1-11 5-11 11 0 6 4 10 10 10z" fill="#607090"/>`;

// Front cloud (for sun+cloud combo)
const CLF = `<path d="M20 48h26c5 0 9-3.5 9-8s-3.5-8-7-8c0-7-5.5-12-13-12-6 0-11 4-12 10-5.5 0.5-10 4.5-10 10 0 5 3.5 8 7 8z" fill="#90A4C0"/>`;

// Rain drops - simple vertical lines
const RAIN = `<g stroke="#60A8E8" stroke-width="2.5" stroke-linecap="round">
  <line x1="24" y1="49" x2="24" y2="57"/>
  <line x1="33" y1="49" x2="33" y2="57"/>
  <line x1="42" y1="49" x2="42" y2="57"/>
</g>`;

// Light rain - fewer drops
const RAIN_L = `<g stroke="#60A8E8" stroke-width="2" stroke-linecap="round" opacity="0.7">
  <line x1="27" y1="49" x2="27" y2="55"/>
  <line x1="37" y1="49" x2="37" y2="55"/>
</g>`;

// Heavy rain
const RAIN_H = `<g stroke="#60A8E8" stroke-width="3" stroke-linecap="round">
  <line x1="21" y1="49" x2="21" y2="58"/>
  <line x1="30" y1="49" x2="30" y2="58"/>
  <line x1="39" y1="49" x2="39" y2="58"/>
  <line x1="47" y1="49" x2="47" y2="58"/>
</g>`;

// Snow - simple dots
const SNOW = `<g fill="#C0D8F0">
  <circle cx="24" cy="52" r="2.5"/>
  <circle cx="33" cy="54" r="2.5"/>
  <circle cx="42" cy="52" r="2.5"/>
</g>`;

// Lightning - simple bolt
const BOLT = `<path d="M35 22L28 36h7l-5 14 12-16h-7l5-12z" fill="#F0C040"/>`;

// Fog - horizontal lines
const FOG = `<g stroke="#7888A8" stroke-width="2.5" stroke-linecap="round">
  <line x1="12" y1="34" x2="52" y2="34"/>
  <line x1="16" y1="42" x2="48" y2="42"/>
  <line x1="12" y1="50" x2="52" y2="50"/>
</g>`;

// Ice - small asterisks
const ICE = `<g stroke="#90D0F0" stroke-width="2" stroke-linecap="round">
  <line x1="26" y1="49" x2="26" y2="57"/><line x1="22" y1="53" x2="30" y2="53"/>
  <line x1="40" y1="49" x2="40" y2="57"/><line x1="36" y1="53" x2="44" y2="53"/>
</g>`;

export function weatherIcon(code: number, size: number): string {
  switch (code) {
    case 0:  return svg(size, SUN);
    case 1:  return svg(size, SUN_SM + CLF);
    case 2:  return svg(size, SUN_SM + CL);
    case 3:  return svg(size, CL);
    case 45:
    case 48: return svg(size, FOG);
    case 51:
    case 53: return svg(size, CL + RAIN_L);
    case 55: return svg(size, CL + RAIN);
    case 56:
    case 57: return svg(size, CLD + ICE);
    case 61: return svg(size, CL + RAIN_L);
    case 63: return svg(size, CL + RAIN);
    case 65: return svg(size, CLD + RAIN_H);
    case 66:
    case 67: return svg(size, CLD + ICE);
    case 71:
    case 73: return svg(size, CL + SNOW);
    case 75:
    case 77: return svg(size, CLD + SNOW);
    case 80:
    case 81: return svg(size, CL + RAIN);
    case 82: return svg(size, CLD + RAIN_H);
    case 85:
    case 86: return svg(size, CLD + SNOW);
    case 95: return svg(size, CLD + BOLT);
    case 96:
    case 99: return svg(size, CLD + BOLT + RAIN);
    default: return svg(size, CL);
  }
}
