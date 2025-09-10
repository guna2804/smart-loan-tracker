"use client"

import * as React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

import { cn } from "@/lib/utils"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
}



const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs",
        className
      )}
      {...props}
    >
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    data: Array<{ month: string; repayments: number }>
    config: ChartConfig
  }
>(({ data, ...props }, ref) => {
  if (!data || data.length === 0) {
    return (
      <div ref={ref} {...props}>
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-lg font-medium">No repayment data</p>
          <p className="text-sm">Monthly repayment data will appear here once available</p>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [{
      label: 'Repayments',
      data: data.map(item => item.repayments),
      backgroundColor: '#3b82f6',
      borderColor: '#ffffff',
      borderWidth: 1,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  }

  return (
    <div ref={ref} {...props}>
      <Bar data={chartData} options={options} />
    </div>
  )
})
ChartBar.displayName = "ChartBar"

const ChartPie = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    data: Array<{ id: string; label: string; value: number; color: string }>
    config: ChartConfig
  }
>(({ data, ...props }, ref) => {
  if (!data || data.length === 0) {
    return (
      <div ref={ref} {...props}>
        <div className="flex items-center justify-center h-full text-gray-500">
          <p className="text-lg font-medium">No loan data</p>
          <p className="text-sm">Loan status distribution will appear here once loans are added</p>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: data.map(item => item.color || '#3b82f6'),
      borderColor: '#ffffff',
      borderWidth: 1,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  }

  return (
    <div ref={ref} {...props}>
      <Pie data={chartData} options={options} />
    </div>
  )
})
ChartPie.displayName = "ChartPie"

export {
  ChartContainer,
  ChartBar,
  ChartPie,
}
