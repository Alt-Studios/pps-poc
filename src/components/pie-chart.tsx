import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'

interface PieChartProps {
  projection: Projection
}

const CATEGORIES = [
  { key: 'life' as const, color: '#b09555', label: 'Life Allocation' },
  { key: 'sti' as const, color: '#82967f', label: 'Car & Home Allocation' },
  { key: 'profmed' as const, color: '#a8605f', label: 'Medical Aid Allocation' },
  { key: 'investment' as const, color: '#604760', label: 'Investment Allocation' },
  { key: 'chb' as const, color: '#69c5d1', label: 'Cross-Holdings Booster' },
]

const RADIAN = Math.PI / 180

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 1.4
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN)
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#091e35"
      textAnchor={x > (cx as number) ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${((percent as number) * 100).toFixed(1)}%`}
    </text>
  )
}

export default function AllocationPieChart({ projection }: PieChartProps) {
  const data = CATEGORIES
    .filter((cat) => projection[cat.key] > 0)
    .map((cat) => ({
      name: cat.label,
      value: projection[cat.key],
      color: cat.color,
    }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          dataKey="value"
          label={renderLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
