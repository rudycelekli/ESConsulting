import React from 'react';
import type { TechStackDisplayProps } from '../schemas/tech-stack.schema';

const categoryLabels: Record<string, string> = {
  model: 'Models',
  framework: 'Frameworks',
  infrastructure: 'Infrastructure',
  database: 'Databases',
  monitoring: 'Monitoring',
  deployment: 'Deployment',
  security: 'Security',
  'data-pipeline': 'Data Pipeline',
};

export function TechStackDisplay({ useCase, technologies, architectureNote }: TechStackDisplayProps) {
  const grouped = technologies?.reduce((acc, tech) => {
    const cat = tech.category || 'framework';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <div className="tambo-tech-stack">
      <div className="tambo-tech-stack__header">
        <h4>Recommended Stack</h4>
        <p className="tambo-card__desc">{useCase}</p>
      </div>
      {grouped && Object.entries(grouped).map(([category, techs]) => (
        <div key={category} className="tambo-tech-stack__category">
          <span className="tambo-tech-stack__category-label">{categoryLabels[category] || category}</span>
          {techs.map((tech, i) => (
            <div key={i} className="tambo-tech-stack__item">
              <strong>{tech.name}</strong>
              <p>{tech.rationale}</p>
              {tech.alternatives && tech.alternatives.length > 0 && (
                <span className="tambo-tech-stack__alts">Alt: {tech.alternatives.join(', ')}</span>
              )}
            </div>
          ))}
        </div>
      ))}
      {architectureNote && <p className="tambo-tech-stack__note">{architectureNote}</p>}
    </div>
  );
}
