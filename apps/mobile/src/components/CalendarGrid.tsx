import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BG_BLEEDING, BG_CARD, BG_DRY, BG_NO_ENTRY, BG_PEAK_TYPE, BG_POST_PEAK,
  FERTILE_ACCENT, PEAK_BORDER,
  TEXT_PRIMARY, TEXT_MUTED, TEXT_SUBTLE,
  BORDER_TODAY, BORDER_CARD, INTERCOURSE_ICON,
} from '../theme/colors';
import {
  getCalendarDayPresentation,
  type CalendarDayInfo,
} from './calendarDayPresentation';

interface Props {
  year: number;
  month: number;
  days: CalendarDayInfo[];
  onDayPress: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDayTextColor(_day: CalendarDayInfo): string {
  return TEXT_PRIMARY;
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function CalendarGrid({ year, month, days, onDayPress, onPrevMonth, onNextMonth }: Props): React.JSX.Element {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayString();
  const visibleMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  const showDerivedLegend = days.some(
    (day) => day.date.startsWith(visibleMonthPrefix) && day.showDerivedMarkers === true,
  );

  const cells: (CalendarDayInfo | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const info = days.find((di) => di.date === dateStr);
    cells.push(info ?? { date: dateStr, hasEntry: false, isToday: dateStr === today });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (CalendarDayInfo | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onPrevMonth}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Text style={styles.navArrow}>{'<'}</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
        <Pressable
          onPress={onNextMonth}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Text style={styles.navArrow}>{'>'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((wd) => (
          <Text key={wd} style={styles.weekdayText}>{wd}</Text>
        ))}
      </View>

      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cell, ci) => {
            if (!cell) return <View key={ci} style={styles.cell} />;
            const dayNum = parseInt(cell.date.split('-')[2], 10);
            const presentation = getCalendarDayPresentation(cell);
            const textColor = getDayTextColor(cell);
            const isPeakConfirmed = presentation.showsPeakMarker;
            const isFuture = cell.date > today;
            return (
              <Pressable
                key={ci}
                style={[
                  styles.cell,
                  { backgroundColor: presentation.backgroundColor },
                  cell.isToday && !isPeakConfirmed && styles.todayBorder,
                  isPeakConfirmed && styles.peakBorder,
                  isFuture && styles.futureCell,
                ]}
                onPress={() => onDayPress(cell.date)}
                disabled={isFuture}
                accessibilityRole="button"
                accessibilityLabel={`${MONTHS[month]} ${dayNum}, ${year}. ${presentation.stateLabel}${(cell.observationCount ?? 0) > 1 ? `. ${cell.observationCount} mucus observations` : ''}`}
                accessibilityState={{ disabled: isFuture }}
              >
                <Text style={[styles.dayText, { color: textColor }]}>{dayNum}</Text>
                {presentation.indicatorColor && (
                  <View style={[styles.babyDot, { backgroundColor: presentation.indicatorColor }]} />
                )}
                {presentation.bleedingMarker ? (
                  <Text style={styles.bleedingMarker}>{presentation.bleedingMarker}</Text>
                ) : null}
                {presentation.patternMarkerLabel ? (
                  <Text style={styles.patternMarker}>{presentation.patternMarkerLabel}</Text>
                ) : null}
                {cell.intercourse && (
                  <Text style={styles.roseIcon}>{INTERCOURSE_ICON}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={styles.legend}>
        <LegendItem color={BG_NO_ENTRY} label="No entry" />
        <LegendItem color={BG_BLEEDING} label="Bleeding" />
        <LegendItem color={BG_DRY} label="Dry" />
        <LegendItem color={BG_DRY} dotColor={FERTILE_ACCENT} label="Non-peak mucus" />
        <LegendItem color={BG_PEAK_TYPE} label="Peak-type sign" />
        {showDerivedLegend ? (
          <LegendItem color={BG_PEAK_TYPE} outlineColor={PEAK_BORDER} label="Peak Day" />
        ) : null}
        {showDerivedLegend ? (
          <LegendItem color={BG_POST_PEAK} label="P+1–P+3" />
        ) : null}
      </View>
    </View>
  );
}

function LegendItem({
  color,
  dotColor,
  outlineColor,
  label,
}: {
  color: string;
  dotColor?: string;
  outlineColor?: string;
  label: string;
}): React.JSX.Element {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: color },
          outlineColor ? { borderColor: outlineColor, borderWidth: 2 } : null,
        ]}
      >
        {dotColor && <View style={[styles.legendBabyDot, { backgroundColor: dotColor }]} />}
      </View>
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: BG_CARD, borderRadius: 12, padding: 12, marginHorizontal: 16, marginTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navArrow: { fontSize: 20, color: TEXT_SUBTLE, paddingHorizontal: 8 },
  monthTitle: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY },
  weekdayRow: { flexDirection: 'row', marginBottom: 4 },
  weekdayText: { flex: 1, textAlign: 'center', fontSize: 12, color: TEXT_MUTED, fontWeight: '500' },
  row: { flexDirection: 'row' },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 1,
  },
  todayBorder: { borderWidth: 2, borderColor: BORDER_TODAY },
  peakBorder: { borderWidth: 2, borderColor: PEAK_BORDER },
  futureCell: { opacity: 0.4 },
  dayText: { fontSize: 14, fontWeight: '500' },
  babyDot: {
    width: 7, height: 7, borderRadius: 4,
    position: 'absolute', top: 3, right: 3,
  },
  bleedingMarker: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  patternMarker: {
    position: 'absolute',
    bottom: 2,
    left: 3,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  roseIcon: {
    position: 'absolute', bottom: 1, right: 1,
    fontSize: 8,
  },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendSwatch: {
    width: 14, height: 14, borderRadius: 3,
    borderWidth: 1, borderColor: BORDER_CARD,
    marginRight: 4, justifyContent: 'center', alignItems: 'center',
  },
  legendBabyDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 11, color: TEXT_SUBTLE },
});
