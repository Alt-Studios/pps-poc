import type { Projection } from '@/lib/types'
import { formatCurrency } from '@/lib/format-number'
import { Card, CardContent } from '@/components/ui/card'

interface AllocationTilesProps {
  projection: Projection
}

const CATEGORIES = [
  { key: 'life' as const, color: '#b09455', label: 'Life Allocation' },
  { key: 'sti' as const, color: '#82967f', label: 'Car & Home Allocation' },
  { key: 'profmed' as const, color: '#a8605f', label: 'Medical Aid Allocation' },
  { key: 'investment' as const, color: '#604760', label: 'Investment Allocation' },
  { key: 'chb' as const, color: '#69c5d1', label: 'Cross-Holdings Booster' },
]

export default function AllocationTiles({ projection }: AllocationTilesProps) {
  const total = CATEGORIES.reduce((sum, cat) => sum + projection[cat.key], 0)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {CATEGORIES.map((cat) => (
        <Card
          key={cat.key}
          className={`border-t-4 ${projection[cat.key] <= 0 ? 'opacity-40' : ''}`}
          style={{ borderTopColor: cat.color }}
        >
          <CardContent>
            <p className="text-xs font-medium uppercase tracking-wider text-[#091e35]/60">
              {cat.label}
            </p>
            <p className="mt-1 text-xl font-bold text-[#091e35]">
              {formatCurrency(projection[cat.key])}
            </p>
          </CardContent>
        </Card>
      ))}
      <Card
        className="border-t-4 bg-[#091e35]/5"
        style={{ borderTopColor: '#091e35' }}
      >
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wider text-[#091e35]/60">
            Total
          </p>
          <p className="mt-1 text-xl font-bold text-[#091e35]">
            {formatCurrency(total)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
