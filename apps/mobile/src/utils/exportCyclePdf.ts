import {
  buildCalendarAlignedCycleDays,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
  CycleSlice,
  mucusChartStrengthLabel,
  PDF_CHART_STRENGTH_HEADER,
  PhaseLabel,
  PossibleFertilePatternEligibilityOptions,
} from 'core-rules-engine';
import {
  formatFullDate,
  formatPossibleFertilePatternBody,
  formatPossibleFertilePatternLimit,
} from './dateDisplay';

function phaseDisplay(phase: PhaseLabel, rank: number | null): string {
  if (phase === 'fertile_open' || phase === 'fertile_unconfirmed_peak') {
    if (rank !== null && rank >= 3) return 'Peak-type mucus';
    if (rank !== null && rank >= 1) return 'Mucus sign';
    return 'Dry observation';
  }
  const display: Record<Exclude<PhaseLabel, 'fertile_open' | 'fertile_unconfirmed_peak'>, string> = {
    dry: 'Dry',
    peak_confirmed: 'Peak',
    p_plus_1: 'P+1',
    p_plus_2: 'P+2',
    p_plus_3: 'P+3',
    post_peak: 'Post-Peak',
    missing: 'Missing',
    previous_cycle: 'Prev Cycle',
  };
  return display[phase];
}

function phaseBg(phase: PhaseLabel): string {
  switch (phase) {
    case 'peak_confirmed': return '#E8E6E3';
    case 'p_plus_1': case 'p_plus_2': case 'p_plus_3': return '#fef9c3';
    case 'fertile_open': case 'fertile_unconfirmed_peak': return '#dcfce7';
    default: return '#ffffff';
  }
}

export function buildCyclePdfHtml(
  cycle: CycleSlice,
  includeIntercourse: boolean,
  options?: {
    headerSubtitle?: string;
    possibleFertilePatternEligibility?: PossibleFertilePatternEligibilityOptions;
  },
): string {
  const possibleFertilePattern = buildPossibleFertilePatternPresentation(
    cycle.entries,
    cycle.result,
    options?.possibleFertilePatternEligibility
      ?? buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
  );
  const observationOnly = possibleFertilePattern.state !== 'bounded';
  const headerSubtitle =
    options?.headerSubtitle
    ?? `${formatFullDate(cycle.startDate)} – ${formatFullDate(cycle.endDate)} · ${cycle.length} days`;
  const peakDay = possibleFertilePattern.peak
    ? `Day ${possibleFertilePattern.peak.cycleDay}`
    : '--';
  const noticeTitle = possibleFertilePattern.heading ?? 'Recorded observations';
  const noticeBody = formatPossibleFertilePatternBody(possibleFertilePattern)
    ?? 'This export focuses on recorded observations and leaves out chart-based pattern boundaries.';
  const noticeDetail = formatPossibleFertilePatternLimit(possibleFertilePattern.limit);

  const intercourseHeader = includeIntercourse ? '<th style="padding:6px 8px;text-align:center;">I/C</th>' : '';
  const interpretationHeaders = observationOnly
    ? ''
    : `<th style="padding:6px 8px;text-align:center;">${PDF_CHART_STRENGTH_HEADER}</th>
        <th style="padding:6px 8px;">Phase</th>`;

  const tableRows = buildCalendarAlignedCycleDays(cycle)
    .map((day) => {
      const { entry, phaseLabel: phase, mucusRank: rank } = day;
      const bg = observationOnly ? '#ffffff' : phaseBg(phase);
      const freq = entry?.frequency
        ? (entry.frequency === 'all_day' ? 'AD' : `x${entry.frequency}`)
        : '';
      const appearanceList = entry?.appearances?.filter((a) => a !== 'none').join(', ') ?? '';
      const ic = includeIntercourse
        ? `<td style="padding:6px 8px;text-align:center;">${entry?.intercourse ? '🌹' : ''}</td>`
        : '';
      const interpretationCells = observationOnly
        ? ''
        : `<td style="padding:6px 8px;text-align:center;">${mucusChartStrengthLabel(rank, '')}</td>
        <td style="padding:6px 8px;">${phaseDisplay(phase, rank)}</td>`;
      return `<tr style="background:${bg};">
        <td style="padding:6px 8px;font-weight:600;">${day.cycleDay}</td>
        <td style="padding:6px 8px;">${formatFullDate(day.date)}</td>
        <td style="padding:6px 8px;">${entry?.bleeding && entry.bleeding !== 'none' ? entry.bleeding : ''}</td>
        <td style="padding:6px 8px;">${entry?.sensation ?? ''}</td>
        <td style="padding:6px 8px;">${appearanceList}</td>
        <td style="padding:6px 8px;text-align:center;">${freq}</td>
        ${interpretationCells}
        ${ic}
      </tr>`;
    })
    .join('');

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #3F3A36; }
    h1 { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
    .subtitle { color: #6F6A65; font-size: 13px; margin-bottom: 20px; }
    .stats { display: flex; gap: 12px; margin-bottom: 20px; }
    .stat { flex: 1; background: #F6F3EF; border: 1px solid #E7E2DE; border-radius: 8px; padding: 12px; text-align: center; }
    .stat-value { font-size: 20px; font-weight: 600; }
    .stat-label { font-size: 10px; color: #6F6A65; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #F5F3F1; padding: 8px; text-align: left; font-weight: 600; border-bottom: 2px solid #E7E2DE; }
    td { border-bottom: 1px solid #F5F3F1; }
    .footer { margin-top: 20px; font-size: 10px; color: #A09A94; text-align: center; }
    .notice { background: #F7F0E8; border: 1px solid #E7E2DE; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
    .notice-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .notice-body { color: #5A5550; font-size: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <h1>Cycle ${cycle.cycleNumber}</h1>
  <div class="subtitle">${headerSubtitle}</div>

  <div class="notice">
    <div class="notice-title">${noticeTitle}</div>
    <div class="notice-body">${noticeBody}</div>
    ${noticeDetail ? `<div class="notice-body" style="margin-top:6px;">${noticeDetail}</div>` : ''}
    ${possibleFertilePattern.limitation ? `<div class="notice-body" style="margin-top:8px;">${possibleFertilePattern.limitation}</div>` : ''}
    ${observationOnly ? '<div class="notice-body" style="margin-top:8px;">This export focuses on recorded observations and leaves out chart-based pattern boundaries.</div>' : ''}
  </div>

  ${observationOnly ? '' : `<div class="stats">
    <div class="stat"><div class="stat-value">${cycle.length}d</div><div class="stat-label">Length</div></div>
    <div class="stat"><div class="stat-value">${peakDay}</div><div class="stat-label">Peak marker</div></div>
  </div>`}

  <h2 style="font-size:14px;margin-bottom:8px;">Day-by-Day Observations</h2>
  <table>
    <thead>
      <tr>
        <th style="padding:6px 8px;">Day</th>
        <th style="padding:6px 8px;">Date</th>
        <th style="padding:6px 8px;">Bleeding</th>
        <th style="padding:6px 8px;">Sensation</th>
        <th style="padding:6px 8px;">Appearance</th>
        <th style="padding:6px 8px;text-align:center;">Freq</th>
        ${interpretationHeaders}
        ${intercourseHeader}
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>

  <div class="footer">Generated by Well Within · ${new Date().toLocaleDateString()}</div>
</body>
</html>`;
  return fullHtml;
}
