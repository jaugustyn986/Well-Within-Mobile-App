import { deriveMucusDay } from '../src/mucusClassification';

describe('deriveMucusDay', () => {
  it('treats damp sensation with lubricative appearance as lubricative', () => {
    const d = deriveMucusDay({ sensation: 'damp', appearances: ['lubricative'] }, 1);
    expect(d.isLubricative).toBe(true);
  });
});
