import { CalculatorForm } from '@/components/calculator-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  return (
    <div className="flex-1 bg-cream-light dark:bg-navy-dark flex items-center justify-center p-4 sm:p-6 py-12 sm:py-20">
      <div className="w-full max-w-lg">
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-br from-navy via-navy to-navy-dark px-4 sm:px-6 py-5 sm:py-6 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 size-24 rounded-full bg-gold/10 blur-2xl" />
            <div className="flex flex-col items-center gap-3">
              <img src="/pps-logo-white.svg" alt="PPS" className="h-8 sm:h-10 w-auto opacity-90" />
              <h1 className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                Profit-Share Projection
              </h1>
            </div>
          </div>
          {/* Body */}
          <div className="bg-white dark:bg-navy/95 px-4 sm:px-6 py-5 sm:py-6">
            <div className="flex justify-end mb-2">
              <ThemeToggle />
            </div>
            <CalculatorForm />
          </div>
        </div>
      </div>
    </div>
  )
}
