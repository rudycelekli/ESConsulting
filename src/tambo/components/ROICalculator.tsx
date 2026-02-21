import React from 'react';
import type { ROICalculatorProps } from '../schemas/roi-calculator.schema';

export function ROICalculator({ projectType, estimatedInvestment, projectedSavings, assumptions, disclaimer }: ROICalculatorProps) {
  const formatUSD = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="tambo-roi">
      <div className="tambo-roi__header">
        <span className="tambo-tag">{projectType?.replace(/-/g, ' ')}</span>
        <h4>ROI Estimate</h4>
      </div>

      <div className="tambo-roi__grid">
        <div className="tambo-roi__metric">
          <span className="tambo-metric__label">Investment Range</span>
          <span className="tambo-metric__value">
            {estimatedInvestment ? `${formatUSD(estimatedInvestment.low)} - ${formatUSD(estimatedInvestment.high)}` : '...'}
          </span>
        </div>
        <div className="tambo-roi__metric">
          <span className="tambo-metric__label">Projected Annual Impact</span>
          <span className="tambo-metric__value tambo-metric__value--accent">
            {projectedSavings ? formatUSD(projectedSavings.annual) : '...'}
          </span>
        </div>
        <div className="tambo-roi__metric">
          <span className="tambo-metric__label">Time to Value</span>
          <span className="tambo-metric__value">{projectedSavings?.timeToValue || '...'}</span>
        </div>
      </div>

      {assumptions && (
        <div className="tambo-roi__assumptions">
          <strong>Assumptions:</strong>
          <ul>{assumptions.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>
      )}

      {disclaimer && <p className="tambo-roi__disclaimer">{disclaimer}</p>}
    </div>
  );
}
