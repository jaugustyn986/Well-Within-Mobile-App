import { z } from 'zod';
import type { DailyEntry } from 'core-rules-engine';

const bleedingType = z.enum(['heavy', 'moderate', 'light', 'spotting', 'none', 'brown']);
const sensation = z.enum(['dry', 'damp', 'wet', 'shiny', 'sticky', 'tacky', 'stretchy']);
const appearance = z.enum([
  'none', 'brown', 'cloudy', 'cloudy_clear', 'gummy', 'clear', 'lubricative', 'pasty', 'red', 'yellow',
]);
const frequency = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal('all_day')]);
const menstrualFlowStart = z.enum(['confirmed', 'not_start', 'uncertain']);

const observationSchema = z.object({
  id: z.string().min(1).optional(),
  observedAt: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).optional(),
  sensation: sensation,
  appearances: z.array(appearance),
  frequency: frequency.optional(),
});

const observationsSchema = z.array(observationSchema).superRefine((observations, context) => {
  const seenIds = new Set<string>();
  observations.forEach((observation, index) => {
    if (!observation.id) return;
    if (seenIds.has(observation.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mucus observation IDs must be unique',
        path: [index, 'id'],
      });
    }
    seenIds.add(observation.id);
  });
});

export const dailyEntrySchema = z.object({
  date: z.string().optional(),
  bleeding: bleedingType.optional(),
  sensation: sensation.optional(),
  appearances: z.array(appearance).optional(),
  intercourse: z.boolean().optional(),
  notes: z.string().optional(),
  frequency: frequency.optional(),
  missing: z.boolean().optional(),
  observations: observationsSchema.optional(),
  mucusRankOverride: z.number().optional(),
  menstrualFlowStart: menstrualFlowStart.optional(),
});

export type DailyEntryValidated = z.infer<typeof dailyEntrySchema>;

export interface ValidateEntryResult {
  success: true;
  data: DailyEntry;
}

export interface ValidateEntryError {
  success: false;
  error: string;
}

export function validateDailyEntry(value: unknown): ValidateEntryResult | ValidateEntryError {
  const parsed = dailyEntrySchema.safeParse(value);
  if (parsed.success) {
    return { success: true, data: parsed.data as DailyEntry };
  }
  const msg = parsed.error.errors.map((e: { message: string }) => e.message).join('; ');
  return { success: false, error: msg };
}

export function isValidDailyEntry(value: unknown): value is DailyEntry {
  return dailyEntrySchema.safeParse(value).success;
}
