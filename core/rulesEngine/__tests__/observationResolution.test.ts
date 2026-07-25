import {
  computeMucusRank,
  generateCreightonCode,
  resolveDailyMucus,
  sortMucusObservationsForDisplay,
  withMucusObservations,
} from '../src';

describe('daily mucus observation resolution', () => {
  it('treats a legacy top-level observation like a one-item array', () => {
    const legacy = {
      date: '2026-07-18',
      sensation: 'wet' as const,
      appearances: ['cloudy' as const],
      frequency: 2 as const,
    };
    const canonical = withMucusObservations(legacy, [{
      id: 'obs-1',
      observedAt: '14:30',
      sensation: 'wet',
      appearances: ['cloudy'],
      frequency: 2,
    }]);

    expect(computeMucusRank(canonical)).toBe(computeMucusRank(legacy));
    expect(generateCreightonCode(canonical)).toEqual(generateCreightonCode(legacy));
  });

  it('uses the strongest observation and projects it for older clients', () => {
    const entry = withMucusObservations({ date: '2026-07-18', bleeding: 'none' }, [
      { id: 'a', observedAt: '08:10', sensation: 'damp', appearances: ['cloudy'], frequency: 1 },
      { id: 'b', observedAt: '20:30', sensation: 'stretchy', appearances: ['clear'], frequency: 2 },
    ]);

    const resolved = resolveDailyMucus(entry);
    expect(resolved.rank).toBe(3);
    expect(resolved.representative?.id).toBe('b');
    expect(entry.sensation).toBe('stretchy');
    expect(entry.appearances).toEqual(['clear']);
    expect(entry.frequency).toBe(2);
  });

  it('breaks equal-rank ties by final array position, independent of time metadata', () => {
    const timed = resolveDailyMucus({ observations: [
      { id: 'late', observedAt: '18:00', sensation: 'wet', appearances: [] },
      { id: 'early', observedAt: '09:00', sensation: 'tacky', appearances: [] },
    ] });
    expect(timed.representative?.id).toBe('early');

    const untimed = resolveDailyMucus({ observations: [
      { id: 'first', sensation: 'wet', appearances: [] },
      { id: 'last', sensation: 'tacky', appearances: [] },
    ] });
    expect(untimed.representative?.id).toBe('last');
  });

  it('treats an explicitly empty array as authoritative over stale projections', () => {
    expect(computeMucusRank({
      sensation: 'stretchy',
      appearances: ['clear'],
      observations: [],
    })).toBeNull();
  });

  it('sorts known local times before untimed observations without changing stable order', () => {
    const sorted = sortMucusObservationsForDisplay([
      { id: 'untimed-a', sensation: 'dry', appearances: [] },
      { id: 'late', observedAt: '18:30', sensation: 'wet', appearances: [] },
      { id: 'early', observedAt: '08:15', sensation: 'damp', appearances: [] },
      { id: 'untimed-b', sensation: 'dry', appearances: [] },
    ]);
    expect(sorted.map((observation) => observation.id)).toEqual([
      'early', 'late', 'untimed-a', 'untimed-b',
    ]);
  });
});
