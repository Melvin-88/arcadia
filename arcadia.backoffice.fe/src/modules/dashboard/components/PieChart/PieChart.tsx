import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Spinner } from 'arcadia-common-fe';
import {
  Cell, Pie, PieChart as PieChartBase, ResponsiveContainer,
} from 'recharts';
import { PieChartLabel } from './PieChartLabel/PieChartLabel';
import { LegendChart } from './LegendChart/LegendChart';
import { IPieChartItems } from './types';
import './PieChart.scss';

interface IPieChartProps {
  className?: string
  title: string
  isLoading: boolean
  data: IPieChartItems
  footerContent?: ReactNode
}

export const PieChart: React.FC<IPieChartProps> = ({
  className,
  title,
  isLoading,
  data,
  footerContent,
}) => (
  <div className={classNames('pie-chart', className)}>
    {
      isLoading ? (
        <Spinner className="pie-chart__spinner" />
      ) : (
        <>
          <div className="pie-chart__chart-title">{title}</div>
          <div className="pie-chart__pie-chart">
            <ResponsiveContainer>
              <PieChartBase className="pie-chart__pie-chart">
                <Pie
                  data={data}
                  labelLine={false}
                  label={PieChartLabel}
                  dataKey="value"
                >
                  {
                    data.map(({ value, color }, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Cell key={`cell-${index}${value}`} fill={color} />
                    ))
                  }
                </Pie>
              </PieChartBase>
            </ResponsiveContainer>
          </div>
          <LegendChart data={data} />
          {footerContent}
        </>
      )
    }
  </div>
);
