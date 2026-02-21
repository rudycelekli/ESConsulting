import React from 'react';
import type { CaseStudyViewerProps } from '../schemas/case-study.schema';

export function CaseStudyViewer({ studies, contextNote }: CaseStudyViewerProps) {
  return (
    <div className="tambo-case-study">
      {contextNote && <p className="tambo-case-study__context">{contextNote}</p>}
      {studies?.map((study, i) => (
        <article key={i} className="tambo-card">
          <span className="tambo-card__category">{study.category}</span>
          <h4 className="tambo-card__title">{study.title}</h4>
          <p className="tambo-card__desc">{study.description}</p>
          {study.metrics && (
            <div className="tambo-card__metrics">
              {study.metrics.map((m, j) => (
                <div key={j} className="tambo-metric">
                  <span className="tambo-metric__value">{m.value}</span>
                  <span className="tambo-metric__label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
          {study.technologies && (
            <div className="tambo-card__tags">
              {study.technologies.map((t, j) => <span key={j} className="tambo-tag">{t}</span>)}
            </div>
          )}
          {study.duration && <span className="tambo-card__duration">{study.duration}</span>}
        </article>
      ))}
    </div>
  );
}
