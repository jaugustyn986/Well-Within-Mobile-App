#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { recalculateCycle } from '../src/recalc';
import { DailyEntry } from '../src/types';

function readFixturePath(argv: string[]): string {
  const fixtureFlagIndex = argv.indexOf('--fixture');
  if (fixtureFlagIndex === -1 || !argv[fixtureFlagIndex + 1]) {
    throw new Error('Usage: node ./dist/cli.js --fixture fixtures/simple-peak.json');
  }
  return argv[fixtureFlagIndex + 1];
}

function main(): void {
  const fixturePath = readFixturePath(process.argv);
  const absolute = path.resolve(process.cwd(), fixturePath);
  const payload = JSON.parse(fs.readFileSync(absolute, 'utf8')) as { entries: Array<DailyEntry | null> };
  const result = recalculateCycle(payload.entries);

  process.stdout.write(
    `${JSON.stringify(
      {
        peakIndex: result.peakIndex,
        fertileStartIndex: result.fertileStartIndex,
        fertileEndIndex: result.fertileEndIndex,
        phaseLabels: result.phaseLabels
      },
      null,
      2
    )}\n`
  );
}

main();
