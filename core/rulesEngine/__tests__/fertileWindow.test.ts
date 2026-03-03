import { detectFertileStart } from '../src/fertileWindow';

describe('detectFertileStart', () => {
  it('returns first day with rank >= 1', () => {
    expect(detectFertileStart([0, 0, 1, 2])).toBe(2);
  });

  it('returns null for all dry/missing', () => {
    expect(detectFertileStart([0, 0, null, 0])).toBeNull();
  });

  it('respects start index', () => {
    expect(detectFertileStart([1, 0, 0, 2], 2)).toBe(3);
  });
});
