export type BleedingType = 'heavy' | 'moderate' | 'light' | 'spotting' | 'none' | 'brown';
export type Sensation = 'dry' | 'damp' | 'wet' | 'shiny' | 'sticky' | 'tacky' | 'stretchy';
export type Appearance = 'none' | 'brown' | 'cloudy' | 'cloudy_clear' | 'gummy' | 'clear' | 'lubricative' | 'pasty' | 'red' | 'yellow';
export type Frequency = 1 | 2 | 3 | 'all_day';
export type FertilityClassification = 'dry' | 'early_fertile' | 'fertile' | 'peak_type';
export type MenstrualFlowStart = 'confirmed' | 'not_start' | 'uncertain';

export type PhaseLabel =
  | 'dry'
  | 'fertile_open'
  | 'peak_confirmed'
  | 'p_plus_1'
  | 'p_plus_2'
  | 'p_plus_3'
  | 'post_peak'
  | 'fertile_unconfirmed_peak'
  | 'missing'
  | 'previous_cycle';

export interface MucusObservation {
  /** Stable client-generated identifier. Optional only for legacy payload compatibility. */
  id?: string;
  /** Local civil time in 24-hour HH:mm form. Never interpreted as UTC. */
  observedAt?: string;
  sensation: Sensation;
  appearances: Appearance[];
  frequency?: Frequency;
}

/** @deprecated Prefer MucusObservation. Retained as a source-compatible alias. */
export type Observation = MucusObservation;

export interface DailyEntry {
  date?: string;
  bleeding?: BleedingType;
  /** User assessment of whether this date is the first day of true menstrual flow. */
  menstrualFlowStart?: MenstrualFlowStart;
  /** @deprecated Compatibility projection of the representative mucus observation. */
  sensation?: Sensation;
  /** @deprecated Compatibility projection of the representative mucus observation. */
  appearances?: Appearance[];
  intercourse?: boolean;
  notes?: string;
  /** @deprecated Compatibility projection of the representative mucus observation. */
  frequency?: Frequency;
  missing?: boolean;
  observations?: MucusObservation[];
  mucusRankOverride?: number;
}

export interface CreightonCode {
  baseCode: string;
  appearanceSuffix: string;
  frequencySuffix: string;
  fullCode: string;
  fertilityClassification: FertilityClassification;
}

export type InterpretationWarningId =
  | 'missing_blocks_peak_confirmation'
  | 'calendar_gap_blocks_peak_confirmation'
  | 'peak_confirmation_incomplete'
  | 'uncertain_fertile_start';

export type FertileStartReason = 'first_mucus_after_dry' | 'uncertain_due_to_missing';

export type BleedingClass =
  | 'none'
  | 'cycle_start_flow'
  | 'continuing_menses'
  | 'spotting'
  | 'post_peak_spotting'
  | 'brown_discharge'
  | 'intermenstrual';

export type BrownBleedingContext = 'pre_flow' | 'post_peak' | 'mid_cycle';

/** Bleed-first day classification for calendar color and copy (single source with engine). */
export type PrimaryDayClass =
  | 'missing'
  | 'menstrual_flow'
  | 'spotting'
  | 'dry'
  | 'mucus_observed'
  | 'peak_type';

export type MucusDayClassification =
  | 'dry'
  | 'low_mucus'
  | 'fertile_mucus'
  | 'peak_type';

export interface MucusDerivedDay {
  rank: number | null;
  isPeakType: boolean;
  isLubricative: boolean;
  isStretchy: boolean;
  classification: MucusDayClassification;
}

export interface CycleResult {
  peakCandidateIndex: number | null;
  peakIndex: number | null;
  peakConfirmed: boolean;
  fertileStartIndex: number | null;
  fertileStartReason: FertileStartReason | null;
  fertileEndIndex: number | null;
  phaseLabels: PhaseLabel[];
  mucusRanks: Array<number | null>;
  mucusDerivedByDay: MucusDerivedDay[];
  bleedingClassByDay: BleedingClass[];
  brownBleedingContextByDay: (BrownBleedingContext | null)[];
  dataComplete: boolean;
  interpretationWarnings: InterpretationWarningId[];
  primaryDayClassByDay: PrimaryDayClass[];
}
