import { CalculatorForm } from '@/components/calculator-form'
import { useTheme } from '@/context/theme-context'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-cream-light dark:bg-navy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-navy px-6 py-5 flex items-center justify-between">
            <div />
            <h1 className="text-white text-center text-xs font-normal uppercase tracking-[0.12em]">
              Profit-Share Projection
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
          {/* Body */}
          <div className="bg-white dark:bg-navy/95 px-6 py-6">
            <CalculatorForm />
          </div>
        </div>
      </div>
    </div>
  )
}
