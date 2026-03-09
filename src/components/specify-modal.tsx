import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface SpecifyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (values: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }) => void
  initialValues?: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }
}

export function SpecifyModal({
  open,
  onOpenChange,
  onDone,
  initialValues,
}: SpecifyModalProps) {
  const [lifePremium, setLifePremium] = useState(initialValues?.lifePremium ?? 0)
  const [disabilityPremium, setDisabilityPremium] = useState(initialValues?.disabilityPremium ?? 0)
  const [criticalIllnessPremium, setCriticalIllnessPremium] = useState(initialValues?.criticalIllnessPremium ?? 0)
  const [incomeProtectionPremium, setIncomeProtectionPremium] = useState(initialValues?.incomeProtectionPremium ?? 0)

  // Sync state when modal reopens with new initialValues
  useEffect(() => {
    if (open) {
      setLifePremium(initialValues?.lifePremium ?? 0)
      setDisabilityPremium(initialValues?.disabilityPremium ?? 0)
      setCriticalIllnessPremium(initialValues?.criticalIllnessPremium ?? 0)
      setIncomeProtectionPremium(initialValues?.incomeProtectionPremium ?? 0)
    }
  }, [open, initialValues])

  const total = lifePremium + disabilityPremium + criticalIllnessPremium + incomeProtectionPremium

  function handleDone() {
    onDone({
      lifePremium,
      disabilityPremium,
      criticalIllnessPremium,
      incomeProtectionPremium,
    })
    onOpenChange(false)
  }

  function parseNum(val: string): number {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : n
  }

  const fields = [
    { label: 'Life Cover', value: lifePremium, setter: setLifePremium },
    { label: 'Disability', value: disabilityPremium, setter: setDisabilityPremium },
    { label: 'Critical Illness', value: criticalIllnessPremium, setter: setCriticalIllnessPremium },
    { label: 'Income Protection', value: incomeProtectionPremium, setter: setIncomeProtectionPremium },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md overflow-hidden border-0 p-0 bg-white/80 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-2xl"
      >
        {/* Header with logo and gradient */}
        <div className="relative bg-gradient-to-br from-navy via-navy to-navy-dark px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 overflow-hidden">
          {/* Decorative glass circles */}
          <div className="absolute -top-8 -right-8 size-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-teal/10 blur-xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/pps-logo-white.svg"
                alt="PPS"
                className="h-7 w-auto opacity-90"
              />
              <div className="h-5 w-px bg-white/20" />
              <DialogHeader className="p-0">
                <DialogTitle className="text-white/90 uppercase tracking-[0.15em] text-[11px] font-medium">
                  Premium Breakdown
                </DialogTitle>
              </DialogHeader>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="size-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="px-4 sm:px-6 pb-2 pt-1 space-y-3">
          {fields.map(({ label, value, setter }) => (
            <div key={label} className="group">
              <Label className="text-navy/60 dark:text-white/50 uppercase tracking-[0.12em] text-[10px] font-semibold mb-1">
                {label}
              </Label>
              <div className="flex">
                <span className="bg-navy/5 dark:bg-white/5 backdrop-blur-sm text-navy/70 dark:text-white/70 font-semibold px-3 h-10 rounded-l-xl border border-r-0 border-navy/10 dark:border-white/10 text-sm flex items-center transition-colors group-focus-within:border-gold/30 dark:group-focus-within:border-gold/30">
                  R
                </span>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className="rounded-l-none rounded-r-xl bg-navy/[0.03] dark:bg-white/[0.03] text-navy dark:text-white border-navy/10 dark:border-white/10 placeholder:text-navy/30 dark:placeholder:text-white/30 focus:border-gold/40 dark:focus:border-gold/40 focus:ring-gold/10 transition-colors"
                  value={value || ''}
                  onChange={(e) => setter(parseNum(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total bar - glass effect */}
        <div className="mx-4 flex items-center justify-between rounded-xl bg-navy/[0.04] dark:bg-white/[0.06] backdrop-blur-sm px-4 py-3 ring-1 ring-navy/5 dark:ring-white/5">
          <span className="text-navy/50 dark:text-white/50 uppercase tracking-[0.15em] text-[10px] font-semibold">
            Total Premium
          </span>
          <span className="text-navy dark:text-white font-bold text-lg tabular-nums">
            R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-1">
          <Button
            disabled={total <= 0}
            onClick={handleDone}
            className="w-full bg-gradient-to-r from-gold to-gold/90 text-white uppercase tracking-[0.15em] text-xs font-semibold hover:from-gold/90 hover:to-gold/80 rounded-xl h-11 shadow-lg shadow-gold/20 transition-all disabled:opacity-40 disabled:shadow-none"
          >
            Apply Breakdown
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
