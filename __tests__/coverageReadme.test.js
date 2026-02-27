import fs from 'fs';
import path from 'path';

function extractCoverageTableFromReadme(readmeText) {
  const headerRegex = /##\s*Test Coverage\s*\n([\s\S]*)/i;
  const match = readmeText.match(headerRegex);
  if (!match) throw new Error('Test Coverage section not found in README');
  const after = match[1];
  // capture the table block (starting with a pipe and ending at a blank line or end)
  const tableMatch = after.match(/\|[\s\S]*?\|\s*%?\s*\n(?:\n|$)/m) || after.match(/(\|[\s\S]*?)\n\n/);
  // fallback: collect lines starting with |
  let tableText = '';
  if (tableMatch) {
    tableText = tableMatch[0];
  } else {
    const lines = after.split(/\r?\n/);
    const tableLines = [];
    for (const l of lines) {
      if (l.trim().startsWith('|')) tableLines.push(l);
      else if (tableLines.length > 0) break;
    }
    if (tableLines.length === 0) throw new Error('Coverage table not found after Test Coverage header');
    tableText = tableLines.join('\n');
  }
  return tableText.trim();
}

function parseCoverageTable(tableText) {
  const lines = tableText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // expect header + separator + rows
  if (lines.length < 3) throw new Error('Coverage table appears too small');
  const rows = lines.slice(2); // skip header and separator
  const map = {};
  for (const r of rows) {
    const cols = r.split('|').map((c) => c.trim()).filter(Boolean);
    if (cols.length >= 2) {
      const name = cols[0];
      const val = cols[1];
      const m = val.match(/([\d.]+)\s*%/);
      if (m) map[name.toLowerCase()] = Number(m[1]);
    }
  }
  return map;
}

function validateReadmeCoverage(readmeText, coverageTotals, tolerance = 0.1) {
  const tableText = extractCoverageTableFromReadme(readmeText);
  const tableMap = parseCoverageTable(tableText);
  const expected = {
    lines: coverageTotals.lines && coverageTotals.lines.pct != null ? coverageTotals.lines.pct : null,
    statements: coverageTotals.statements && coverageTotals.statements.pct != null ? coverageTotals.statements.pct : null,
    functions: coverageTotals.functions && coverageTotals.functions.pct != null ? coverageTotals.functions.pct : null,
    branches: coverageTotals.branches && coverageTotals.branches.pct != null ? coverageTotals.branches.pct : null,
  };
  for (const key of Object.keys(expected)) {
    const exp = expected[key];
    if (exp === null) throw new Error(`Coverage JSON missing total.${key}`);
    const found = tableMap[key];
    if (typeof found !== 'number') throw new Error(`Coverage table missing row for ${key}`);
    const diff = Math.abs(found - exp);
    if (diff > tolerance) throw new Error(`Coverage mismatch for ${key}: README ${found}% vs coverage ${exp}% (diff ${diff}%)`);
  }
  return true;
}

const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
const readmePath = path.join(process.cwd(), 'README.md');

describe('README coverage table sync', () => {
  test('README contains Test Coverage table matching coverage/coverage-summary.json', () => {
    const coverageJson = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const readme = fs.readFileSync(readmePath, 'utf8');
    expect(() => validateReadmeCoverage(readme, coverageJson.total)).not.toThrow();
  });

  test('throws when README is missing the Test Coverage section', () => {
    const coverageJson = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const badReadme = '# Project\n\nNo coverage here';
    expect(() => validateReadmeCoverage(badReadme, coverageJson.total)).toThrow(/Test Coverage section not found/);
  });

  test('throws when percentages differ more than tolerance', () => {
    const coverageJson = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const readmeOriginal = fs.readFileSync(readmePath, 'utf8');
    // tweak one percentage by +5
    const modified = readmeOriginal.replace(/(\| Lines \|\s*)([\d.]+)%/i, (_m, p1, v) => `${p1}${(Number(v) + 5).toFixed(2)}%`);
    expect(() => validateReadmeCoverage(modified, coverageJson.total)).toThrow(/Coverage mismatch/);
  });
});
