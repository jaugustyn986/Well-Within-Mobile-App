import { buildDataExport } from '../exportData';

describe('buildDataExport', () => {
  it('exports every canonical observation without duplicate compatibility fields', () => {
    const exported = buildDataExport({
      '2026-07-18': {
        date: '2026-07-18',
        bleeding: 'none',
        sensation: 'stretchy',
        appearances: ['clear'],
        frequency: 2,
        observations: [
          { id: 'morning', observedAt: '08:10', sensation: 'damp', appearances: ['cloudy'], frequency: 1 },
          { id: 'evening', observedAt: '20:30', sensation: 'stretchy', appearances: ['clear'], frequency: 2 },
        ],
      },
    }, '2026-07-18T22:00:00.000Z');

    expect(exported).toMatchObject({
      format: 'well-within-data',
      schemaVersion: 2,
      exportedAt: '2026-07-18T22:00:00.000Z',
    });
    const entry = exported.entriesByDate['2026-07-18'];
    expect(entry.observations).toHaveLength(2);
    expect(entry).not.toHaveProperty('sensation');
    expect(entry).not.toHaveProperty('appearances');
    expect(entry).not.toHaveProperty('frequency');
  });

  it('wraps a legacy top-level observation without inventing a time', () => {
    const exported = buildDataExport({
      '2026-07-17': {
        sensation: 'wet',
        appearances: ['cloudy'],
        frequency: 1,
      },
    }, '2026-07-18T22:00:00.000Z');
    const [observation] = exported.entriesByDate['2026-07-17'].observations ?? [];
    expect(observation).toMatchObject({
      sensation: 'wet',
      appearances: ['cloudy'],
      frequency: 1,
    });
    expect(observation.observedAt).toBeUndefined();
  });
});
