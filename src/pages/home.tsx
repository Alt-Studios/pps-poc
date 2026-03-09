import { CalculatorForm } from '@/components/calculator-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-light dark:bg-navy-dark flex items-center justify-center p-3 sm:p-4">
      <ThemeToggle />
      <div className="w-full max-w-lg">
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-br from-navy via-navy to-navy-dark px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 rounded-full bg-gold/10 blur-2xl" />
            <div className="flex items-center justify-center gap-3">
              <img src="/pps-logo-white.svg" alt="PPS" className="h-5 sm:h-6 w-auto opacity-80" />
              <div className="h-4 w-px bg-white/20" />
              <h1 className="text-white text-[10px] sm:text-xs font-normal uppercase tracking-[0.12em]">
                Profit-Share Projection
              </h1>
            </div>
          </div>
          {/* Body */}
          <div className="bg-white dark:bg-navy/95 px-4 sm:px-6 py-5 sm:py-6">
            <CalculatorForm />
          </div>
        </div>
      </div>
    </div>
  )
}
