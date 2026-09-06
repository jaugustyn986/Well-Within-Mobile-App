import {
  buildCalendarAlignedCycleDays,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
  CycleSlice,
  mucusChartStrengthLabel,
  PDF_CHART_STRENGTH_HEADER,
  PhaseLabel,
  PossibleFertilePatternEligibilityOptions,
  PrimaryDayClass,
  resolveDailyMucus,
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
    peak_confirmed: 'Peak Day',
    p_plus_1: 'P+1',
    p_plus_2: 'P+2',
    p_plus_3: 'P+3',
    post_peak: 'Post-Peak',
    missing: 'Missing',
    previous_cycle: 'Previous cycle',
  };
  return display[phase];
}

function pdfSafePunctuation(value: string): string {
  return value
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/·/g, '|');
}

function escapeHtml(value: string): string {
  return pdfSafePunctuation(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function displayEnum(value: string): string {
  if (value === 'cloudy_clear') return 'Cloudy / clear';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function rowPresentationClass(
  primaryDayClass: PrimaryDayClass,
  phase: PhaseLabel,
  observationOnly: boolean,
): string {
  if (primaryDayClass === 'menstrual_flow' || primaryDayClass === 'spotting') {
    return 'row-bleeding';
  }
  if (
    !observationOnly
    && (phase === 'p_plus_1' || phase === 'p_plus_2' || phase === 'p_plus_3')
  ) {
    return 'row-p-plus';
  }
  if (primaryDayClass === 'peak_type') return 'row-peak';
  if (primaryDayClass === 'mucus_observed') return 'row-mucus';
  if (primaryDayClass === 'missing') return 'row-missing';
  return 'row-dry';
}

function recordedSensation(
  entry: ReturnType<typeof buildCalendarAlignedCycleDays>[number]['entry'],
  sensation: string | undefined,
): string {
  if (!entry) return 'No entry';
  if (entry.missing) return 'Not observed';
  return sensation ? displayEnum(sensation) : '';
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
  const headerSubtitle = escapeHtml(
    options?.headerSubtitle
      ?? `${formatFullDate(cycle.startDate)} - ${formatFullDate(cycle.endDate)} | ${cycle.length} days`,
  );
  const peakDay = possibleFertilePattern.peak
    ? `Day ${possibleFertilePattern.peak.cycleDay}`
    : '--';
  const noticeTitle = possibleFertilePattern.heading ?? 'Recorded observations';
  const noticeBody = formatPossibleFertilePatternBody(possibleFertilePattern)
    ?? 'This export focuses on recorded observations and leaves out chart-based pattern boundaries.';
  const noticeDetail = formatPossibleFertilePatternLimit(possibleFertilePattern.limit);

  const intercourseHeader = includeIntercourse
    ? '<th class="cell-center">I/C</th>'
    : '';
  const interpretationHeaders = observationOnly
    ? ''
    : `<th class="cell-center">${escapeHtml(PDF_CHART_STRENGTH_HEADER)} result</th>
        <th>Phase</th>`;
  const recordedColumnCount = includeIntercourse ? 5 : 4;
  const interpretationGroup = observationOnly
    ? ''
    : '<th colspan="2" class="group-interpretation">Chart interpretation</th>';
  const tableColumns = observationOnly
    ? includeIntercourse
      ? `<col style="width:6%" /><col style="width:18%" /><col style="width:14%" />
         <col style="width:16%" /><col style="width:30%" /><col style="width:10%" /><col style="width:6%" />`
      : `<col style="width:7%" /><col style="width:20%" /><col style="width:15%" />
         <col style="width:17%" /><col style="width:31%" /><col style="width:10%" />`
    : includeIntercourse
      ? `<col style="width:5%" /><col style="width:15%" /><col style="width:11%" />
         <col style="width:12%" /><col style="width:19%" /><col style="width:7%" />
         <col style="width:11%" /><col style="width:16%" /><col style="width:4%" />`
      : `<col style="width:6%" /><col style="width:16%" /><col style="width:11%" />
         <col style="width:12%" /><col style="width:20%" /><col style="width:7%" />
         <col style="width:11%" /><col style="width:17%" />`;

  const tableRows = buildCalendarAlignedCycleDays(cycle)
    .map((day, index) => {
      const { entry, phaseLabel: phase, mucusRank: rank } = day;
      const resolved = resolveDailyMucus(entry);
      const representative = resolved.representative;
      const freq = representative?.frequency
        ? (representative.frequency === 'all_day' ? 'All day' : `x${representative.frequency}`)
        : '';
      const appearanceList = representative?.appearances
        .filter((appearance) => appearance !== 'none')
        .map(displayEnum)
        .join(', ') ?? '';
      const observationCount = resolved.observations.length > 1
        ? `<div class="multi-count">${resolved.observations.length} mucus observations - strongest shown</div>`
        : '';
      const rowTone = rowPresentationClass(day.primaryDayClass, phase, observationOnly);
      const peakDayClass = !observationOnly && phase === 'peak_confirmed' ? ' row-peak-day' : '';
      const alternatingClass = index % 2 === 1 ? ' row-alternate' : '';
      const sensation = recordedSensation(entry, representative?.sensation);
      const statusClass = !representative ? ' status-value' : '';
      const ic = includeIntercourse
        ? `<td class="cell-center intercourse">${entry?.intercourse ? '🌹' : ''}</td>`
        : '';
      const interpretationCells = observationOnly
        ? ''
        : `<td class="cell-center chart-value">${escapeHtml(mucusChartStrengthLabel(rank, ''))}</td>
        <td class="phase-value">${escapeHtml(phaseDisplay(phase, rank))}</td>`;
      const bleeding = entry?.bleeding && entry.bleeding !== 'none'
        ? displayEnum(entry.bleeding)
        : '';

      return `<tr class="data-row ${rowTone}${peakDayClass}${alternatingClass}">
        <td class="cycle-day">${day.cycleDay}</td>
        <td class="date-cell">${escapeHtml(formatFullDate(day.date))}${observationCount}</td>
        <td>${escapeHtml(bleeding)}</td>
        <td class="${statusClass.trim()}">${escapeHtml(sensation)}</td>
        <td>${escapeHtml(appearanceList)}</td>
        <td class="cell-center">${escapeHtml(freq)}</td>
        ${interpretationCells}
        ${ic}
      </tr>`;
    })
    .join('');

  const legendItems = [
    '<span class="legend-item"><span class="legend-swatch swatch-bleeding"></span>Bleeding</span>',
    '<span class="legend-item"><span class="legend-swatch swatch-mucus"></span>Mucus</span>',
    '<span class="legend-item"><span class="legend-swatch swatch-peak"></span>Peak-type / Peak Day</span>',
    !observationOnly
      ? '<span class="legend-item"><span class="legend-swatch swatch-p-plus"></span>P+1 through P+3</span>'
      : '',
    '<span class="legend-item"><span class="legend-swatch swatch-missing"></span>Not observed / no entry</span>',
  ].filter(Boolean).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Well Within - Cycle ${cycle.cycleNumber}</title>
  <style>
    @page { size: Letter portrait; margin: 24px 30px 24px; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      margin: 0;
      color: #3F3A36;
      background: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 10px;
      line-height: 1.35;
    }
    .report-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      padding: 2px 0 12px;
      border-bottom: 2px solid #86685C;
    }
    .brand {
      color: #86685C;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    h1 { margin: 0; color: #3F3A36; font-size: 25px; line-height: 1.05; font-weight: 700; }
    .subtitle { max-width: 62%; color: #6F6A65; font-size: 10.5px; text-align: right; }
    .summary-grid { display: flex; gap: 8px; margin: 8px 0 6px; }
    .stat {
      min-width: 112px;
      padding: 5px 10px;
      border: 1px solid #E7E2DE;
      border-radius: 7px;
      background: #F8F6F3;
    }
    .stat-value { color: #3F3A36; font-size: 14px; font-weight: 700; line-height: 1.1; }
    .stat-label { margin-top: 1px; color: #6F6A65; font-size: 7.5px; letter-spacing: .45px; text-transform: uppercase; }
    .notice {
      margin: 6px 0 8px;
      padding: 6px 9px;
      border: 1px solid #E3D8D1;
      border-left: 3px solid #86685C;
      border-radius: 6px;
      background: #F9F5F1;
      page-break-inside: avoid;
    }
    .notice-eyebrow { color: #86685C; font-size: 7.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
    .notice-title { margin-top: 1px; font-size: 11px; font-weight: 700; }
    .notice-body { margin-top: 2px; color: #5A5550; font-size: 8.5px; line-height: 1.35; }
    .table-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin: 1px 0 4px; }
    h2 { margin: 0; font-size: 13px; line-height: 1.2; }
    .table-caption { color: #6F6A65; font-size: 8.5px; text-align: right; }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      padding: 4px 7px;
      margin-bottom: 5px;
      border: 1px solid #E7E2DE;
      border-radius: 5px;
      background: #FCFBFA;
      color: #5A5550;
      font-size: 7.7px;
    }
    .legend-item { display: inline-flex; align-items: center; white-space: nowrap; }
    .legend-swatch { display: inline-block; width: 11px; height: 7px; margin-right: 4px; border: 1px solid rgba(63,58,54,.18); border-radius: 2px; }
    .swatch-bleeding { background: #F3DFE6; }
    .swatch-mucus { background: #E8F0E5; }
    .swatch-peak { background: #DEDAD6; border-color: #4A4541; }
    .swatch-p-plus { background: #F7EDC2; }
    .swatch-missing { background: #F0EEEC; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 8.4px; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; break-inside: avoid; }
    th {
      padding: 5px 5px;
      color: #4A4541;
      background: #F1EEEB;
      border-bottom: 1px solid #D8D2CD;
      font-size: 7.6px;
      font-weight: 700;
      text-align: left;
      vertical-align: bottom;
    }
    .group-header th {
      padding-top: 4px;
      padding-bottom: 3px;
      color: #6F6A65;
      background: #E8E3DF;
      border-right: 1px solid #D5CECA;
      font-size: 6.8px;
      letter-spacing: .65px;
      text-transform: uppercase;
    }
    .group-header th:last-child { border-right: 0; }
    .group-interpretation { color: #72594F !important; background: #E9DFD8 !important; }
    td {
      height: 20px;
      padding: 3px 5px;
      border-bottom: 1px solid #E8E4E0;
      background: #FFFFFF;
      vertical-align: middle;
      overflow-wrap: anywhere;
    }
    .row-alternate td { background: #FBFAF8; }
    .row-bleeding td { background: #F6E7EC; }
    .row-mucus td { background: #EDF4EA; }
    .row-peak td { background: #E7E4E1; }
    .row-p-plus td { background: #FAF2CE; }
    .row-missing td { color: #77716C; background: #F3F1EF; }
    .row-bleeding td:first-child { box-shadow: inset 3px 0 #B77890; }
    .row-mucus td:first-child { box-shadow: inset 3px 0 #65815F; }
    .row-peak td:first-child { box-shadow: inset 3px 0 #4A4541; }
    .row-p-plus td:first-child { box-shadow: inset 3px 0 #C3A44B; }
    .row-missing td:first-child { box-shadow: inset 3px 0 #BBB5B0; }
    .row-peak-day td { border-top: 1.5px solid #4A4541; border-bottom: 1.5px solid #4A4541; }
    .cycle-day { padding-left: 8px; font-weight: 700; }
    .date-cell { font-weight: 600; }
    .cell-center { text-align: center; }
    .chart-value, .phase-value { font-weight: 650; }
    .status-value { color: #77716C; font-style: italic; }
    .multi-count { margin-top: 1px; color: #6F6A65; font-size: 6.8px; font-weight: 500; line-height: 1.2; }
    .intercourse { font-size: 10px; }
    .footer {
      margin-top: 10px;
      padding-top: 6px;
      border-top: 1px solid #E7E2DE;
      color: #A09A94;
      font-size: 7.5px;
      text-align: right;
    }
  </style>
</head>
<body>
  <header class="report-header">
    <div>
      <div class="brand">Well Within</div>
      <h1>Cycle ${cycle.cycleNumber}</h1>
    </div>
    <div class="subtitle">${headerSubtitle}</div>
  </header>

  ${observationOnly ? '' : `<div class="summary-grid">
    <div class="stat"><div class="stat-value">${cycle.length} days</div><div class="stat-label">Cycle length</div></div>
    <div class="stat"><div class="stat-value">${escapeHtml(peakDay)}</div><div class="stat-label">Peak marker</div></div>
  </div>`}

  <section class="notice">
    <div class="notice-eyebrow">Chart status</div>
    <div class="notice-title">${escapeHtml(noticeTitle)}</div>
    <div class="notice-body">${escapeHtml(noticeBody)}</div>
    ${noticeDetail ? `<div class="notice-body">${escapeHtml(noticeDetail)}</div>` : ''}
    ${possibleFertilePattern.limitation ? `<div class="notice-body">${escapeHtml(possibleFertilePattern.limitation)}</div>` : ''}
    ${observationOnly ? '<div class="notice-body">This export focuses on recorded observations and leaves out chart-based pattern boundaries.</div>' : ''}
  </section>

  <div class="table-heading">
    <h2>Day-by-day chart</h2>
    <div class="table-caption">One row per date. Multiple observations use the strongest mucus result.</div>
  </div>
  <div class="legend">${legendItems}</div>
  <table>
    <colgroup>${tableColumns}</colgroup>
    <thead>
      <tr class="group-header">
        <th colspan="2">Cycle day</th>
        <th colspan="${recordedColumnCount}">Recorded observations</th>
        ${interpretationGroup}
      </tr>
      <tr>
        <th>Day</th>
        <th>Date</th>
        <th>Bleeding</th>
        <th>Sensation</th>
        <th>Appearance</th>
        <th class="cell-center">Freq</th>
        ${interpretationHeaders}
        ${intercourseHeader}
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>

  <div class="footer">Generated by Well Within | ${escapeHtml(new Date().toLocaleDateString())}</div>
</body>
</html>`;
}
