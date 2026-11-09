const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
if (!fs.existsSync(path.join(root, 'backend/.env'))) { console.error('Run npm run setup first.'); process.exit(1); }
const production = process.argv.includes('--production');
const children = [
  spawn(process.execPath, ['server.js'], { cwd: path.join(root, 'backend'), stdio: 'inherit', windowsHide: true }),
  spawn(process.execPath, [path.join(root, 'frontend/node_modules/next/dist/bin/next'), production ? 'start' : 'dev', ...(production ? [] : ['--webpack']), '--hostname', '127.0.0.1'], { cwd: path.join(root, 'frontend'), stdio: 'inherit', windowsHide: true })
];
let stopping = false;
function stop(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill();
  process.exitCode = code;
}
for (const child of children) { child.on('error', err => { console.error(err.message); stop(1); }); child.on('exit', code => stop(code || 0)); }
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
