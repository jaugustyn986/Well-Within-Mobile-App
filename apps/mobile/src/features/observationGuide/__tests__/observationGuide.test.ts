import {
  APPEARANCE_GUIDE_OPTIONS,
  SENSATION_GUIDE_OPTIONS,
  appearanceOptionsForGroup,
  sensationOptionsForGroup,
} from '../observationGuide';

describe('observation guide vocabulary', () => {
  it('keeps every entry option available in the guide without method-facing codes', () => {
    expect(SENSATION_GUIDE_OPTIONS).toHaveLength(7);
    expect(APPEARANCE_GUIDE_OPTIONS).toHaveLength(10);

    const copy = JSON.stringify({ SENSATION_GUIDE_OPTIONS, APPEARANCE_GUIDE_OPTIONS });
    expect(copy).not.toMatch(/Creighton|CrMS|C\/K|2W/);
  });

  it('groups appearance terms so similar choices can be compared', () => {
    expect(appearanceOptionsForGroup('clarity').map((option) => option.value)).toEqual([
      'cloudy',
      'cloudy_clear',
      'clear',
    ]);
    expect(appearanceOptionsForGroup('texture').map((option) => option.value)).toEqual([
      'gummy',
      'pasty',
      'lubricative',
    ]);
    expect(appearanceOptionsForGroup('color').map((option) => option.value)).toEqual([
      'brown',
      'red',
      'yellow',
    ]);
  });

  it('keeps the established sensation choices split by moisture and stretch', () => {
    expect(sensationOptionsForGroup('moisture').map((option) => option.value)).toEqual([
      'dry',
      'damp',
      'wet',
      'shiny',
    ]);
    expect(sensationOptionsForGroup('stretch').map((option) => option.value)).toEqual([
      'sticky',
      'tacky',
      'stretchy',
    ]);
  });
});
