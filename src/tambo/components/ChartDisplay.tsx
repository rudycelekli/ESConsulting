import React from 'react';
import type { ChartDisplayProps } from '../schemas/chart.schema';

const PALETTE = ['#C8A45C', '#5B8DEF', '#22c55e', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1', '#EF4444', '#06B6D4', '#84CC16'];

function fmt(v: number, prefix?: string, suffix?: string) {
  const num = v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(1)}K` : String(v);
  return `${prefix || ''}${num}${suffix || ''}`;
}

function BarChart({ data, valuePrefix, valueSuffix }: Pick<ChartDisplayProps, 'data' | 'valuePrefix' | 'valueSuffix'>) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="tambo-chart__bars">
      {data.map((d, i) => {
        const pct = max > 0 ? (d.value / max) * 100 : 0;
        const color = d.color || PALETTE[i % PALETTE.length];
        return (
          <div key={i} className="tambo-chart__bar-row">
            <span className="tambo-chart__bar-label">{d.label}</span>
            <div className="tambo-chart__bar-track">
              <div className="tambo-chart__bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="tambo-chart__bar-value">{fmt(d.value, valuePrefix, valueSuffix)}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, valuePrefix, valueSuffix }: Pick<ChartDisplayProps, 'data' | 'valuePrefix' | 'valueSuffix'>) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 360;
  const h = 160;
  const pad = { t: 10, r: 10, b: 30, l: 10 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;

  const points = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * plotW,
    y: pad.t + plotH - ((d.value - min) / range) * plotH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.t + plotH} L${points[0].x},${pad.t + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="tambo-chart__svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A45C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C8A45C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lineGrad)" />
      <path d={linePath} fill="none" stroke="#C8A45C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0A0F1C" stroke="#C8A45C" strokeWidth="2" />
          <text x={p.x} y={pad.t + plotH + 16} textAnchor="middle" className="tambo-chart__axis-label">{p.label}</text>
          <text x={p.x} y={p.y - 10} textAnchor="middle" className="tambo-chart__point-label">{fmt(p.value, valuePrefix, valueSuffix)}</text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ data, valuePrefix, valueSuffix, donut }: Pick<ChartDisplayProps, 'data' | 'valuePrefix' | 'valueSuffix'> & { donut?: boolean }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 100;
  const cy = 100;
  const r = 80;
  const ir = donut ? 50 : 0;
  let cumAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = total > 0 ? (d.value / total) * 2 * Math.PI : 0;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const largeArc = angle > Math.PI ? 1 : 0;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    let path: string;
    if (ir > 0) {
      const ix1 = cx + ir * Math.cos(startAngle);
      const iy1 = cy + ir * Math.sin(startAngle);
      const ix2 = cx + ir * Math.cos(endAngle);
      const iy2 = cy + ir * Math.sin(endAngle);
      path = `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${largeArc} 0 ${ix1},${iy1} Z`;
    } else {
      path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    }

    const midAngle = startAngle + angle / 2;
    const labelR = donut ? (r + ir) / 2 : r * 0.6;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    const color = d.color || PALETTE[i % PALETTE.length];
    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;

    return { path, lx, ly, color, pct, ...d, i };
  });

  return (
    <div className="tambo-chart__pie-wrap">
      <svg viewBox="0 0 200 200" className="tambo-chart__svg tambo-chart__svg--pie" preserveAspectRatio="xMidYMid meet">
        {slices.map((s) => (
          <path key={s.i} d={s.path} fill={s.color} stroke="rgba(10,15,28,0.9)" strokeWidth="1.5" />
        ))}
        {donut && (
          <text x={cx} y={cy + 4} textAnchor="middle" className="tambo-chart__donut-center">
            {fmt(total, valuePrefix, valueSuffix)}
          </text>
        )}
      </svg>
      <div className="tambo-chart__legend">
        {slices.map((s) => (
          <div key={s.i} className="tambo-chart__legend-item">
            <span className="tambo-chart__legend-dot" style={{ background: s.color }} />
            <span className="tambo-chart__legend-label">{s.label}</span>
            <span className="tambo-chart__legend-value">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartDisplay({ chartType, title, data, subtitle, valuePrefix, valueSuffix, note }: ChartDisplayProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="tambo-chart">
      <div className="tambo-chart__header">
        <h4>{title}</h4>
        {subtitle && <p className="tambo-card__desc">{subtitle}</p>}
      </div>
      <div className="tambo-chart__body">
        {(chartType === 'bar' || chartType === 'horizontal-bar') && (
          <BarChart data={data} valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
        )}
        {chartType === 'line' && (
          <LineChart data={data} valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
        )}
        {chartType === 'pie' && (
          <PieChart data={data} valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
        )}
        {chartType === 'donut' && (
          <PieChart data={data} valuePrefix={valuePrefix} valueSuffix={valueSuffix} donut />
        )}
      </div>
      {note && <p className="tambo-chart__note">{note}</p>}
    </div>
  );
}
