import {
  buildCalendarAlignedCycleDays,
  cycleDayForEntryIndex,
  CycleSlice,
  evaluateInterpretationSupport,
  generateCreightonCode,
  mucusChartStrengthLabel,
  PDF_CHART_STRENGTH_HEADER,
  PhaseLabel,
} from 'core-rules-engine';

const PHASE_DISPLAY: Record<PhaseLabel, string> = {
  dry: 'Dry',
  fertile_open: 'Fertile',
  peak_confirmed: 'Peak',
  p_plus_1: 'P+1',
  p_plus_2: 'P+2',
  p_plus_3: 'P+3',
  post_peak: 'Post-Peak',
  fertile_unconfirmed_peak: 'Fertile (unconf.)',
  missing: 'Missing',
  previous_cycle: 'Prev Cycle',
};

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
  options?: { headerSubtitle?: string },
): string {
  const interpretation = evaluateInterpretationSupport(cycle.entries, cycle.result);
  const observationOnly =
    interpretation.status === 'blocked_by_missing' ||
    interpretation.status === 'review_recommended';
  const headerSubtitle =
    options?.headerSubtitle
    ?? `${cycle.startDate} – ${cycle.endDate} · ${cycle.length} days`;
  const fertileStart = cycle.result.fertileStartIndex !== null
    ? `Day ${cycleDayForEntryIndex(cycle.entries, cycle.result.fertileStartIndex)}`
    : '--';
  const fertileEnd = cycle.result.fertileEndIndex !== null
    ? `Day ${cycleDayForEntryIndex(cycle.entries, cycle.result.fertileEndIndex)}`
    : '--';
  const peakDay = cycle.peakDay !== null ? `Day ${cycle.peakDay}` : '--';
  const luteal = cycle.lutealPhase !== null ? `${cycle.lutealPhase} days` : '--';

  const intercourseHeader = includeIntercourse ? '<th style="padding:6px 8px;text-align:center;">I/C</th>' : '';
  const interpretationHeaders = observationOnly
    ? ''
    : `<th style="padding:6px 8px;text-align:center;">${PDF_CHART_STRENGTH_HEADER}</th>
        <th style="padding:6px 8px;">Code</th>
        <th style="padding:6px 8px;">Phase</th>`;

  const tableRows = buildCalendarAlignedCycleDays(cycle)
    .map((day) => {
      const { entry, phaseLabel: phase, mucusRank: rank } = day;
      const bg = observationOnly ? '#ffffff' : phaseBg(phase);
      const freq = entry?.frequency
        ? (entry.frequency === 'all_day' ? 'AD' : `x${entry.frequency}`)
        : '';
      const appearanceList = entry?.appearances?.filter((a) => a !== 'none').join(', ') ?? '';
      const code = !observationOnly && entry ? generateCreightonCode(entry).fullCode : '';
      const ic = includeIntercourse
        ? `<td style="padding:6px 8px;text-align:center;">${entry?.intercourse ? '🌹' : ''}</td>`
        : '';
      const interpretationCells = observationOnly
        ? ''
        : `<td style="padding:6px 8px;text-align:center;">${mucusChartStrengthLabel(rank, '')}</td>
        <td style="padding:6px 8px;">${code}</td>
        <td style="padding:6px 8px;">${PHASE_DISPLAY[phase] ?? phase}</td>`;
      return `<tr style="background:${bg};">
        <td style="padding:6px 8px;font-weight:600;">${day.cycleDay}</td>
        <td style="padding:6px 8px;">${day.date}</td>
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

  ${observationOnly ? `<div class="notice">
    <div class="notice-title">${interpretation.status === 'review_recommended' ? 'Your chart shows more than one possible Peak pattern' : 'A few days need context'}</div>
    <div class="notice-body">This export focuses on recorded observations and leaves out the chart summary. Keep charting; Well Within checks again when entries are added or updated.</div>
  </div>` : `<div class="stats">
    <div class="stat"><div class="stat-value">${cycle.length}d</div><div class="stat-label">Length</div></div>
    <div class="stat"><div class="stat-value">${peakDay}</div><div class="stat-label">Peak Day</div></div>
    <div class="stat"><div class="stat-value">${fertileStart}–${fertileEnd}</div><div class="stat-label">Fertile Window</div></div>
    <div class="stat"><div class="stat-value">${luteal}</div><div class="stat-label">Luteal Phase</div></div>
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
