import { Navigate, Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { useCalculator } from '@/context/calculator-context'
import { useConfetti } from '@/components/confetti'
import ResultsChart from '@/components/results-chart'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ResultsPage() {
  const { result } = useCalculator()
  const fireConfetti = useConfetti()

  if (!result) return <Navigate to="/" replace />

  const headlineValue =
    result.additionalProfitShare > 0
      ? result.additionalProfitShare
      : (result.projections.find((p) => p.anb === 65)?.life ?? 0)

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-wider text-[#091e35]/60">
            Your projected additional
          </p>
          <p className="my-2 text-5xl font-bold text-[#b09455]">
            +{' '}
            <CountUp
              prefix="R"
              end={headlineValue}
              duration={2}
              separator=" "
              onEnd={fireConfetti}
            />
          </p>
          <p className="text-lg text-[#091e35]">
            Profit-Share by your 65th birthday!
          </p>
        </div>

        <Card className="mb-8 bg-white shadow-md">
          <CardContent className="pt-4">
            <ResultsChart projections={result.projections} />
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link to="/more-details">
            <Button className="rounded-full bg-[#b09455] px-6 text-white hover:bg-[#b09455]/80">
              More Details &rarr;
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
