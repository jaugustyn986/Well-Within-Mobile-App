import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(mobileRoot, '..', '..');
const shouldBump = process.argv.includes('--bump');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readNativeVersion() {
  const plistPath = path.join(mobileRoot, 'ios', 'WellWithin', 'Info.plist');
  const plist = fs.readFileSync(plistPath, 'utf8');
  const match = plist.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/);
  if (!match) {
    throw new Error(`Could not find CFBundleShortVersionString in ${path.relative(repoRoot, plistPath)}`);
  }
  return { version: match[1], plistPath };
}

function readExpoVersion() {
  process.env.EAS_BUILD_PROFILE = process.env.EAS_BUILD_PROFILE || 'production';
  const require = createRequire(import.meta.url);
  const config = require(path.join(mobileRoot, 'app.config.js'));
  return config?.expo?.version;
}

function compareVersions(a, b) {
  const aParts = String(a).split('.').map((p) => Number.parseInt(p, 10));
  const bParts = String(b).split('.').map((p) => Number.parseInt(p, 10));
  const len = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < len; i += 1) {
    const av = Number.isFinite(aParts[i]) ? aParts[i] : 0;
    const bv = Number.isFinite(bParts[i]) ? bParts[i] : 0;
    if (av !== bv) return av > bv ? 1 : -1;
  }
  return 0;
}

function nextPatchVersion(version) {
  const parts = String(version).split('.').map((p) => Number.parseInt(p, 10));
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
}

function jwtForAppStoreConnect({ keyPath, keyId, issuerId }) {
  const key = fs.readFileSync(path.resolve(mobileRoot, keyPath), 'utf8');
  const b64 = (value) => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const data = `${b64({ alg: 'ES256', kid: keyId, typ: 'JWT' })}.${b64({
    iss: issuerId,
    iat: now,
    exp: now + 1200,
    aud: 'appstoreconnect-v1',
  })}`;
  const signature = crypto.sign(null, Buffer.from(data), { key, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `${data}.${signature}`;
}

function getJson(token, apiPath) {
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          hostname: 'api.appstoreconnect.apple.com',
          path: apiPath,
          headers: { Authorization: `Bearer ${token}` },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            let json;
            try {
              json = JSON.parse(body);
            } catch (error) {
              reject(new Error(`App Store Connect returned non-JSON HTTP ${res.statusCode}: ${body}`));
              return;
            }
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error(`App Store Connect HTTP ${res.statusCode}: ${JSON.stringify(json)}`));
              return;
            }
            resolve(json);
          });
        },
      )
      .on('error', reject);
  });
}

async function readRemotePreReleaseVersions() {
  const eas = readJson(path.join(mobileRoot, 'eas.json'));
  const iosSubmit = eas?.submit?.production?.ios;
  if (!iosSubmit) {
    throw new Error('Missing submit.production.ios config in eas.json');
  }
  const token = jwtForAppStoreConnect({
    keyPath: iosSubmit.ascApiKeyPath,
    keyId: iosSubmit.ascApiKeyId,
    issuerId: iosSubmit.ascApiKeyIssuerId,
  });
  const encodedAppId = encodeURIComponent(iosSubmit.ascAppId);
  const json = await getJson(
    token,
    `/v1/preReleaseVersions?filter%5Bapp%5D=${encodedAppId}&filter%5Bplatform%5D=IOS&limit=200`,
  );
  return (json.data || [])
    .map((item) => item?.attributes?.version)
    .filter(Boolean)
    .sort(compareVersions);
}

function writeVersion(filePath, fromVersion, toVersion) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replaceAll(fromVersion, toVersion);
  if (updated === original) {
    throw new Error(`Did not update ${path.relative(repoRoot, filePath)} from ${fromVersion} to ${toVersion}`);
  }
  fs.writeFileSync(filePath, updated);
}

async function main() {
  const native = readNativeVersion();
  const expoVersion = readExpoVersion();
  if (native.version !== expoVersion) {
    throw new Error(
      `iOS version mismatch: app.config.js has ${expoVersion}, but Info.plist has ${native.version}. ` +
        'These must match before a TestFlight release.',
    );
  }

  const remoteVersions = await readRemotePreReleaseVersions();
  const maxRemoteVersion = remoteVersions.at(-1) ?? null;

  if (shouldBump) {
    if (!maxRemoteVersion || compareVersions(native.version, maxRemoteVersion) > 0) {
      console.log(`iOS marketing version ${native.version} is already newer than existing TestFlight trains.`);
      return;
    }
    const nextVersion = nextPatchVersion(maxRemoteVersion);
    writeVersion(path.join(mobileRoot, 'app.config.js'), native.version, nextVersion);
    writeVersion(native.plistPath, native.version, nextVersion);
    console.log(`Bumped iOS marketing version from ${native.version} to ${nextVersion}.`);
    return;
  }

  if (maxRemoteVersion && compareVersions(native.version, maxRemoteVersion) < 0) {
    throw new Error(
      `iOS marketing version ${native.version} is older than existing TestFlight train ${maxRemoteVersion}. ` +
        'Run npm run version:ios:bump before building.',
    );
  }

  if (maxRemoteVersion && compareVersions(native.version, maxRemoteVersion) === 0) {
    console.log(
      `iOS marketing version ${native.version} matches the latest TestFlight train. ` +
        'This is OK for replacement builds while the train is open; use npm run version:ios:bump for a new train.',
    );
    return;
  }

  console.log(`iOS marketing version ${native.version} is newer than existing TestFlight trains.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
