import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { appStorePayload as payload } from './app-store-2.1.4-payload.mjs';

const action6Root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(action6Root, '..', '..', '..');
const mobileRoot = path.join(repoRoot, 'apps', 'mobile');
const applyChanges = process.argv.includes('--apply');
const apiRoot = 'https://api.appstoreconnect.apple.com';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function createToken() {
  const eas = readJson(path.join(mobileRoot, 'eas.json'));
  const ios = eas.submit.production.ios;
  const key = fs.readFileSync(path.resolve(mobileRoot, ios.ascApiKeyPath), 'utf8');
  const encode = (value) =>
    Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const signingInput = `${encode({ alg: 'ES256', kid: ios.ascApiKeyId, typ: 'JWT' })}.${encode({
    iss: ios.ascApiKeyIssuerId,
    iat: now,
    exp: now + 1200,
    aud: 'appstoreconnect-v1',
  })}`;
  const signature = crypto
    .sign(null, Buffer.from(signingInput), { key, dsaEncoding: 'ieee-p1363' })
    .toString('base64url');
  return `${signingInput}.${signature}`;
}

let token = createToken();

async function apiRequest(apiPath, { method = 'GET', body, allow404 = false } = {}) {
  const response = await fetch(`${apiRoot}${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (allow404 && response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`App Store Connect ${method} ${apiPath} returned ${response.status}: ${text}`);
  }
  return json;
}

function versionSummary(item) {
  return {
    id: item.id,
    version: item.attributes.versionString,
    state: item.attributes.appStoreState,
    releaseType: item.attributes.releaseType,
  };
}

async function listVersions() {
  const query = new URLSearchParams({
    'filter[platform]': 'IOS',
    limit: '200',
  });
  const response = await apiRequest(`/v1/apps/${payload.appId}/appStoreVersions?${query}`);
  return response.data;
}

async function locateBuild() {
  const query = new URLSearchParams({
    'filter[app]': payload.appId,
    include: 'preReleaseVersion',
    sort: '-uploadedDate',
    limit: '200',
  });
  const response = await apiRequest(`/v1/builds?${query}`);
  const preReleaseVersions = new Map(
    (response.included || [])
      .filter((item) => item.type === 'preReleaseVersions')
      .map((item) => [item.id, item.attributes.version]),
  );
  return response.data.find((build) => {
    const preReleaseId = build.relationships?.preReleaseVersion?.data?.id;
    return (
      build.attributes.version === payload.buildNumber &&
      preReleaseVersions.get(preReleaseId) === payload.version
    );
  });
}

async function inspect() {
  const versions = await listVersions();
  const build = await locateBuild();
  const targetVersion = versions.find((item) => item.attributes.versionString === payload.version);
  const attachedBuild = targetVersion
    ? await apiRequest(`/v1/appStoreVersions/${targetVersion.id}/build`, { allow404: true })
    : null;
  console.log(JSON.stringify({
    mode: applyChanges ? 'apply' : 'inspect',
    versions: versions.map(versionSummary),
    targetBuild: build
      ? { id: build.id, buildNumber: build.attributes.version, processingState: build.attributes.processingState }
      : null,
    attachedBuild: attachedBuild?.data
      ? {
          id: attachedBuild.data.id,
          buildNumber: attachedBuild.data.attributes.version,
          processingState: attachedBuild.data.attributes.processingState,
        }
      : null,
    screenshotFiles: payload.screenshots.map((relativePath) => {
      const absolutePath = path.join(action6Root, relativePath);
      return { relativePath, exists: fs.existsSync(absolutePath), bytes: fs.statSync(absolutePath).size };
    }),
  }, null, 2));
  return { versions, build };
}

async function ensureVersion(versions) {
  let version = versions.find((item) => item.attributes.versionString === payload.version);
  if (version) {
    const response = await apiRequest(`/v1/appStoreVersions/${version.id}`, {
      method: 'PATCH',
      body: {
        data: {
          type: 'appStoreVersions',
          id: version.id,
          attributes: { releaseType: payload.releaseType },
        },
      },
    });
    return response.data;
  }

  const editableStates = new Set([
    'PREPARE_FOR_SUBMISSION',
    'READY_FOR_REVIEW',
    'INVALID_BINARY',
    'REJECTED',
    'METADATA_REJECTED',
    'DEVELOPER_REJECTED',
  ]);
  version = versions.find((item) => editableStates.has(item.attributes.appStoreState));
  if (version) {
    const response = await apiRequest(`/v1/appStoreVersions/${version.id}`, {
      method: 'PATCH',
      body: {
        data: {
          type: 'appStoreVersions',
          id: version.id,
          attributes: {
            versionString: payload.version,
            releaseType: payload.releaseType,
          },
        },
      },
    });
    return response.data;
  }

  const response = await apiRequest('/v1/appStoreVersions', {
    method: 'POST',
    body: {
      data: {
        type: 'appStoreVersions',
        attributes: {
          platform: 'IOS',
          versionString: payload.version,
          releaseType: payload.releaseType,
        },
        relationships: {
          app: { data: { type: 'apps', id: payload.appId } },
        },
      },
    },
  });
  return response.data;
}

async function attachBuild(versionId, buildId) {
  await apiRequest(`/v1/appStoreVersions/${versionId}/relationships/build`, {
    method: 'PATCH',
    body: { data: { type: 'builds', id: buildId } },
  });
}

async function updateLocalization(versionId) {
  const response = await apiRequest(
    `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=200`,
  );
  let localization = response.data.find((item) => item.attributes.locale === payload.locale);
  if (!localization) {
    const created = await apiRequest('/v1/appStoreVersionLocalizations', {
      method: 'POST',
      body: {
        data: {
          type: 'appStoreVersionLocalizations',
          attributes: { locale: payload.locale, ...payload.localization },
          relationships: {
            appStoreVersion: { data: { type: 'appStoreVersions', id: versionId } },
          },
        },
      },
    });
    return created.data;
  }

  const updated = await apiRequest(`/v1/appStoreVersionLocalizations/${localization.id}`, {
    method: 'PATCH',
    body: {
      data: {
        type: 'appStoreVersionLocalizations',
        id: localization.id,
        attributes: payload.localization,
      },
    },
  });
  return updated.data;
}

async function updateReviewNotes(versionId) {
  const response = await apiRequest(
    `/v1/appStoreVersions/${versionId}/appStoreReviewDetail`,
    { allow404: true },
  );
  if (!response?.data) return null;
  const updated = await apiRequest(`/v1/appStoreReviewDetails/${response.data.id}`, {
    method: 'PATCH',
    body: {
      data: {
        type: 'appStoreReviewDetails',
        id: response.data.id,
        attributes: { notes: payload.reviewNotes },
      },
    },
  });
  return updated.data;
}

async function ensureScreenshotSet(localizationId) {
  const response = await apiRequest(
    `/v1/appStoreVersionLocalizations/${localizationId}/appScreenshotSets?limit=50`,
  );
  // App Store Connect labels the current 6.9-inch upload bucket APP_IPHONE_67.
  let set = response.data.find((item) => item.attributes.screenshotDisplayType === 'APP_IPHONE_67');
  if (set) return set;
  const created = await apiRequest('/v1/appScreenshotSets', {
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshotSets',
        attributes: { screenshotDisplayType: 'APP_IPHONE_67' },
        relationships: {
          appStoreVersionLocalization: {
            data: { type: 'appStoreVersionLocalizations', id: localizationId },
          },
        },
      },
    },
  });
  return created.data;
}

async function deleteExistingScreenshots(setId) {
  const response = await apiRequest(`/v1/appScreenshotSets/${setId}/appScreenshots?limit=200`);
  for (const screenshot of response.data) {
    await apiRequest(`/v1/appScreenshots/${screenshot.id}`, { method: 'DELETE' });
  }
}

async function uploadScreenshot(setId, absolutePath) {
  const source = fs.readFileSync(absolutePath);
  const reservation = await apiRequest('/v1/appScreenshots', {
    method: 'POST',
    body: {
      data: {
        type: 'appScreenshots',
        attributes: {
          fileName: path.basename(absolutePath),
          fileSize: source.length,
        },
        relationships: {
          appScreenshotSet: { data: { type: 'appScreenshotSets', id: setId } },
        },
      },
    },
  });
  const screenshot = reservation.data;
  for (const operation of screenshot.attributes.uploadOperations) {
    const headers = Object.fromEntries(
      operation.requestHeaders.map((header) => [header.name, header.value]),
    );
    const response = await fetch(operation.url, {
      method: operation.method,
      headers,
      body: source.subarray(operation.offset, operation.offset + operation.length),
    });
    if (!response.ok) {
      throw new Error(`Screenshot binary upload failed for ${path.basename(absolutePath)}: ${response.status}`);
    }
  }
  const checksum = crypto.createHash('md5').update(source).digest('hex');
  await apiRequest(`/v1/appScreenshots/${screenshot.id}`, {
    method: 'PATCH',
    body: {
      data: {
        type: 'appScreenshots',
        id: screenshot.id,
        attributes: { uploaded: true, sourceFileChecksum: checksum },
      },
    },
  });
  return screenshot.id;
}

async function waitForScreenshot(screenshotId, fileName) {
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const response = await apiRequest(`/v1/appScreenshots/${screenshotId}`);
    const state = response.data.attributes.assetDeliveryState?.state;
    if (state === 'COMPLETE') return state;
    if (state === 'FAILED') {
      throw new Error(`App Store Connect failed to process ${fileName}: ${JSON.stringify(response.data.attributes.assetDeliveryState)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`Timed out while App Store Connect processed ${fileName}`);
}

async function verify(versionId, localizationId, setId) {
  const [version, localization, screenshots] = await Promise.all([
    apiRequest(`/v1/appStoreVersions/${versionId}`),
    apiRequest(`/v1/appStoreVersionLocalizations/${localizationId}`),
    apiRequest(`/v1/appScreenshotSets/${setId}/appScreenshots?limit=200`),
  ]);
  return {
    version: versionSummary(version.data),
    localization: {
      id: localization.data.id,
      locale: localization.data.attributes.locale,
      promotionalText: localization.data.attributes.promotionalText,
      whatsNew: localization.data.attributes.whatsNew,
    },
    screenshots: screenshots.data.map((item) => ({
      id: item.id,
      fileName: item.attributes.fileName,
      state: item.attributes.assetDeliveryState?.state,
    })),
  };
}

const initial = await inspect();
if (!applyChanges) {
  console.log('Inspection only. Run with --apply to stage the approved 2.1.4 record.');
  process.exit(0);
}

if (!initial.build) {
  throw new Error(`Could not find TestFlight version ${payload.version} build ${payload.buildNumber}.`);
}
for (const relativePath of payload.screenshots) {
  const absolutePath = path.join(action6Root, relativePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing screenshot: ${relativePath}`);
}

const version = await ensureVersion(initial.versions);
await attachBuild(version.id, initial.build.id);
const localization = await updateLocalization(version.id);
await updateReviewNotes(version.id);
const screenshotSet = await ensureScreenshotSet(localization.id);
await deleteExistingScreenshots(screenshotSet.id);

for (const relativePath of payload.screenshots) {
  const absolutePath = path.join(action6Root, relativePath);
  const screenshotId = await uploadScreenshot(screenshotSet.id, absolutePath);
  await waitForScreenshot(screenshotId, path.basename(absolutePath));
  console.log(`Uploaded ${path.basename(absolutePath)}`);
}

console.log(JSON.stringify(await verify(version.id, localization.id, screenshotSet.id), null, 2));
console.log('Staging complete. The version was not submitted for App Review.');
