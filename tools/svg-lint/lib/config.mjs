// tools/svg-lint/lib/config.mjs
// Every tunable the checks and --fix read, in one place. Defaults reproduce
// this repository's house style exactly; a project overrides them with a
// svg-lint.config.mjs / .svglintrc.mjs / svg-lint.config.json file (found in
// the working directory, or passed with --config). Values are read at lint
// time, so setConfig() before linting decides everything.
const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export const defaultConfig = {
  palette: {
    colors: [
      '#546e7a', '#8b949e', '#37474f', '#3fb950', '#ffffff',
      '#78909c', '#58a6ff', '#263238', '#f85149', '#e6edf3',
      '#161b22', '#555555', '#1976d2', '#30363d', '#bc8cff',
      '#0d47a1', '#8892aa', '#888888', '#e3f2fd', '#1565c0',
      '#22d3ee',
    ],
    allowCssVariables: true,
    skipUndeclared: true,
    // Fill/stroke/text triples for the semantic-pairing rule; an empty array
    // disables pairing entirely (a custom palette usually has no triples).
    semanticTriples: [
      { name: 'input', fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
      { name: 'processing', fill: '#fef3c7', stroke: '#f59e0b', text: '#b45309' },
      { name: 'output', fill: '#d1fae5', stroke: '#22c55e', text: '#166534' },
      { name: 'analysis', fill: '#f3e8ff', stroke: '#a855f7', text: '#6b21a8' },
      { name: 'warning', fill: '#fce7f3', stroke: '#ec4899', text: '#9d174d' },
    ],
  },
  font: {
    stack: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic'],
    declaration: 'style', // 'style' | 'inline'
  },
  spacing: {
    minHorizontal: 25, minVertical: 25,
    maxHorizontal: 30, maxVertical: 30,
  },
  viewBox: {
    marginMin: 20, marginMax: 25, symmetryTolerance: 5,
    widthRequired: true,
  },
  box: {
    heightFactor: 3,
    lineFactor: 1.3,
    lineHeightFactor: 1.5,
    heightTolerance: 0.5,
    lineSpacingTolerance: 1,
    minHeight: null,
  },
  clearance: {
    labelToBox: 15,
    textRows: 15,
    curveLabel: 15,
    textLine: 10,
    detour: 20,
    paddingImbalance: 20,
  },
  vertical: {
    baselineTolerance: 1,
    centerTolerance: 1,
    blockTolerance: 1,
  },
  labels: {
    leftInsetMin: 8,
    leftInsetMax: 24,
  },
};

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function mergeInto(target, overrides) {
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (isPlainObject(value) && isPlainObject(target[key])) mergeInto(target[key], value);
    else target[key] = value; // arrays and scalars replace wholesale
  }
  return target;
}

export const cfg = clone(defaultConfig);

export function setConfig(overrides) {
  mergeInto(cfg, overrides ?? {});
  return cfg;
}

export const canonicalFontStack = () => `'${cfg.font.stack.join("', '")}', system-ui, sans-serif`;
