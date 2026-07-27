import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function runCommandAsync(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

const HTML_PAGE = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LLM Self-Healing Testbed Console</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0d14;
      --card-bg: rgba(22, 28, 45, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent-cyan: #00f2fe;
      --accent-blue: #4facfe;
      --accent-purple: #7f00ff;
      --danger: #ff4b5c;
      --success: #00e676;
      --warning: #ffb703;
      --text-main: #f0f4f8;
      --text-muted: #8a99ad;
      --code-bg: #0f1420;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(79, 172, 254, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 85%, rgba(127, 0, 255, 0.08) 0%, transparent 40%);
    }

    header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(10, 13, 20, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .logo-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    .badge-lab {
      font-size: 0.7rem;
      background: rgba(0, 242, 254, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 242, 254, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .btn-group { display: flex; gap: 0.75rem; }
    button {
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.6rem 1.1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      color: #fff;
      box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-danger {
      background: rgba(255, 75, 92, 0.15);
      color: var(--danger);
      border: 1px solid rgba(255, 75, 92, 0.3);
    }
    .btn-danger:hover { background: rgba(255, 75, 92, 0.25); }
    .btn-success {
      background: rgba(0, 230, 118, 0.15);
      color: var(--success);
      border: 1px solid rgba(0, 230, 118, 0.3);
    }
    .btn-success:hover { background: rgba(0, 230, 118, 0.25); }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

    main {
      padding: 2rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      main { grid-template-columns: 1fr; }
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .scenarios-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(8px);
      transition: border-color 0.2s ease;
    }
    .card:hover { border-color: rgba(255, 255, 255, 0.2); }

    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .scenario-name { font-size: 1.05rem; font-weight: 600; color: #fff; }
    .status-tag {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .status-tag.fail { background: rgba(255, 75, 92, 0.2); color: var(--danger); border: 1px solid var(--danger); }
    .status-tag.pass { background: rgba(0, 230, 118, 0.2); color: var(--success); border: 1px solid var(--success); }

    .scenario-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      display: flex;
      gap: 1rem;
    }
    .scenario-meta span { display: flex; align-items: center; gap: 0.3rem; }

    .scenario-desc {
      font-size: 0.85rem;
      line-height: 1.5;
      color: #c0ccdc;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .console-box {
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      height: 380px;
      overflow-y: auto;
      color: #d1d5db;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    .console-box .fail-log { color: #ff6b6b; }
    .console-box .success-log { color: #51cf66; }
    .console-box .info-log { color: #339af0; }

    .prompt-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
    }

    pre {
      font-family: 'Fira Code', monospace;
      font-size: 0.75rem;
      background: var(--code-bg);
      padding: 0.75rem;
      border-radius: 8px;
      overflow-x: auto;
      color: #b0c4de;
      max-height: 200px;
    }

    .pulse {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--danger);
      box-shadow: 0 0 0 0 rgba(255, 75, 92, 0.7);
      animation: pulse 1.6s infinite;
    }
    .pulse.pass { background: var(--success); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.7); }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 75, 92, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 75, 92, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 75, 92, 0); }
    }
  </style>
</head>
<body>

  <header>
    <div class="logo-box">
      <div class="logo-icon">🛡️</div>
      <div>
        <h1>LLM Self-Healing Testbed</h1>
        <span class="badge-lab">AI Autonomous Repair Benchmark</span>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn-primary" onclick="runDiagnostics()">▶ Run Diagnostics</button>
      <button class="btn-danger" onclick="resetBugs(false)">🐞 Inject Bugs</button>
      <button class="btn-success" onclick="resetBugs(true)">✨ Restore Clean</button>
    </div>
  </header>

  <main>
    <section>
      <div class="section-title">
        <span>Failure Scenarios (<span id="fail-count">5</span> / 5 Failing)</span>
        <span style="font-size: 0.8rem; font-weight: normal;"><span class="pulse" id="global-pulse"></span> <span id="global-status-text">Buggy State</span></span>
      </div>

      <div class="scenarios-grid" id="scenarios-container">
        <!-- Dynamically rendered -->
      </div>
    </section>

    <aside class="sidebar">
      <div>
        <div class="section-title">Diagnostic Logs</div>
        <div class="console-box" id="console">Loading diagnostic output...</div>
      </div>

      <div class="prompt-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 style="font-size: 0.9rem; font-weight: 600;">LLM Prompt Generator</h3>
          <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="copyPrompt()">📋 Copy Prompt</button>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Pass this formatted prompt to an LLM agent (Gemini, Claude, GPT) to evaluate self-healing.
        </p>
        <pre id="prompt-preview">Click 'Run Diagnostics' to generate prompt...</pre>
      </div>
    </aside>
  </main>

  <script>
    async function fetchStatus() {
      const res = await fetch('/api/status');
      const data = await res.json();
      renderScenarios(data);
    }

    function renderScenarios(data) {
      const container = document.getElementById('scenarios-container');
      const consoleBox = document.getElementById('console');
      const failCountEl = document.getElementById('fail-count');
      const pulseEl = document.getElementById('global-pulse');
      const statusTextEl = document.getElementById('global-status-text');

      container.innerHTML = '';

      let failingCount = 0;

      data.scenarios.forEach(sc => {
        const isFailed = data.testResults ? data.testResults.failures.some(f => f.title.includes(sc.name) || f.title.includes(sc.id)) : true;
        if (isFailed) failingCount++;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
          <div class="scenario-header">
            <div class="scenario-name">\${sc.name}</div>
            <span class="status-tag \${isFailed ? 'fail' : 'pass'}">\${isFailed ? '❌ FAILING' : '🟢 PASSED'}</span>
          </div>
          <div class="scenario-meta">
            <span>🏷️ Difficulty: <strong>\${sc.difficulty}</strong></span>
            <span>📂 Target: <code>\${sc.targetFile}</code></span>
          </div>
          <div class="scenario-desc">\${sc.description}</div>
        \`;
        container.appendChild(card);
      });

      failCountEl.innerText = failingCount;
      if (failingCount === 0) {
        pulseEl.className = 'pulse pass';
        statusTextEl.innerText = 'All Clean / Fully Healed';
      } else {
        pulseEl.className = 'pulse';
        statusTextEl.innerText = \`\${failingCount} Bugs Active\`;
      }

      if (data.testResults && data.testResults.rawOutput) {
        consoleBox.innerText = data.testResults.rawOutput;
      }
    }

    async function runDiagnostics() {
      const consoleBox = document.getElementById('console');
      consoleBox.innerText = 'Running tests and gathering diagnostic traces...';
      const res = await fetch('/api/run-tests', { method: 'POST' });
      const data = await res.json();
      renderScenarios(data);
      fetchPrompt();
    }

    async function resetBugs(clean) {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clean })
      });
      runDiagnostics();
    }

    async function fetchPrompt() {
      const res = await fetch('/api/prompt');
      const text = await res.text();
      document.getElementById('prompt-preview').innerText = text;
    }

    function copyPrompt() {
      const promptText = document.getElementById('prompt-preview').innerText;
      navigator.clipboard.writeText(promptText);
      alert('Self-Healing LLM Prompt copied to clipboard!');
    }

    fetchStatus();
  </script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = req.url;

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML_PAGE);
    return;
  }

  if (url === '/api/status') {
    const scenariosPath = path.join(__dirname, 'config', 'scenarios.json');
    const resultsPath = path.join(__dirname, 'test_results.json');

    const scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
    let testResults = null;
    if (fs.existsSync(resultsPath)) {
      try {
        testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      } catch (e) {}
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ scenarios, testResults }));
    return;
  }

  if (url === '/api/run-tests' && req.method === 'POST') {
    await runCommandAsync('node scripts/run-tests.js');
    const scenariosPath = path.join(__dirname, 'config', 'scenarios.json');
    const resultsPath = path.join(__dirname, 'test_results.json');

    const scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
    const testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ scenarios, testResults }));
    return;
  }

  if (url === '/api/reset' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const data = JSON.parse(body || '{}');
      const cmd = data.clean ? 'node scripts/reset-bugs.js --clean' : 'node scripts/reset-bugs.js';
      await runCommandAsync(cmd);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  if (url === '/api/prompt') {
    const promptPath = path.join(__dirname, 'llm_prompt_sample.txt');
    let prompt = 'Run diagnostics first to generate prompt.';
    if (fs.existsSync(promptPath)) {
      prompt = fs.readFileSync(promptPath, 'utf8');
    }
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(prompt);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(` 🚀 Self-Healing Lab Dashboard running at:`);
  console.log(` 🌐 http://localhost:${PORT}`);
  console.log(`=================================================\n`);
});
