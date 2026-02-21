import React from 'react';
import type { TimelineEstimatorProps } from '../schemas/timeline.schema';

export function TimelineEstimator({ projectName, totalDuration, phases, note }: TimelineEstimatorProps) {
  return (
    <div className="tambo-timeline">
      <div className="tambo-timeline__header">
        <h4>{projectName}</h4>
        <span className="tambo-tag">{totalDuration}</span>
      </div>
      <div className="tambo-timeline__phases">
        {phases?.map((phase, i) => (
          <div key={i} className={`tambo-timeline__phase ${phase.isCurrent ? 'tambo-timeline__phase--active' : ''}`}>
            <div className="tambo-timeline__connector">
              <div className="tambo-timeline__dot" />
              {i < (phases?.length ?? 0) - 1 && <div className="tambo-timeline__line" />}
            </div>
            <div className="tambo-timeline__content">
              <div className="tambo-timeline__phase-header">
                <strong>{phase.name}</strong>
                <span className="tambo-timeline__duration">{phase.duration}</span>
              </div>
              <p>{phase.description}</p>
              {phase.deliverables && (
                <ul className="tambo-card__list">
                  {phase.deliverables.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      {note && <p className="tambo-timeline__note">{note}</p>}
    </div>
  );
}
