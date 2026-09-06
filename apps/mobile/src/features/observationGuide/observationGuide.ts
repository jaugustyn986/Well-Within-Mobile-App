import type { Appearance, Sensation } from 'core-rules-engine';

export type ObservationGuideTab = 'sensation' | 'appearance';

export interface SensationGuideOption {
  value: Sensation;
  label: string;
  formDescription: string;
  guideDescription: string;
  group: 'moisture' | 'stretch';
}

export interface AppearanceGuideOption {
  value: Appearance;
  label: string;
  formLabel: string;
  guideDescription: string;
  group: 'none' | 'clarity' | 'texture' | 'color';
}

export const SENSATION_GUIDE_OPTIONS: readonly SensationGuideOption[] = [
  {
    value: 'dry',
    label: 'Dry',
    formDescription: 'No sensation',
    guideDescription: 'No sensation of moisture.',
    group: 'moisture',
  },
  {
    value: 'damp',
    label: 'Damp',
    formDescription: 'Slightly moist',
    guideDescription: 'Slightly moist without a smooth or slippery feeling.',
    group: 'moisture',
  },
  {
    value: 'wet',
    label: 'Wet',
    formDescription: 'Wet, no lubrication',
    guideDescription: 'Noticeably wet without a smooth or slippery feeling.',
    group: 'moisture',
  },
  {
    value: 'shiny',
    label: 'Shiny',
    formDescription: 'Shiny, no lubrication',
    guideDescription: 'The tissue looked shiny, without a smooth or slippery feeling.',
    group: 'moisture',
  },
  {
    value: 'sticky',
    label: 'Sticky',
    formDescription: '¼ inch / 0.5 cm',
    guideDescription: 'Stretches about ¼ inch / 0.5 cm.',
    group: 'stretch',
  },
  {
    value: 'tacky',
    label: 'Tacky',
    formDescription: '½–¾ inch / 1–2 cm',
    guideDescription: 'Stretches about ½–¾ inch / 1–2 cm.',
    group: 'stretch',
  },
  {
    value: 'stretchy',
    label: 'Stretchy',
    formDescription: '1 inch / 2.5 cm or more',
    guideDescription: 'Stretches 1 inch / 2.5 cm or more.',
    group: 'stretch',
  },
] as const;

export const APPEARANCE_GUIDE_OPTIONS: readonly AppearanceGuideOption[] = [
  {
    value: 'none',
    label: 'None',
    formLabel: 'None',
    guideDescription: 'No mucus was visible on the tissue.',
    group: 'none',
  },
  {
    value: 'cloudy',
    label: 'Cloudy',
    formLabel: 'Cloudy (white)',
    guideDescription: 'Mostly white or opaque, not transparent.',
    group: 'clarity',
  },
  {
    value: 'cloudy_clear',
    label: 'Cloudy/Clear',
    formLabel: 'Cloudy/Clear',
    guideDescription: 'A mix of cloudy or white and transparent areas.',
    group: 'clarity',
  },
  {
    value: 'clear',
    label: 'Clear',
    formLabel: 'Clear',
    guideDescription: 'Mostly transparent, with little or no cloudiness.',
    group: 'clarity',
  },
  {
    value: 'gummy',
    label: 'Gummy',
    formLabel: 'Gummy',
    guideDescription: 'Thick and glue-like; it holds together.',
    group: 'texture',
  },
  {
    value: 'pasty',
    label: 'Pasty',
    formLabel: 'Pasty',
    guideDescription: 'Creamy or paste-like.',
    group: 'texture',
  },
  {
    value: 'lubricative',
    label: 'Lubricative',
    formLabel: 'Lubricative',
    guideDescription: 'A smooth or slippery feeling while wiping.',
    group: 'texture',
  },
  {
    value: 'brown',
    label: 'Brown',
    formLabel: 'Brown',
    guideDescription: 'Brown or black bleeding or discharge.',
    group: 'color',
  },
  {
    value: 'red',
    label: 'Red',
    formLabel: 'Red',
    guideDescription: 'Fresh red bleeding or discharge.',
    group: 'color',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    formLabel: 'Yellow',
    guideDescription: 'Yellow or pale yellow mucus or discharge.',
    group: 'color',
  },
] as const;

export function sensationOptionsForGroup(
  group: SensationGuideOption['group'],
): readonly SensationGuideOption[] {
  return SENSATION_GUIDE_OPTIONS.filter((option) => option.group === group);
}

export function appearanceOptionsForGroup(
  group: AppearanceGuideOption['group'],
): readonly AppearanceGuideOption[] {
  return APPEARANCE_GUIDE_OPTIONS.filter((option) => option.group === group);
}
