import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const isClean = process.argv.includes('--clean');
const suffix = isClean ? '.clean.js' : '.buggy.js';

const modules = [
  'userService',
  'paymentGateway',
  'dataProcessor',
  'authMiddleware',
  'apiRouter'
];

console.log(`\n=================================================`);
console.log(` 🔄 Self-Healing Lab: Resetting Testbed Files`);
console.log(` Mode: ${isClean ? '✨ Clean / Fixed State' : '🐞 Buggy / Fail State'}`);
console.log(`=================================================\n`);

modules.forEach(mod => {
  const sourcePath = path.join(projectRoot, 'src', 'backups', `${mod}${suffix}`);
  const targetPath = path.join(projectRoot, 'src', 'modules', `${mod}.js`);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`  [OK] Restored ${mod}.js -> ${isClean ? 'Clean' : 'Buggy'}`);
  } else {
    console.error(`  [ERR] Source backup file missing: ${sourcePath}`);
  }
});

console.log(`\nDone! Run 'npm test' to verify project status.\n`);
