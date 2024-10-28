import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart,
} from 'recharts';
import { theme } from '../../lib/theme';

interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  height?: number;
  showGrid?: boolean;
  colors?: {
    bar?: string;
    line?: string;
    area?: string;
    grid?: string;
    text?: string;
  };
}

const defaultColors = {
  bar: '#3B82F6',
  line: '#3B82F6',
  area: '#3B82F6',
  grid: '#334155',
  text: '#94A3B8',
};

export const BarChart: React.FC<ChartProps> = ({ 
  data, 
  height = 300, 
  showGrid = true,
  colors = defaultColors 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
        <XAxis 
          dataKey="name" 
          stroke={colors.text}
          fontSize={12}
        />
        <YAxis 
          stroke={colors.text}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
          }}
          labelStyle={{ color: theme.colors.text.primary }}
          itemStyle={{ color: theme.colors.text.secondary }}
        />
        <Bar 
          dataKey="value" 
          fill={colors.bar}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart: React.FC<ChartProps> = ({ 
  data, 
  height = 300,
  showGrid = true,
  colors = defaultColors 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
        <XAxis 
          dataKey="name" 
          stroke={colors.text}
          fontSize={12}
        />
        <YAxis 
          stroke={colors.text}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
          }}
          labelStyle={{ color: theme.colors.text.primary }}
          itemStyle={{ color: theme.colors.text.secondary }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={colors.line}
          strokeWidth={2}
          dot={{ fill: colors.line }}
          activeDot={{ r: 6, fill: colors.line }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const AreaChart: React.FC<ChartProps> = ({ 
  data, 
  height = 300,
  showGrid = true,
  colors = defaultColors 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
        <XAxis 
          dataKey="name" 
          stroke={colors.text}
          fontSize={12}
        />
        <YAxis 
          stroke={colors.text}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
          }}
          labelStyle={{ color: theme.colors.text.primary }}
          itemStyle={{ color: theme.colors.text.secondary }}
        />
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.area} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={colors.area} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.area}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
