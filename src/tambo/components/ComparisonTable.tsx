import React from 'react';
import type { ComparisonTableProps } from '../schemas/comparison.schema';

export function ComparisonTable({ title, rowLabels, columns, note }: ComparisonTableProps) {
  if (!columns || columns.length === 0) return null;

  return (
    <div className="tambo-comparison">
      <h4 className="tambo-comparison__title">{title}</h4>
      <div className="tambo-comparison__scroll">
        <table className="tambo-comparison__table">
          <thead>
            <tr>
              <th className="tambo-comparison__corner" />
              {columns.map((col, i) => (
                <th key={i} className={`tambo-comparison__col-header ${col.highlighted ? 'tambo-comparison__col-header--hl' : ''}`}>
                  <span>{col.header}</span>
                  {col.subheader && <small>{col.subheader}</small>}
                  {col.highlighted && <span className="tambo-comparison__badge">Recommended</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels?.map((label, ri) => (
              <tr key={ri}>
                <td className="tambo-comparison__row-label">{label}</td>
                {columns.map((col, ci) => {
                  const val = col.values?.[ri] || '-';
                  const isCheck = val === 'true' || val === 'yes' || val === 'Yes';
                  const isCross = val === 'false' || val === 'no' || val === 'No';
                  return (
                    <td key={ci} className={`tambo-comparison__cell ${col.highlighted ? 'tambo-comparison__cell--hl' : ''}`}>
                      {isCheck ? (
                        <svg className="tambo-comparison__icon tambo-comparison__icon--check" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      ) : isCross ? (
                        <svg className="tambo-comparison__icon tambo-comparison__icon--cross" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      ) : (
                        val
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="tambo-comparison__note">{note}</p>}
    </div>
  );
}
