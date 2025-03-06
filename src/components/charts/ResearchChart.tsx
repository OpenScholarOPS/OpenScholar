import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { cn } from '@/utils/cn';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Color themes
const colors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  neutral: '#6b7280',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  dark: {
    background: '#1f2937',
    surface: '#374151',
    text: '#f3f4f6'
  },
  light: {
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827'
  }
};

// Check if dark mode is enabled
const isDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Dataset interface to define chart data structure
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

// Interface for chart data
interface ChartDataProps {
  labels: string[];
  datasets: ChartDataset[];
}

// Common chart props
interface ChartProps {
  data: ChartDataProps;
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  height?: number;
  className?: string;
}

// Research Trend Chart (Line)
export const ResearchTrendChart: React.FC<ChartProps> = ({
  data,
  title = 'Research Trends',
  xAxisTitle = 'Time Period',
  yAxisTitle = 'Count',
  height = 350,
  className = ''
}) => {
  const dark = isDarkMode();
  
  const chartData: ChartData<'line'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || Object.values(colors)[index % 7],
      backgroundColor: dataset.backgroundColor || `${Object.values(colors)[index % 7]}33`
    }))
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: dark ? colors.dark.text : colors.light.text
        }
      },
      title: {
        display: !!title,
        text: title || '',
        color: dark ? colors.dark.text : colors.light.text
      },
      tooltip: {
        backgroundColor: dark ? colors.dark.surface : colors.light.surface,
        titleColor: dark ? colors.dark.text : colors.light.text,
        bodyColor: dark ? colors.dark.text : colors.light.text,
        borderColor: dark ? colors.neutral : '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle || '',
          color: dark ? colors.dark.text : colors.light.text
        },
        ticks: {
          color: dark ? colors.dark.text : colors.light.text
        },
        grid: {
          color: dark ? `${colors.dark.text}22` : `${colors.light.text}22`
        }
      },
      y: {
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle || '',
          color: dark ? colors.dark.text : colors.light.text
        },
        ticks: {
          color: dark ? colors.dark.text : colors.light.text
        },
        grid: {
          color: dark ? `${colors.dark.text}22` : `${colors.light.text}22`
        }
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// Research Comparison Chart (Bar)
export const ResearchComparisonChart: React.FC<ChartProps> = ({
  data,
  title = 'Research Comparison',
  xAxisTitle = 'Categories',
  yAxisTitle = 'Count',
  height = 350,
  className = ''
}) => {
  const dark = isDarkMode();
  
  const chartData: ChartData<'bar'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || Object.values(colors)[index % 7]
    }))
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: dark ? colors.dark.text : colors.light.text
        }
      },
      title: {
        display: !!title,
        text: title || '',
        color: dark ? colors.dark.text : colors.light.text
      },
      tooltip: {
        backgroundColor: dark ? colors.dark.surface : colors.light.surface,
        titleColor: dark ? colors.dark.text : colors.light.text,
        bodyColor: dark ? colors.dark.text : colors.light.text,
        borderColor: dark ? colors.neutral : '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle || '',
          color: dark ? colors.dark.text : colors.light.text
        },
        ticks: {
          color: dark ? colors.dark.text : colors.light.text
        },
        grid: {
          color: dark ? `${colors.dark.text}22` : `${colors.light.text}22`
        }
      },
      y: {
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle || '',
          color: dark ? colors.dark.text : colors.light.text
        },
        ticks: {
          color: dark ? colors.dark.text : colors.light.text
        },
        grid: {
          color: dark ? `${colors.dark.text}22` : `${colors.light.text}22`
        }
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div style={{ height }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// Research Distribution Chart (Pie)
export const ResearchDistributionChart: React.FC<ChartProps> = ({
  data,
  title = 'Research Distribution',
  height = 350,
  className = ''
}) => {
  const dark = isDarkMode();
  
  const chartData: ChartData<'pie'> = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 
        Object.values(colors).slice(0, 7).map((color) => typeof color === 'string' ? color : '#000000')
    }))
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: dark ? colors.dark.text : colors.light.text
        }
      },
      title: {
        display: !!title,
        text: title || '',
        color: dark ? colors.dark.text : colors.light.text
      },
      tooltip: {
        backgroundColor: dark ? colors.dark.surface : colors.light.surface,
        titleColor: dark ? colors.dark.text : colors.light.text,
        bodyColor: dark ? colors.dark.text : colors.light.text,
        borderColor: dark ? colors.neutral : '#e5e7eb',
        borderWidth: 1
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div style={{ height }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

// Export predefined color scheme for convenience
export { colors }; 