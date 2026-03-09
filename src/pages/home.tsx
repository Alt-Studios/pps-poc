import { CalculatorForm } from '@/components/calculator-form'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-navy px-6 py-5">
            <h1 className="text-white text-center text-xs font-normal uppercase tracking-[0.12em]">
              Profit-Share Projection
            </h1>
          </div>
          {/* Body */}
          <div className="bg-navy/95 px-6 py-6">
            <CalculatorForm />
          </div>
        </div>
      </div>
    </div>
  )
}
