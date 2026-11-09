const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run this through npm run setup.');
for (const directory of ['backend', 'frontend']) {
  const cwd = path.join(root, directory);
  if (!fs.existsSync(path.join(cwd, 'node_modules'))) execFileSync(process.execPath, [npm, 'ci', '--no-audit', '--no-fund'], { cwd, stdio: 'inherit', windowsHide: true });
}
const env = path.join(root, 'backend', '.env');
if (!fs.existsSync(env)) {
  const template = fs.readFileSync(path.join(root, 'backend', '.env.example'), 'utf8');
  fs.writeFileSync(env, template.replace('REPLACE_WITH_RANDOM_SECRET', randomBytes(48).toString('hex')), { mode: 0o600 });
}
console.log('Setup complete. Configure MongoDB in backend/.env, then run npm run dev.');
