import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log(`\n=================================================`);
console.log(` 🧪 Self-Healing Testbed: Diagnostic Test Runner`);
console.log(`=================================================\n`);

const child = spawn('node', ['--test', '--test-reporter=tap', 'tests/*.test.js'], {
  cwd: projectRoot,
  shell: true
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  stdout += data.toString();
});

child.stderr.on('data', (data) => {
  stderr += data.toString();
});

child.on('close', (code) => {
  const lines = stdout.split('\n');

  // Count passes and fails
  const passMatches = stdout.match(/^\s*ok \d+/gm) || [];
  const failMatches = stdout.match(/^\s*not ok \d+/gm) || [];

  const failures = [];
  let currentFail = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('not ok') && trimmed.includes('-')) {
      if (currentFail) failures.push(currentFail);
      currentFail = {
        title: trimmed.replace(/^not ok \d+\s*-\s*/, ''),
        details: []
      };
    } else if (currentFail) {
      if (trimmed === '...' || (trimmed.startsWith('not ok') && !trimmed.includes('-'))) {
        failures.push(currentFail);
        currentFail = null;
      } else {
        currentFail.details.push(trimmed);
      }
    }
  });
  if (currentFail) failures.push(currentFail);

  const summary = {
    timestamp: new Date().toISOString(),
    exitCode: code,
    totalScenarios: 5,
    passed: passMatches.length,
    failed: failMatches.length,
    failures: failures,
    rawOutput: stdout
  };

  const jsonPath = path.join(projectRoot, 'test_results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

  console.log(`📊 Summary:`);
  console.log(`   - Status: ${code === 0 ? '🟢 ALL TESTS PASSED' : '🔴 TESTS FAILING'}`);
  console.log(`   - Passed Tests: ${summary.passed}`);
  console.log(`   - Failed Tests: ${summary.failed}`);
  console.log(`   - Captured Failure Entries: ${summary.failures.length}`);
  console.log(`   - Diagnostic JSON saved to: test_results.json\n`);
});
