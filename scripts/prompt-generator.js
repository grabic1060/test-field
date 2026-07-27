import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const jsonPath = path.join(projectRoot, 'test_results.json');

if (!fs.existsSync(jsonPath)) {
  console.log('Running tests first to capture diagnostics...');
  // Read default file or advise running npm test:json
}

let resultData = {};
try {
  if (fs.existsSync(jsonPath)) {
    resultData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
} catch (e) {
  // fallback
}

const promptText = `
SYSTEM PROMPT:
You are an expert Autonomous Self-Healing AI Developer.
Your goal is to inspect failing unit test tracebacks, identify the root cause in the target source code, and generate a precise code fix that resolves all failing assertions without introducing regressions.

USER CONTEXT:
The project test suite failed with the following diagnostic log:

=== FAILURES REPORT ===
${JSON.stringify(resultData.failures || [], null, 2)}

=== TARGET SOURCE MODULES ===
- src/modules/userService.js
- src/modules/paymentGateway.js
- src/modules/dataProcessor.js
- src/modules/authMiddleware.js
- src/modules/apiRouter.js

INSTRUCTIONS FOR HEALING AGENT:
1. Examine each failing test case and trace it back to the corresponding module in src/modules/.
2. Fix the null safety, boundary checks, async promise flow, token logic, and error status handling.
3. Verify your fixes by ensuring 'npm test' returns exit code 0.
`;

console.log(`\n=================================================`);
console.log(` 🤖 Generated Self-Healing LLM Prompt`);
console.log(`=================================================\n`);
console.log(promptText);

const outputPath = path.join(projectRoot, 'llm_prompt_sample.txt');
fs.writeFileSync(outputPath, promptText);
console.log(` Saved prompt to: llm_prompt_sample.txt\n`);
