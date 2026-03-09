import { Link } from 'react-router-dom'
import type { CalculatorInputs } from '@/lib/types'
import { formatWithSpaces } from '@/lib/format-number'

interface InputSummaryProps {
  inputs: CalculatorInputs
}

export function InputSummary({ inputs }: InputSummaryProps) {
  const items: { label: string; value: string }[] = [
    { label: 'Age', value: `${inputs.age}` },
    { label: 'Life', value: `R${formatWithSpaces(inputs.lifeOverallPremium)}` },
  ]

  if (inputs.shortTermPremium > 0) {
    items.push({ label: 'Car & Home', value: `R${formatWithSpaces(inputs.shortTermPremium)}` })
  }
  if (inputs.medicalAidPremium > 0) {
    items.push({ label: 'Medical', value: `R${formatWithSpaces(inputs.medicalAidPremium)}` })
  }
  if (inputs.monthlyInvestmentContribution > 0) {
    items.push({ label: 'Monthly Inv.', value: `R${formatWithSpaces(inputs.monthlyInvestmentContribution)}` })
  }
  if (inputs.lumpSumInvestmentContribution > 0) {
    items.push({ label: 'Lump Sum', value: `R${formatWithSpaces(inputs.lumpSumInvestmentContribution)}` })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-full border border-border-light dark:border-white/20 bg-cream dark:bg-navy px-6 py-2.5 text-sm">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <span className="mx-2 text-muted-text dark:text-white/30">|</span>}
          <span className="text-muted-text dark:text-white/50">{item.label}:</span>
          <span className="font-medium text-navy dark:text-white">{item.value}</span>
        </span>
      ))}
      <span className="mx-2 text-muted-text dark:text-white/30">|</span>
      <Link to="/" className="font-medium text-gold hover:text-gold/80 transition-colors">
        Edit Inputs
      </Link>
    </div>
  )
}
