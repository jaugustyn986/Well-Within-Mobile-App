import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..', '..');

// `bleeding-guidance-palette` was manually superseded by the later Action 5
// implementation on `codex/catch-up-missing-days`; merging it would restore
// outdated claims and remove newer rules/UX work.
const ignoredBranchPattern = /(\/HEAD$|\/main$|android|cursor\/|social|\/bleeding-guidance-palette$)/i;
const appPathPattern = /^(apps\/mobile\/src\/|core\/rulesEngine\/)/;

function git(args) {
  return execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' }).trim();
}

function hasAppChanges(branch) {
  const base = git(['merge-base', 'HEAD', branch]);
  const changedFiles = git(['diff', '--name-only', `${base}..${branch}`, '--', 'apps/mobile/src', 'core/rulesEngine'])
    .split('\n')
    .filter(Boolean);
  return changedFiles.some((file) => appPathPattern.test(file));
}

function isAncestor(branch) {
  try {
    execFileSync('git', ['-C', repoRoot, 'merge-base', '--is-ancestor', branch, 'HEAD'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const branches = git(['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'])
  .split('\n')
  .filter(Boolean)
  .filter((branch) => !ignoredBranchPattern.test(branch));

const missing = branches.filter((branch) => !isAncestor(branch) && hasAppChanges(branch));

if (missing.length > 0) {
  console.error('Unmerged non-Android app feature branches detected:');
  for (const branch of missing) {
    console.error(`- ${branch}`);
  }
  console.error('Merge or explicitly ignore these before a TestFlight release.');
  process.exit(1);
}

console.log('No unmerged non-Android app feature branches detected.');
