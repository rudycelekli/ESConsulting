import React from 'react';
import type { ServiceCardProps } from '../schemas/service-card.schema';

export function ServiceCard({ services, introText }: ServiceCardProps) {
  return (
    <div className="tambo-service-card">
      {introText && <p className="tambo-service-card__intro">{introText}</p>}
      <div className="tambo-service-card__grid">
        {services?.map((service, i) => (
          <article key={service.id || i} className="tambo-card">
            <h4 className="tambo-card__title">{service.title}</h4>
            <p className="tambo-card__desc">{service.description}</p>
            {service.deliverables && (
              <ul className="tambo-card__list">
                {service.deliverables.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
            {service.tags && (
              <div className="tambo-card__tags">
                {service.tags.map((tag, j) => (
                  <span key={j} className="tambo-tag">{tag}</span>
                ))}
              </div>
            )}
            {service.relevanceNote && (
              <p className="tambo-card__relevance">{service.relevanceNote}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
