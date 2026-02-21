import React from 'react';
import type { StatsDashboardProps } from '../schemas/stats-dashboard.schema';

export function StatsDashboard({ title, stats, subtitle, note }: StatsDashboardProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="tambo-stats">
      <div className="tambo-stats__header">
        <h4>{title}</h4>
        {subtitle && <p className="tambo-card__desc">{subtitle}</p>}
      </div>
      <div className="tambo-stats__grid">
        {stats.map((s, i) => (
          <div key={i} className="tambo-stats__card">
            <span className="tambo-stats__label">{s.label}</span>
            <div className="tambo-stats__value-row">
              <span className="tambo-stats__value">{s.value}</span>
              {s.change && (
                <span className={`tambo-stats__change tambo-stats__change--${s.trend || 'neutral'}`}>
                  {s.trend === 'up' && (
                    <svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 7H2L6 2Z" /></svg>
                  )}
                  {s.trend === 'down' && (
                    <svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L2 5H10L6 10Z" /></svg>
                  )}
                  {s.change}
                </span>
              )}
            </div>
            {s.description && <span className="tambo-stats__desc">{s.description}</span>}
          </div>
        ))}
      </div>
      {note && <p className="tambo-stats__note">{note}</p>}
    </div>
  );
}
