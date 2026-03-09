import { Navigate, Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { useCalculator } from '@/context/calculator-context'
import { InputSummary } from '@/components/input-summary'
import { useConfetti } from '@/components/confetti'
import ResultsChart from '@/components/results-chart'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ResultsPage() {
  const { result, inputs } = useCalculator()
  const fireConfetti = useConfetti()

  if (!result) return <Navigate to="/" replace />

  const headlineValue =
    result.additionalProfitShare > 0
      ? result.additionalProfitShare
      : (result.projections.find((p) => p.anb === 65)?.life ?? 0)

  return (
    <div className="min-h-screen bg-cream-light dark:bg-navy-dark">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-gold">
            Your projected additional
          </p>
          <p className="my-2 text-5xl font-normal tracking-[0.02em] text-navy dark:text-white">
            +{' '}
            <CountUp
              prefix="R"
              end={headlineValue}
              duration={2}
              separator=" "
              onEnd={fireConfetti}
            />
          </p>
          <p className="text-base tracking-[0.04em] text-muted-text dark:text-white/60">
            Profit-Share by your 65th birthday!
          </p>
        </div>

        {inputs && <InputSummary inputs={inputs} />}

        <Card className="mb-8 bg-white dark:bg-navy shadow-md dark:border-white/10">
          <CardContent className="pt-4">
            <ResultsChart projections={result.projections} />
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link to="/more-details">
            <Button className="rounded-full bg-gold px-6 text-white hover:bg-gold/80">
              More Details &rarr;
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="rounded-full px-6 dark:text-white dark:border-white/20">
              Recalculate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
