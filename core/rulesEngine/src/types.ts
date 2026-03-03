export type BleedingType = 'heavy' | 'moderate' | 'light' | 'spotting' | 'none';
export type Sensation = 'dry' | 'damp' | 'wet' | 'slippery';
export type Appearance = 'none' | 'cloudy' | 'clear' | 'stretchy';
export type Quantity = 'none' | 'low' | 'medium' | 'high';

export interface Observation {
  sensation: Sensation;
  appearance: Appearance;
  quantity?: Quantity;
}

export interface DailyEntry {
  bleeding?: BleedingType;
  sensation?: Sensation;
  appearance?: Appearance;
  quantity?: Quantity;
  intercourse?: boolean;
  notes?: string;
  missing?: boolean;
  observations?: Observation[];
  mucusRankOverride?: number;
}

export interface CycleResult {
  peakIndex: number | null;
  fertileStartIndex: number | null;
  fertileEndIndex: number | null;
  phaseLabels: string[];
  mucusRanks: Array<number | null>;
}
