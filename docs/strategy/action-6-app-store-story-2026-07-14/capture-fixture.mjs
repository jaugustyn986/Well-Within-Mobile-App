const DAY_MS = 86_400_000;

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  return Math.round(
    (new Date(`${end}T00:00:00.000Z`).getTime()
      - new Date(`${start}T00:00:00.000Z`).getTime()) / DAY_MS,
  );
}

function dry(date) {
  return {
    date,
    bleeding: 'none',
    sensation: 'dry',
    appearances: ['none'],
    intercourse: false,
  };
}

function cycleEntries({ start, end, mucusDay, peakDay, mixedPPlusDay = null }) {
  const entries = [];
  const length = daysBetween(start, end) + 1;

  for (let offset = 0; offset < length; offset += 1) {
    entries.push(dry(addDays(start, offset)));
  }

  entries[0] = {
    ...dry(start),
    bleeding: 'moderate',
    menstrualFlowStart: 'confirmed',
  };
  if (entries[1]) entries[1] = { ...dry(addDays(start, 1)), bleeding: 'light' };
  if (entries[2]) entries[2] = { ...dry(addDays(start, 2)), bleeding: 'brown' };

  entries[mucusDay - 1] = {
    ...dry(addDays(start, mucusDay - 1)),
    sensation: 'damp',
    appearances: ['cloudy'],
    frequency: 2,
  };
  entries[mucusDay] = {
    ...dry(addDays(start, mucusDay)),
    sensation: 'wet',
    appearances: ['cloudy'],
    frequency: 2,
  };
  entries[peakDay - 1] = {
    ...dry(addDays(start, peakDay - 1)),
    sensation: 'stretchy',
    appearances: ['clear'],
    frequency: 3,
  };

  if (entries[peakDay]) {
    entries[peakDay] = {
      ...dry(addDays(start, peakDay)),
      sensation: 'damp',
      appearances: ['cloudy'],
      frequency: 1,
    };
  }
  if (entries[peakDay + 1]) {
    entries[peakDay + 1] = mixedPPlusDay === 2
      ? {
          ...dry(addDays(start, peakDay + 1)),
          bleeding: 'spotting',
          sensation: 'damp',
          appearances: ['cloudy'],
          frequency: 1,
        }
      : dry(addDays(start, peakDay + 1));
  }
  if (entries[peakDay + 2]) {
    entries[peakDay + 2] = {
      ...dry(addDays(start, peakDay + 2)),
      sensation: 'damp',
      appearances: ['cloudy'],
      frequency: 1,
    };
  }

  return entries;
}

export function buildAction6CaptureEntries() {
  const definitions = [
    { start: '2026-04-07', end: '2026-05-04', mucusDay: 7, peakDay: 11 },
    { start: '2026-05-05', end: '2026-06-01', mucusDay: 8, peakDay: 12 },
    { start: '2026-06-02', end: '2026-06-29', mucusDay: 9, peakDay: 13 },
    {
      start: '2026-06-30',
      end: '2026-07-14',
      mucusDay: 6,
      peakDay: 8,
      mixedPPlusDay: 2,
    },
  ];

  const entries = definitions.flatMap(cycleEntries);
  const currentBrownDate = '2026-07-14';
  const currentBrownIndex = entries.findIndex((entry) => entry.date === currentBrownDate);
  entries[currentBrownIndex] = { ...dry(currentBrownDate), bleeding: 'brown' };
  return entries;
}

export const ACTION_6_CAPTURE_TODAY = '2026-07-14';
