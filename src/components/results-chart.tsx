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

interface ResultsChartProps {
  projections: Projection[]
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value}`
}

export default function ResultsChart({ projections }: ResultsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={projections}>
        <XAxis
          dataKey="anb"
          label={{ value: 'AGE', position: 'insideBottom', offset: -5 }}
        />
        <YAxis
          tickFormatter={formatAxis}
          label={{ value: 'RANDS', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => `Age ${label}`}
        />
        <Legend />
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
