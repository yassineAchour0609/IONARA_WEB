const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run this through npm run setup.');
for (const directory of ['backend', 'frontend']) {
  const cwd = path.join(root, directory);
  const pkgPath = path.join(cwd, 'package.json');
  let needsInstall = !fs.existsSync(path.join(cwd, 'node_modules'));
  if (!needsInstall && fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = Object.keys(pkg.dependencies || {});
      for (const dep of deps) {
        if (!fs.existsSync(path.join(cwd, 'node_modules', dep))) {
          needsInstall = true;
          break;
        }
      }
    } catch {
      needsInstall = true;
    }
  }
  if (needsInstall) {
    console.log(`Installing dependencies for ${directory}...`);
    try {
      execFileSync(process.execPath, [npm, 'install', '--no-audit', '--no-fund'], { cwd, stdio: 'inherit', windowsHide: true });
    } catch (e) {
      console.warn(`npm install notice for ${directory}:`, e.message);
    }
  }
}
const env = path.join(root, 'backend', '.env');
if (!fs.existsSync(env)) {
  const template = fs.readFileSync(path.join(root, 'backend', '.env.example'), 'utf8');
  fs.writeFileSync(env, template.replace('REPLACE_WITH_RANDOM_SECRET', randomBytes(48).toString('hex')), { mode: 0o600 });
}
console.log('Setup complete. Configure MongoDB in backend/.env, then run npm run dev.');
