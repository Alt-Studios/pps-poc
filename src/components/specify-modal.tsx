import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
    { label: 'Life Cover Premium', value: lifePremium, setter: setLifePremium },
    { label: 'Disability Premium', value: disabilityPremium, setter: setDisabilityPremium },
    { label: 'Critical Illness Premium', value: criticalIllnessPremium, setter: setCriticalIllnessPremium },
    { label: 'Income Protection Premium', value: incomeProtectionPremium, setter: setIncomeProtectionPremium },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy uppercase tracking-wider text-sm font-bold">
            Specify Life Premium Breakdown
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map(({ label, value, setter }) => (
            <div key={label}>
              <Label className="text-navy uppercase tracking-wider text-xs font-bold mb-1.5">
                {label}
              </Label>
              <div className="flex">
                <span className="bg-white/80 text-navy font-semibold px-2 py-1.5 rounded-l border border-r-0 border-input text-sm flex items-center">
                  R
                </span>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className="rounded-l-none"
                  value={value || ''}
                  onChange={(e) => setter(parseNum(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-navy uppercase tracking-wider text-xs font-bold">Total</span>
          <span className="text-navy font-bold text-base">
            R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <DialogFooter>
          <Button
            disabled={total <= 0}
            onClick={handleDone}
            className="bg-gold text-white uppercase tracking-wider hover:bg-gold/90 w-full"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
