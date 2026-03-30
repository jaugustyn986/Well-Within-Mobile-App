export type BleedingType = 'heavy' | 'moderate' | 'light' | 'spotting' | 'none' | 'brown';
export type Sensation = 'dry' | 'damp' | 'wet' | 'shiny' | 'sticky' | 'tacky' | 'stretchy';
export type Appearance = 'none' | 'brown' | 'cloudy' | 'cloudy_clear' | 'gummy' | 'clear' | 'lubricative' | 'pasty' | 'red' | 'yellow';
export type Frequency = 1 | 2 | 3 | 'all_day';
export type FertilityClassification = 'dry' | 'early_fertile' | 'fertile' | 'peak_type';

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

export interface Observation {
  sensation: Sensation;
  appearances: Appearance[];
}

export interface DailyEntry {
  date?: string;
  bleeding?: BleedingType;
  sensation?: Sensation;
  appearances?: Appearance[];
  intercourse?: boolean;
  notes?: string;
  frequency?: Frequency;
  missing?: boolean;
  observations?: Observation[];
  /** Test/fixture only -- bypasses sensation/appearance rank calculation. */
  mucusRankOverride?: number;
}

export interface CreightonCode {
  baseCode: string;
  appearanceSuffix: string;
  frequencySuffix: string;
  fullCode: string;
  fertilityClassification: FertilityClassification;
}

/** Deterministic warning ids for UI copy mapping (see RULES_ENGINE_SPEC). */
export type InterpretationWarningId =
  | 'missing_blocks_peak_confirmation'
  | 'calendar_gap_blocks_peak_confirmation'
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

export interface CycleResult {
  peakCandidateIndex: number | null;
  peakIndex: number | null;
  peakConfirmed: boolean;
  fertileStartIndex: number | null;
  fertileStartReason: FertileStartReason | null;
  fertileEndIndex: number | null;
  phaseLabels: PhaseLabel[];
  mucusRanks: Array<number | null>;
  bleedingClassByDay: BleedingClass[];
  brownBleedingContextByDay: (BrownBleedingContext | null)[];
  dataComplete: boolean;
  interpretationWarnings: InterpretationWarningId[];
}
