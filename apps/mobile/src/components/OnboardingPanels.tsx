/**
 * OnboardingPanels — static, code-rendered UI previews for onboarding slides.
 *
 * Each panel mirrors the real app's exact component styles so it looks identical
 * to the live UI at native resolution. No image assets, no upscaling, no blur.
 *
 * Data policy: all state shown is illustrative (early-cycle defaults and empty
 * stats). No user-specific values are fabricated.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { POSSIBLE_FERTILE_PATTERN_IN_APP_NOTE } from 'core-rules-engine';
import { LineIcon } from './LineIcon';
import {
  BG_CARD, BG_PAGE, BG_CARD_GRADIENT_START, BG_POST_PEAK, BG_PEAK_TYPE,
  BG_BLEEDING, BG_DRY, BG_NO_ENTRY, BG_MISSING,
  BANNER_TONE_POSITIVE_BG, FERTILE_ACCENT, PEAK_BORDER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, TEXT_SUBTLE,
  BORDER_CARD, BORDER_TODAY,
  ACCENT_WARM, ACCENT_WARM_TINT, BRAND_NAME,
} from '../theme/colors';

/* ─────────────────────────────────────────────────
   Shared wrapper
───────────────────────────────────────────────── */

function PhoneCard({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={shared.card}>
      {children}
    </View>
  );
}

const shared = StyleSheet.create({
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});

/* ─────────────────────────────────────────────────
   Mini calendar (internal — used by slides 2, 4, 7)

   April 2026: starts Wednesday (offset = 3).
   Each cell can carry an optional dot (mucus indicator).
───────────────────────────────────────────────── */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const APRIL_OFFSET = 3; // April 1 2026 = Wednesday

type CellData = { day: number; bg: string; isToday: boolean; dot?: string; peakBorder?: boolean } | null;

function padAndChunk(days: CellData[]): CellData[][] {
  const cells: CellData[] = [
    ...Array(APRIL_OFFSET).fill(null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: CellData[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Slide 2 — bleeding days 1-3, no-entry day 4, dry days 5-6, today=7 */
function buildSlide2Cells(): CellData[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    let bg = BG_NO_ENTRY;
    if (d <= 3) bg = BG_BLEEDING;
    else if (d === 5 || d === 6) bg = BG_DRY;
    return { day: d, bg, isToday: d === 7 };
  });
}

/** Slide 4 — mucus 1-2 (dot), peak-type 3, confirmed peak 4 (charcoal border), post-peak 5-7, today=7 */
function buildSlide4Cells(): CellData[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    let bg = BG_NO_ENTRY;
    let dot: string | undefined;
    let peakBorder: boolean | undefined;
    if (d <= 2) { bg = BG_DRY; dot = FERTILE_ACCENT; }
    else if (d === 3) { bg = BG_PEAK_TYPE; }
    else if (d === 4) { bg = BG_PEAK_TYPE; peakBorder = true; }
    else if (d >= 5 && d <= 7) { bg = BG_POST_PEAK; }
    return { day: d, bg, isToday: d === 7, dot, peakBorder };
  });
}

/** Slide 7 — all no-entry, today=7 */
function buildSlide7Cells(): CellData[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    return { day: d, bg: BG_NO_ENTRY, isToday: d === 7 };
  });
}

function MiniCalendar({ cells, rows = 3 }: { cells: CellData[]; rows?: number }): React.JSX.Element {
  const allRows = padAndChunk(cells);
  const visible = allRows.slice(0, rows);

  return (
    <View style={cal.wrap}>
      <View style={cal.header}>
        <Text style={cal.arrow}>{'<'}</Text>
        <Text style={cal.month}>April 2026</Text>
        <Text style={cal.arrow}>{'>'}</Text>
      </View>
      <View style={cal.wdRow}>
        {WEEKDAYS.map(w => <Text key={w} style={cal.wd}>{w}</Text>)}
      </View>
      {visible.map((row, ri) => (
        <View key={ri} style={cal.row}>
          {row.map((cell, ci) =>
            !cell
              ? <View key={ci} style={cal.cell} />
              : (
                <View
                  key={ci}
                  style={[
                    cal.cell,
                    { backgroundColor: cell.bg },
                    cell.peakBorder && cal.peakBorder,
                    !cell.peakBorder && cell.isToday && cal.today,
                  ]}
                >
                  <Text style={cal.num}>{cell.day}</Text>
                  {cell.dot ? <View style={[cal.dot, { backgroundColor: cell.dot }]} /> : null}
                </View>
              ),
          )}
        </View>
      ))}
    </View>
  );
}

const cal = StyleSheet.create({
  wrap: { marginTop: 0, maxWidth: 380, width: '100%' as unknown as number, alignSelf: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6,
  },
  arrow: { fontSize: 17, color: TEXT_SUBTLE, paddingHorizontal: 8 },
  month: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  wdRow: { flexDirection: 'row', marginBottom: 2 },
  wd: { flex: 1, textAlign: 'center', fontSize: 10, color: TEXT_MUTED, fontWeight: '500' },
  row: { flexDirection: 'row' },
  cell: {
    flex: 1, aspectRatio: 1,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 6, margin: 1,
  },
  today: { borderWidth: 2, borderColor: BORDER_TODAY },
  peakBorder: { borderWidth: 2, borderColor: PEAK_BORDER },
  num: { fontSize: 12, fontWeight: '500', color: TEXT_PRIMARY },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    position: 'absolute', top: 3, right: 3,
  },
});

/* ─────────────────────────────────────────────────
   SLIDE 2 — "Not sure what your chart means?"
   Matches reference: Tracking banner + calendar with
   bleeding days 1-3, dry days 5-6, today=7 (no entry).
───────────────────────────────────────────────── */

export function OnboardingCalendarUncertaintyPanel(): React.JSX.Element {
  return (
    <View style={{ gap: 10 }}>
      <PhoneCard>
        <View style={[banner.container, { backgroundColor: BG_CARD_GRADIENT_START }]}>
          <Text style={banner.headline}>Your pattern is still taking shape</Text>
          <Text style={banner.confidence}>No mucus signs are recorded for this day.</Text>
          <Text style={banner.cycleDay}>Cycle Day 7 · 1 day still open in this cycle</Text>
          <Text style={banner.support}>Keep charting daily. This card will update as your observations change.</Text>
        </View>
      </PhoneCard>
      <PhoneCard>
        <MiniCalendar cells={buildSlide2Cells()} rows={5} />
      </PhoneCard>
    </View>
  );
}

/* ─────────────────────────────────────────────────
   SLIDE 4 — "See where you are in your cycle"
   Matches reference: post-Peak pattern banner (green bg)
   + calendar with mucus days 1-2 (dot), post-peak 5-7,
   today=7.
───────────────────────────────────────────────── */

export function OnboardingStatusBannerPanel(): React.JSX.Element {
  return (
    <View style={{ gap: 10 }}>
      <PhoneCard>
        <View style={[banner.container, { backgroundColor: BANNER_TONE_POSITIVE_BG }]}>
          <Text style={banner.headline}>Your chart shows a post-Peak pattern</Text>
          <Text style={banner.confidence}>
            Cycle Day 12 was the last Peak-type sign before three days without another one, so your chart marks it as Peak Day.
          </Text>
          <Text style={banner.limitation}>{POSSIBLE_FERTILE_PATTERN_IN_APP_NOTE}</Text>
          <Text style={banner.cycleDay}>Cycle Day 15 · All days charted so far</Text>
          <Text style={banner.support}>Keep charting daily. This summary updates when your observations change.</Text>
        </View>
      </PhoneCard>
      <PhoneCard>
        <MiniCalendar cells={buildSlide4Cells()} rows={5} />
      </PhoneCard>
    </View>
  );
}

const banner = StyleSheet.create({
  container: { borderRadius: 10, padding: 14 },
  headline: { fontSize: 19, fontWeight: '600', color: TEXT_PRIMARY, letterSpacing: -0.2 },
  confidence: { fontSize: 13, fontWeight: '500', color: TEXT_SECONDARY, marginTop: 8, lineHeight: 20 },
  limitation: { fontSize: 12, color: TEXT_SUBTLE, marginTop: 5, lineHeight: 17 },
  cycleDay: { fontSize: 12, color: TEXT_SUBTLE, marginTop: 4, lineHeight: 17 },
  support: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 8, lineHeight: 20 },
});

/* ─────────────────────────────────────────────────
   SLIDE 5 — "Record a simple observation each day"
   Shows the top section of EntryForm (bleeding, hint).
───────────────────────────────────────────────── */

const ONBOARDING_SENSATIONS: readonly {
  label: string;
  description: string;
  wide?: boolean;
}[] = [
  { label: 'Dry', description: 'No sensation' },
  { label: 'Damp', description: 'Slightly moist' },
  { label: 'Wet', description: 'Wet, no lubrication' },
  { label: 'Shiny', description: 'Shiny, no lubrication' },
  { label: 'Sticky', description: 'Holds together' },
  { label: 'Tacky', description: 'Stretches slightly' },
  { label: 'Stretchy', description: 'Stretches 1 inch or more', wide: true },
];

export function OnboardingEntryPanel(): React.JSX.Element {
  return (
    <PhoneCard>
      <View style={entry.headingRow}>
        <Text style={entry.title}>Daily Observation</Text>
        <View style={entry.todayBadge}>
          <Text style={entry.todayBadgeText}>Today</Text>
        </View>
      </View>
      <View style={entry.section}>
        <Text style={entry.fieldLabel}>Sensation</Text>
        <View style={entry.cardGrid}>
          {ONBOARDING_SENSATIONS.map((option) => (
            <View
              key={option.label}
              style={[entry.sensationCard, option.wide && entry.sensationCardWide]}
            >
              <Text style={entry.sensationTitle}>{option.label}</Text>
              <Text style={[entry.sensationDescription, option.wide && entry.wideDescription]}>
                {option.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={entry.intentNote}>
        <View style={entry.checkCircle}>
          <Text style={entry.checkText}>✓</Text>
        </View>
        <Text style={entry.intentText}>
          Nothing is selected for you. Choose a sensation before saving.
        </Text>
      </View>
    </PhoneCard>
  );
}

const entry = StyleSheet.create({
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY },
  todayBadge: {
    borderRadius: 999,
    backgroundColor: BG_MISSING,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  todayBadgeText: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  section: { marginTop: 16 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 9,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  sensationCard: {
    width: '48.7%',
    minHeight: 58,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    paddingHorizontal: 11,
    paddingVertical: 9,
    justifyContent: 'center',
  },
  sensationCardWide: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sensationTitle: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  sensationDescription: {
    color: TEXT_MUTED,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  wideDescription: {
    marginTop: 0,
    textAlign: 'right',
    flexShrink: 1,
  },
  intentNote: {
    marginTop: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: FERTILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkText: {
    color: FERTILE_ACCENT,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },
  intentText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});

/* ─────────────────────────────────────────────────
   ACTIVATION — show how one observation gains context
───────────────────────────────────────────────── */

export function OnboardingChartContextPanel(): React.JSX.Element {
  return (
    <View style={chartContext.wrap}>
      <PhoneCard>
        <View style={chartContext.exampleHeader}>
          <View>
            <Text style={chartContext.eyebrow}>Example observation</Text>
            <Text style={chartContext.entryDate}>One saved entry</Text>
          </View>
          <View style={chartContext.observationBadge}>
            <Text style={chartContext.observationBadgeText}>Wet · Cloudy</Text>
          </View>
        </View>
      </PhoneCard>

      <View style={chartContext.connector}>
        <View style={chartContext.connectorLine} />
        <Text style={chartContext.connectorText}>becomes part of your chart</Text>
        <Text style={chartContext.connectorArrow}>⌄</Text>
      </View>

      <PhoneCard>
        <View style={chartContext.statusCard}>
          <Text style={chartContext.statusTitle}>Your pattern is still taking shape</Text>
          <Text style={chartContext.statusBody}>
            Keep charting daily. This summary updates as your observations change.
          </Text>
        </View>
        <View style={chartContext.weekRow}>
          {[
            { day: 'S', date: '1', tone: BG_BLEEDING },
            { day: 'M', date: '2', tone: BG_BLEEDING },
            { day: 'T', date: '3', tone: BG_DRY },
            { day: 'W', date: '4', tone: BG_PEAK_TYPE },
            { day: 'T', date: '5', tone: BG_POST_PEAK },
            { day: 'F', date: '6', tone: BG_POST_PEAK },
            { day: 'S', date: '7', tone: BG_NO_ENTRY },
          ].map((item, index) => (
            <View key={`${item.day}-${item.date}`} style={chartContext.weekDay}>
              <Text style={chartContext.weekDayLabel}>{item.day}</Text>
              <View
                style={[
                  chartContext.dateCell,
                  { backgroundColor: item.tone },
                  index === 6 && chartContext.todayCell,
                ]}
              >
                <Text style={chartContext.dateText}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </PhoneCard>

      <View style={chartContext.benefitNote}>
        <Text style={chartContext.benefitText}>
          Over time, review past cycles and export your chart when you need it.
        </Text>
      </View>
    </View>
  );
}

const chartContext = StyleSheet.create({
  wrap: { gap: 10 },
  exampleHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  entryDate: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 5,
  },
  observationBadge: {
    borderRadius: 999,
    backgroundColor: BG_PEAK_TYPE,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  observationBadgeText: {
    color: TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
  connector: {
    minHeight: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    height: 10,
    width: 1,
    backgroundColor: BORDER_CARD,
  },
  connectorText: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  connectorArrow: {
    color: ACCENT_WARM,
    fontSize: 20,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  statusTitle: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  statusBody: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  weekDay: {
    alignItems: 'center',
    flex: 1,
  },
  weekDayLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 5,
  },
  dateCell: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: BORDER_TODAY,
  },
  dateText: {
    color: TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
  benefitNote: {
    backgroundColor: ACCENT_WARM_TINT,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  benefitText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});

/* ─────────────────────────────────────────────────
   ACTIVATION — reinforce local-first privacy
───────────────────────────────────────────────── */

const PRIVACY_ROWS = [
  {
    icon: 'device',
    title: 'Stored on this device',
    body: 'Your chart is local by default.',
  },
  {
    icon: 'lock',
    title: 'Optional cloud backup',
    body: 'Turn it on later if you choose.',
  },
  {
    icon: 'shield',
    title: 'Export or delete',
    body: 'Use your chart and data controls when you need them.',
  },
] as const;

export function OnboardingPrivacyPanel(): React.JSX.Element {
  return (
    <View style={privacy.wrap}>
      <View style={privacy.heroIcon}>
        <LineIcon name="lock" size={48} />
      </View>
      {PRIVACY_ROWS.map((row) => (
        <PhoneCard key={row.title}>
          <View style={privacy.row}>
            <LineIcon name={row.icon} size={22} />
            <View style={privacy.copy}>
              <Text style={privacy.title}>{row.title}</Text>
              <Text style={privacy.body}>{row.body}</Text>
            </View>
          </View>
        </PhoneCard>
      ))}
    </View>
  );
}

const privacy = StyleSheet.create({
  wrap: { gap: 10 },
  heroIcon: {
    alignItems: 'center',
    marginBottom: 4,
  },
  row: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  body: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
});

/* ─────────────────────────────────────────────────
   ACTIVATION — preview the direct first action
───────────────────────────────────────────────── */

const SHORT_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function currentWeek(date: Date): Date[] {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
  return Array.from(
    { length: 7 },
    (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  );
}

export function OnboardingFirstActionPanel(): React.JSX.Element {
  const today = new Date();
  const week = currentWeek(today);

  return (
    <View style={firstAction.wrap}>
      <PhoneCard>
        <View style={firstAction.weekRow}>
          {week.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            return (
              <View key={date.toISOString()} style={firstAction.weekDay}>
                <Text style={firstAction.weekLabel}>{SHORT_WEEKDAYS[index]}</Text>
                <View style={[firstAction.dayCircle, isToday && firstAction.dayCircleToday]}>
                  <Text style={[firstAction.dayNumber, isToday && firstAction.dayNumberToday]}>
                    {date.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </PhoneCard>

      <PhoneCard>
        <View style={firstAction.entryRow}>
          <View>
            <Text style={firstAction.entryTitle}>Today’s Observation</Text>
            <Text style={firstAction.entryDate}>
              {SHORT_MONTHS[today.getMonth()]} {today.getDate()}
            </Text>
          </View>
          <LineIcon name="observe" size={25} />
        </View>
      </PhoneCard>

      <View style={firstAction.intentNote}>
        <View style={firstAction.checkCircle}>
          <Text style={firstAction.checkText}>✓</Text>
        </View>
        <Text style={firstAction.intentText}>
          Nothing is saved until you choose an observation.
        </Text>
      </View>
    </View>
  );
}

const firstAction = StyleSheet.create({
  wrap: { gap: 11 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 7,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BG_NO_ENTRY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    backgroundColor: ACCENT_WARM,
  },
  dayNumber: {
    color: TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  dayNumberToday: {
    color: '#FFFFFF',
  },
  entryRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  entryTitle: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '600',
  },
  entryDate: {
    color: TEXT_MUTED,
    fontSize: 13,
    marginTop: 5,
  },
  intentNote: {
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: FERTILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: FERTILE_ACCENT,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },
  intentText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});

/* ─────────────────────────────────────────────────
   LEGACY — retained for older previews
───────────────────────────────────────────────── */

export function OnboardingHistoryPanel(): React.JSX.Element {
  return (
    <PhoneCard>
      <Text style={hist.heading}>What your past cycles have shown</Text>
      <Text style={hist.body}>
        We’ll compare completed cycles once three have enough chart detail.
      </Text>
      <Text style={hist.note}>
        See what repeats or changes from cycle to cycle. Every cycle can be different.
      </Text>
    </PhoneCard>
  );
}

const hist = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  body: { fontSize: 13, color: TEXT_SECONDARY, lineHeight: 20 },
  note: { fontSize: 12, color: TEXT_MUTED, lineHeight: 18, marginTop: 8 },
});

/* ─────────────────────────────────────────────────
   SLIDE 7 — "Start your first cycle"
   Empty calendar + today's entry prompt below.
───────────────────────────────────────────────── */

export function OnboardingEmptyCalendarPanel(): React.JSX.Element {
  return (
    <View style={{ gap: 10 }}>
      <PhoneCard>
        <MiniCalendar cells={buildSlide7Cells()} rows={4} />
      </PhoneCard>

      <PhoneCard>
        <View style={todayEntry.row}>
          <Text style={todayEntry.title}>Today's Observation</Text>
          <Text style={todayEntry.date}>Apr 7</Text>
        </View>
        <View style={todayEntry.divider} />
        <View style={todayEntry.tapRow}>
          <Text style={todayEntry.tapLabel}>Tap to record today's observation</Text>
          <Text style={todayEntry.chevron}>{'›'}</Text>
        </View>
      </PhoneCard>
    </View>
  );
}

const todayEntry = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  date: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_CARD,
    marginBottom: 10,
  },
  tapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapLabel: {
    fontSize: 15,
    color: ACCENT_WARM,
  },
  chevron: {
    fontSize: 20,
    color: ACCENT_WARM,
    lineHeight: 22,
  },
});
