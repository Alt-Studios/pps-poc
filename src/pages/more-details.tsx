import { Navigate, Link } from 'react-router-dom'
import { useCalculator } from '@/context/calculator-context'
import AllocationPieChart from '@/components/pie-chart'
import AllocationTiles from '@/components/allocation-tiles'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MoreDetailsPage() {
  const { result } = useCalculator()

  if (!result) return <Navigate to="/" replace />

  const age65Projection = result.projections[result.projections.length - 1]

  if (!age65Projection) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-cream-light">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-normal uppercase tracking-[0.04em] text-navy">
          Profit-Share Breakdown at Age 65
        </h1>

        <Card className="mb-8 bg-white shadow-md">
          <CardContent className="pt-4">
            <AllocationPieChart projection={age65Projection} />
          </CardContent>
        </Card>

        <div className="mb-8">
          <AllocationTiles projection={age65Projection} />
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/results">
            <Button variant="outline" className="rounded-full px-6">
              &larr; Back to Results
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="rounded-full px-6">
              Recalculate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
