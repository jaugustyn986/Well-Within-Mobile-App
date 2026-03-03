import { computeMucusRank, detectFertileStart, detectPeak, recalculateCycle } from '../src';

describe('package index exports', () => {
  it('re-exports public API functions', () => {
    expect(typeof computeMucusRank).toBe('function');
    expect(typeof detectFertileStart).toBe('function');
    expect(typeof detectPeak).toBe('function');
    expect(typeof recalculateCycle).toBe('function');
  });
});
