import React from 'react';
import classNames from 'classnames';
import { Spinner } from 'arcadia-common-fe';
import {
  LineChart as LineChartBase, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { IDataKeys, ILineChartItems } from './type';
import './LineChart.scss';

interface ILineChartProps {
  className?: string
  classNameChart?: string
  title: string
  isLoading: boolean
  data: ILineChartItems
  dataKeys: IDataKeys
}

export const LineChart: React.FC<ILineChartProps> = ({
  className,
  classNameChart,
  title,
  isLoading,
  data,
  dataKeys,
}) => (
  <div className={classNames('line-chart', className)}>
    {
      isLoading ? (
        <Spinner className="line-chart__spinner" />
      ) : (
        <>
          <div className="line-chart__chart-title">{title}</div>
          <div className={classNames('line-chart__chart', classNameChart)}>
            <ResponsiveContainer>
              <LineChartBase
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                  dataKeys.map(({ key, color }) => (
                    <Line
                      key={key + color}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      activeDot={{ r: 2 }}
                    />
                  ))
                }
              </LineChartBase>
            </ResponsiveContainer>
          </div>
        </>
      )
    }
  </div>
);
