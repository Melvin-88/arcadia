import React from 'react';
import { IPieChartItems } from '../types';
import './LegendChart.scss';

interface ILegendChartProps {
  data: IPieChartItems
}

export const LegendChart: React.FC<ILegendChartProps> = ({ data }) => (
  <div className="legend-chart">
    {data.map(({ name, value, color }) => (
      <div key={name + value + color} className="legend-chart__item">
        {value}
        &nbsp;-&nbsp;
        {name}
        <div className="legend-chart__marker" style={{ background: color }} />
      </div>
    ))}
  </div>
);
