#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const coverageFile = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
if (!fs.existsSync(coverageFile)) {
  console.log('No coverage report found at', coverageFile);
  process.exit(0);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const total = coverage.total || {};
const lines = total.lines && total.lines.pct != null ? total.lines.pct : 'N/A';
const statements = total.statements && total.statements.pct != null ? total.statements.pct : 'N/A';
const functions = total.functions && total.functions.pct != null ? total.functions.pct : 'N/A';
const branches = total.branches && total.branches.pct != null ? total.branches.pct : 'N/A';

const table = `<!-- COVERAGE:START -->\n## Test Coverage\n\n| Metric | Coverage |\n|---|---:|\n| Lines | ${lines}% |\n| Statements | ${statements}% |\n| Functions | ${functions}% |\n| Branches | ${branches}% |\n\n_Last updated: ${new Date().toISOString()}_\n<!-- COVERAGE:END -->`;

const readmePath = path.join(process.cwd(), 'README.md');
if (!fs.existsSync(readmePath)) {
  console.error('README.md not found');
  process.exit(1);
}

let readme = fs.readFileSync(readmePath, 'utf8');
if (/<!-- COVERAGE:START -->[\s\S]*?<!-- COVERAGE:END -->/m.test(readme)) {
  readme = readme.replace(/<!-- COVERAGE:START -->[\s\S]*?<!-- COVERAGE:END -->/m, table);
} else {
  // append at end
  readme = readme.trim() + '\n\n' + table + '\n';
}

fs.writeFileSync(readmePath, readme, 'utf8');
console.log('README.md updated with coverage table');
