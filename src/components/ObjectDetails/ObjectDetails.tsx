import { useState, useEffect } from 'react';
import { Checkbox } from '@alphacore/ui-kit';

import type { ApiTreeNode } from '../../types';
import './ObjectDetails.css';

interface ObjectDetailsProps {
  node: ApiTreeNode | null;
}

export default function ObjectDetails({ node }: ObjectDetailsProps) {
  const [checkedRelations, setCheckedRelations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedRelations({});
  }, [node?.id]);

  const toggleRelation = (key: string) => {
    setCheckedRelations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!node) {
    return (
      <div className="object-details">
        <div className="details-empty">Выберите объект в дереве</div>
      </div>
    );
  }

  return (
    <div className="object-details">
      <div className="details-section">
        <h3 className="details-section-title">Описание</h3>
        <div className="details-description-box">
          {node.description || 'Нет описания'}
        </div>
      </div>

      {node.properties && node.properties.length > 0 && (
        <div className="details-section">
          <h3 className="details-section-title">Свойства</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Значение по умолчанию</th>
                <th>Единица измерения</th>
              </tr>
            </thead>
            <tbody>
              {node.properties.map((prop, i) => (
                <tr key={i}>
                  <td>{prop.name}</td>
                  <td>{prop.value}</td>
                  <td>{prop.measure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {node.relations && node.relations.length > 0 && (
        <div className="details-section">
          <h3 className="details-section-title">Связи</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th className="relation-header-cell">
                  <Checkbox checked={false} />
                  <span>Название класса</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {node.relations.map((rel, i) => {
                const key = `${node.id}-${i}`;
                return (
                  <tr key={i} className="relation-row" onClick={() => toggleRelation(key)}>
                    <td className="relation-cell">
                      <Checkbox
                        checked={!!checkedRelations[key]}
                        onChange={() => toggleRelation(key)}
                      />
                      <span>{rel.name}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
