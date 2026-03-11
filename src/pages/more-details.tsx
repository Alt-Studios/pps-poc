import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useCalculator } from '@/context/calculator-context'
import AllocationPieChart from '@/components/pie-chart'
import AllocationTiles from '@/components/allocation-tiles'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function MoreDetailsPage() {
  const { result, reset } = useCalculator()
  const navigate = useNavigate()

  function handleStartOver() {
    reset()
    navigate('/')
  }

  if (!result) return <Navigate to="/" replace />

  const age65Projection = result.projections[result.projections.length - 1]

  if (!age65Projection) return <Navigate to="/" replace />

  return (
    <div className="flex-1 bg-cream-light dark:bg-navy-dark">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <h1 className="mb-6 sm:mb-8 text-center text-xl sm:text-2xl font-normal uppercase tracking-[0.04em] text-navy dark:text-white">
          Profit-Share Breakdown at Age 65
        </h1>

        <Card className="mb-6 sm:mb-8 bg-white dark:bg-navy shadow-md dark:border-white/10">
          <CardContent className="p-2 sm:p-4 pt-2 sm:pt-4">
            <AllocationPieChart projection={age65Projection} />
          </CardContent>
        </Card>

        <div className="mb-6 sm:mb-8">
          <AllocationTiles projection={age65Projection} />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link to="/results" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 dark:text-white dark:border-white/20">
              &larr; Back to Results
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 dark:text-white dark:border-white/20">
              Edit Inputs
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-full px-6 dark:text-white dark:border-white/20"
            onClick={handleStartOver}
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  )
}
