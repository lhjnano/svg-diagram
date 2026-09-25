// tools/svg-lint/lib/checks/text-clearance.mjs
// Two text rows whose horizontal spans overlap must keep cfg.clearance.textRows px of
// vertical breathing room. Titles sitting 5px above subtitles, and subtitles
// 5px above section headers, read as one glued block — the exact defect the
// box-clearance rule catches for boxes but nothing caught for text.
// Texts inside the same box are exempt: their spacing is the line-height
// rule's business (box-height/line-height-off).
import { warning } from '../report.mjs';
import { cfg } from '../config.mjs';

const ID = 'text-clearance';
const round = (v) => Number(v.toFixed(1));

const axisGap = (aMin, aMax, bMin, bMax) => Math.max(bMin - aMax, aMin - bMax, 0);

export const textClearance = {
  id: ID,
  title: 'Stacked text rows keep vertical breathing room',
  run(doc) {
    const out = [];
    const texts = doc.texts;
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        const a = texts[i];
        const b = texts[j];
        // Same box: line spacing is box-height's rule, not this one.
        if (a.container && a.container === b.container) continue;
        const dx = axisGap(a.bbox.minX, a.bbox.maxX, b.bbox.minX, b.bbox.maxX);
        if (dx > 0) continue; // side by side, not stacked
        const dy = axisGap(a.bbox.minY, a.bbox.maxY, b.bbox.minY, b.bbox.maxY);
        if (dy === 0) continue; // overlapping or same line: other rules own it
        if (dy >= cfg.clearance.textRows) continue;
        const upper = a.bbox.maxY < b.bbox.minY ? a : b;
        const lower = upper === a ? b : a;
        out.push(warning({
          check: ID, code: 'rows-too-close', line: lower.line, column: lower.column,
          message: `Text rows are ${round(dy)}px apart; the minimum breathing room is ${cfg.clearance.textRows}px`,
          repair: {
            actual: String(round(dy)),
            expected: `≥${cfg.clearance.textRows}`,
            hint: `move "${upper.content.slice(0, 24)}…" up or "${lower.content.slice(0, 24)}…" down`,
          },
        }));
      }
    }
    return out;
  },
};
