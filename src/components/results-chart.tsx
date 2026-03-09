import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'
import { useTheme } from '@/context/theme-context'

interface ResultsChartProps {
  projections: Projection[]
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value}`
}

export default function ResultsChart({ projections }: ResultsChartProps) {
  const { theme } = useTheme()
  const axisColor = theme === 'dark' ? '#ffffff' : '#091e35'

  return (
    <ResponsiveContainer width="100%" height={300} minHeight={250}>
      <BarChart data={projections} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="anb"
          tick={{ fill: axisColor, fontSize: 11 }}
          label={{ value: 'AGE', position: 'insideBottom', offset: -5, fill: axisColor, fontSize: 11 }}
        />
        <YAxis
          tickFormatter={formatAxis}
          tick={{ fill: axisColor, fontSize: 11 }}
          label={{ value: 'RANDS', angle: -90, position: 'insideLeft', fill: axisColor, fontSize: 11 }}
          width={45}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => `Age ${label}`}
          cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#091e35' : '#ffffff',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#cacaca',
            color: theme === 'dark' ? '#ffffff' : '#091e35',
          }}
          labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#091e35' }}
          itemStyle={{ color: theme === 'dark' ? '#ffffff' : '#091e35' }}
        />
        <Legend wrapperStyle={{ color: axisColor, paddingTop: 16, fontSize: 11 }} />
        <Bar
          dataKey="life"
          stackId="a"
          fill="#b09555"
          name="Profit-Share (Life Product Only)"
        />
        <Bar
          dataKey="chbEffect"
          stackId="a"
          fill="#69c5d1"
          name="Cross-Holdings Booster & Additional Products"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
