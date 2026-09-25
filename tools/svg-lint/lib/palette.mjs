// tools/svg-lint/lib/palette.mjs
// The sole numeric source for the house palette, copied verbatim from SKILL.md "Colors" and "Arrowhead definitions".
// All check modules must read values from here; writing hex literals inline is not allowed.

export const BASE_TEXT = {
  primary: '#1e293b',
  secondary: '#64748b',
  muted: '#94a3b8',
};

export const SEMANTIC = [
  { name: 'input', fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
  { name: 'processing', fill: '#fef3c7', stroke: '#f59e0b', text: '#b45309' },
  { name: 'output', fill: '#d1fae5', stroke: '#22c55e', text: '#166534' },
  { name: 'analysis', fill: '#f3e8ff', stroke: '#a855f7', text: '#6b21a8' },
  { name: 'warning', fill: '#fce7f3', stroke: '#ec4899', text: '#9d174d' },
];

export const ARROW_COLORS = {
  arrow: '#64748b',
  'arrow-blue': '#3b82f6',
  'arrow-orange': '#f59e0b',
  'arrow-green': '#22c55e',
  'arrow-purple': '#a855f7',
  'arrow-red': '#ef4444',
};

export const GROUP_BOX = {
  fill: '#f8fafc',
  stroke: '#94a3b8',
  dasharray: '6,4',
};

export const ALLOWED_COLORS = new Set([
  ...Object.values(BASE_TEXT),
  ...SEMANTIC.flatMap((s) => [s.fill, s.stroke, s.text]),
  ...Object.values(ARROW_COLORS),
  GROUP_BOX.fill,
  GROUP_BOX.stroke,
  'none',
  '#ffffff',
]);

// The allowed colors live in config.mjs (cfg.palette.colors) and are
// replaced wholesale by a project config.
import { cfg } from './config.mjs';

// CSS custom properties (var(--accent), …) resolve in the embedding HTML page,
// not inside the SVG file — the linter cannot judge them, so it doesn't.
const CSS_VARIABLE = /^var\(/i;
const HEX3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX6 = /^#[0-9a-f]{6}$/i;
const RGB = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
// CSS colour names that appear in the corpus; compared numerically like the rest.
const CSS_NAMES = {
  white: '#ffffff', black: '#000000', red: '#ff0000', lime: '#00ff00',
  blue: '#0000ff', yellow: '#ffff00', cyan: '#00ffff', aqua: '#00ffff',
  magenta: '#ff00ff', fuchsia: '#ff00ff', silver: '#c0c0c0', gray: '#808080',
  grey: '#808080', maroon: '#800000', olive: '#808000', green: '#008000',
  purple: '#800080', teal: '#008080', navy: '#000080', orange: '#ffa500',
};
const toHex = (v) => {
  const s = String(v).trim().toLowerCase();
  let m;
  if ((m = s.match(HEX3))) return '#' + m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
  if (HEX6.test(s)) return s;
  if (CSS_NAMES[s]) return CSS_NAMES[s];
  if ((m = s.match(RGB))) {
    return '#' + m.slice(1).map((n) => (+n).toString(16).padStart(2, '0')).join('');
  }
  return null;
};
export const isAllowedColor = (value) => {
  if (cfg.palette.allowCssVariables && CSS_VARIABLE.test(value)) return true;
  const hex = toHex(value);
  return hex !== null && cfg.palette.colors.includes(hex);
};

export const semanticByFill = (hex) => cfg.palette.semanticTriples.find((s) => s.fill === hex);
export const semanticByStroke = (hex) => cfg.palette.semanticTriples.find((s) => s.stroke === hex);
