declare module 'chart.js' {
  export const Chart: any;
  export const CategoryScale: any;
  export const LinearScale: any;
  export const PointElement: any;
  export const LineElement: any;
  export const BarElement: any;
  export const ArcElement: any;
  export const Title: any;
  export const Tooltip: any;
  export const Legend: any;
  export const Filler: any;
  
  export interface ChartData<T extends any = any> {
    labels?: any[];
    datasets: any[];
  }
  
  export interface ChartOptions<T extends any = any> {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      legend?: {
        position?: 'top' | 'bottom' | 'left' | 'right';
        labels?: {
          color?: string;
        };
      };
      title?: {
        display?: boolean;
        text?: string;
        color?: string;
      };
      tooltip?: {
        backgroundColor?: string;
        titleColor?: string;
        bodyColor?: string;
        borderColor?: string;
        borderWidth?: number;
      };
    };
    scales?: {
      x?: {
        title?: {
          display?: boolean;
          text?: string;
          color?: string;
        };
        ticks?: {
          color?: string;
        };
        grid?: {
          color?: string;
        };
      };
      y?: {
        title?: {
          display?: boolean;
          text?: string;
          color?: string;
        };
        ticks?: {
          color?: string;
        };
        grid?: {
          color?: string;
        };
      };
    };
  }
}

declare module 'react-chartjs-2' {
  import { ChartData, ChartOptions } from 'chart.js';
  import * as React from 'react';
  
  export interface ChartComponentProps {
    data: ChartData;
    options?: ChartOptions;
    height?: number;
    width?: number;
  }
  
  export class Line extends React.Component<ChartComponentProps> {}
  export class Bar extends React.Component<ChartComponentProps> {}
  export class Pie extends React.Component<ChartComponentProps> {}
  export class Doughnut extends React.Component<ChartComponentProps> {}
} 