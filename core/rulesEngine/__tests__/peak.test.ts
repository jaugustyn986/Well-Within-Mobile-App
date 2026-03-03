import { detectPeak } from '../src/peak';

describe('detectPeak', () => {
  it('detects a valid peak with P+3 lower ranks', () => {
    expect(detectPeak([0, 1, 3, 2, 1, 0])).toEqual({ peakIndex: 2, fertileEndIndex: 5 });
  });

  it('resets candidate when equal/higher rank appears during waiting period', () => {
    expect(detectPeak([0, 1, 3, 1, 3, 1, 0, 0])).toEqual({ peakIndex: 4, fertileEndIndex: 7 });
  });

  it('does not confirm when P+1..P+3 missing', () => {
    expect(detectPeak([0, 1, 3, null, 1, 0, 0])).toEqual({ peakIndex: null, fertileEndIndex: null });
    expect(detectPeak([0, 1, 3, 2])).toEqual({ peakIndex: null, fertileEndIndex: null });
  });

  it('supports shifted cycle start', () => {
    expect(detectPeak([3, 2, 1, 0, 1, 3, 1, 0, 0], 4)).toEqual({ peakIndex: 5, fertileEndIndex: 8 });
  });
});
