#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { splitIntoCycles } from 'core-rules-engine';
import { buildAction6CaptureEntries } from './capture-fixture.mjs';

const BUNDLE_ID = 'com.wellwithin.app';
const STORAGE_KEY = 'wellwithin_entries_state_v1';
const DEVICE = process.env.SIMULATOR_UDID ?? 'booted';
const BACKUP_PATH = path.join(
  os.tmpdir(),
  `well-within-action6-async-storage-backup-${DEVICE}.json`,
);

function xcrun(...args) {
  return execFileSync('xcrun', args, { encoding: 'utf8' }).trim();
}

function manifestPath() {
  const container = xcrun('simctl', 'get_app_container', DEVICE, BUNDLE_ID, 'data');
  return path.join(
    container,
    'Library',
    'Application Support',
    BUNDLE_ID,
    'RCTAsyncLocalStorage_V1',
    'manifest.json',
  );
}

function stopApp() {
  try {
    xcrun('simctl', 'terminate', DEVICE, BUNDLE_ID);
  } catch {
    // The app may already be stopped.
  }
}

function launchApp() {
  xcrun('simctl', 'launch', DEVICE, BUNDLE_ID);
}

function validate(entries) {
  const cycles = splitIntoCycles(entries);
  if (cycles.length !== 4) throw new Error(`Expected 4 cycles; found ${cycles.length}.`);
  for (const cycle of cycles.slice(0, 3)) {
    if (cycle.status !== 'complete' || cycle.result.peakConfirmed !== true) {
      throw new Error(`Cycle ${cycle.cycleNumber} is not a completed eligible Peak sequence.`);
    }
    if (cycle.cycleBoundary.eligibility !== 'eligible') {
      throw new Error(`Cycle ${cycle.cycleNumber} has an ineligible Cycle Day 1 boundary.`);
    }
  }
  const current = cycles[3];
  if (current.result.peakConfirmed !== true || current.peakDay !== 8) {
    throw new Error('Current capture cycle must have a retrospective Peak marker on Cycle Day 8.');
  }
  return cycles;
}

function buildStoredState(entries) {
  const timestamp = '2026-07-14T12:00:00.000Z';
  return {
    version: 1,
    entriesByDate: Object.fromEntries(entries.map((entry) => [entry.date, {
      clientUpdatedAt: timestamp,
      dirty: false,
      deleted: false,
      entry,
    }])),
    lastSuccessfulSyncAt: null,
    lastSyncError: null,
    lastCloudResetAt: null,
  };
}

function seed() {
  const target = manifestPath();
  stopApp();
  const targetExisted = fs.existsSync(target);
  const originalContents = targetExisted ? fs.readFileSync(target, 'utf8') : null;
  const manifest = originalContents ? JSON.parse(originalContents) : {};
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.writeFileSync(BACKUP_PATH, JSON.stringify({
      backupVersion: 1,
      targetExisted,
      originalContents,
    }));
  }

  const entries = buildAction6CaptureEntries();
  const cycles = validate(entries);
  manifest[STORAGE_KEY] = JSON.stringify(buildStoredState(entries));
  manifest.well_within_onboarding_done = 'true';
  manifest.wellwithin_entries_migration_v1_done = 'true';
  for (const key of Object.keys(manifest)) {
    if (key.startsWith('sb-') && key.endsWith('-auth-token')) manifest[key] = null;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`);
  launchApp();
  process.stdout.write(
    `Seeded ${entries.length} synthetic entries across ${cycles.length} cycles.\n`
      + `Original simulator storage: ${BACKUP_PATH}\n`,
  );
}

function restore() {
  if (!fs.existsSync(BACKUP_PATH)) {
    throw new Error(`No Action 6 backup exists at ${BACKUP_PATH}.`);
  }
  const target = manifestPath();
  stopApp();
  const backupText = fs.readFileSync(BACKUP_PATH, 'utf8');
  let backup = null;
  try {
    backup = JSON.parse(backupText);
  } catch {
    // Compatibility with the first local version, which stored the raw manifest.
  }
  if (backup?.backupVersion === 1) {
    if (backup.targetExisted) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, backup.originalContents);
    } else {
      fs.rmSync(target, { force: true });
    }
  } else {
    fs.copyFileSync(BACKUP_PATH, target);
  }
  fs.rmSync(BACKUP_PATH);
  launchApp();
  process.stdout.write('Restored the simulator storage that preceded the Action 6 fixture.\n');
}

if (process.argv.includes('--restore')) restore();
else seed();
