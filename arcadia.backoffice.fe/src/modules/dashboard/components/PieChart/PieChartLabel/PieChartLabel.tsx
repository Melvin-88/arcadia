import React from 'react';
import { PieLabelRenderProps } from 'recharts';

interface IPieChartLabelProps extends PieLabelRenderProps {
}

export const PieChartLabel: React.FC<IPieChartLabelProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}) => {
  if (
    !cx
      || !cy
      || !midAngle
      || !innerRadius
      || !outerRadius
      || !percent
      || !value
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN) + 10;
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
  const labelMessage = `${value} - ${(percent * 100).toFixed(0)}%`;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {labelMessage}
    </text>
  );
};
