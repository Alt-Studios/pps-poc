import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SpecifyModal } from '@/components/specify-modal'
import { useCalculator } from '@/context/calculator-context'
import type { CalculatorInputs } from '@/lib/types'

interface FormErrors {
  age?: string
  lifeOverallPremium?: string
}

export function CalculatorForm() {
  const navigate = useNavigate()
  const { calculate, inputs: savedInputs } = useCalculator()

  const fmt = (n: number | undefined | null) => (n ? n.toString() : '')

  const [age, setAge] = useState(() => fmt(savedInputs?.age))
  const [lifeOverallPremium, setLifeOverallPremium] = useState(() => fmt(savedInputs?.lifeOverallPremium))
  const [shortTermPremium, setShortTermPremium] = useState(() => fmt(savedInputs?.shortTermPremium))
  const [medicalAidPremium, setMedicalAidPremium] = useState(() => fmt(savedInputs?.medicalAidPremium))
  const [monthlyInvestment, setMonthlyInvestment] = useState(() => fmt(savedInputs?.monthlyInvestmentContribution))
  const [lumpSumInvestment, setLumpSumInvestment] = useState(() => fmt(savedInputs?.lumpSumInvestmentContribution))

  const [lifePremium, setLifePremium] = useState(savedInputs?.lifePremium ?? 0)
  const [disabilityPremium, setDisabilityPremium] = useState(savedInputs?.disabilityPremium ?? 0)
  const [criticalIllnessPremium, setCriticalIllnessPremium] = useState(savedInputs?.criticalIllnessPremium ?? 0)
  const [incomeProtectionPremium, setIncomeProtectionPremium] = useState(savedInputs?.incomeProtectionPremium ?? 0)
  const [usedSpecifyModal, setUsedSpecifyModal] = useState(savedInputs?.usedSpecifyModal ?? false)

  const [specifyOpen, setSpecifyOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function parseNum(val: string): number {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : n
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    const ageNum = parseInt(age)
    if (!age || isNaN(ageNum) || ageNum < 19 || ageNum > 64) {
      errs.age = 'Age must be between 19 and 64'
    }
    if (!lifeOverallPremium || parseNum(lifeOverallPremium) <= 0) {
      errs.lifeOverallPremium = 'Life insurance premium is required and must be greater than 0'
    }
    return errs
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const inputs: CalculatorInputs = {
      age: parseInt(age),
      lifeOverallPremium: parseNum(lifeOverallPremium),
      lifePremium: usedSpecifyModal ? lifePremium : null,
      disabilityPremium: usedSpecifyModal ? disabilityPremium : null,
      criticalIllnessPremium: usedSpecifyModal ? criticalIllnessPremium : null,
      incomeProtectionPremium: usedSpecifyModal ? incomeProtectionPremium : null,
      shortTermPremium: parseNum(shortTermPremium),
      medicalAidPremium: parseNum(medicalAidPremium),
      monthlyInvestmentContribution: parseNum(monthlyInvestment),
      lumpSumInvestmentContribution: parseNum(lumpSumInvestment),
      usedSpecifyModal,
    }

    calculate(inputs)
    navigate('/results')
  }

  function handleSpecifyDone(values: {
    lifePremium: number
    disabilityPremium: number
    criticalIllnessPremium: number
    incomeProtectionPremium: number
  }) {
    setLifePremium(values.lifePremium)
    setDisabilityPremium(values.disabilityPremium)
    setCriticalIllnessPremium(values.criticalIllnessPremium)
    setIncomeProtectionPremium(values.incomeProtectionPremium)
    const total = values.lifePremium + values.disabilityPremium + values.criticalIllnessPremium + values.incomeProtectionPremium
    setLifeOverallPremium(total.toString())
    setUsedSpecifyModal(true)
    if (errors.lifeOverallPremium) {
      setErrors((prev) => ({ ...prev, lifeOverallPremium: undefined }))
    }
  }

  function handleLifeOverallChange(val: string) {
    setLifeOverallPremium(val)
    if (usedSpecifyModal) {
      setUsedSpecifyModal(false)
      setLifePremium(0)
      setDisabilityPremium(0)
      setCriticalIllnessPremium(0)
      setIncomeProtectionPremium(0)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Age */}
        <div>
          <Label className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5">
            Age
          </Label>
          <div className="flex">
            <Input
              type="number"
              min={19}
              max={64}
              value={age}
              onChange={(e) => {
                setAge(e.target.value)
                if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }))
              }}
              placeholder="Enter your age"
              className="rounded-l-lg rounded-r-none bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
            />
            <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-r-lg border border-l-0 border-border-light dark:border-white/20 text-sm flex items-center">
              years
            </span>
          </div>
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>

        {/* PPS Life Insurance Premium */}
        <div>
          <Label className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5">
            PPS Life Insurance Premium
          </Label>
          <div className="flex">
            <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center">
              R
            </span>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={lifeOverallPremium}
              onChange={(e) => {
                handleLifeOverallChange(e.target.value)
                if (errors.lifeOverallPremium) setErrors((prev) => ({ ...prev, lifeOverallPremium: undefined }))
              }}
              placeholder="0.00"
              className="rounded-l-none rounded-r-lg bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
            />
            <Button
              type="button"
              onClick={() => setSpecifyOpen(true)}
              variant="outline"
              size="lg"
              className="ml-2 text-gold border-gold/40 hover:bg-gold/10 hover:text-gold uppercase tracking-wider text-xs shrink-0"
            >
              Specify
            </Button>
          </div>
          {errors.lifeOverallPremium && <p className="text-red-400 text-xs mt-1">{errors.lifeOverallPremium}</p>}
        </div>

        {/* Car & Home Premium */}
        <div>
          <Label className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5">
            Car & Home Premium
          </Label>
          <div className="flex">
            <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center">
              R
            </span>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={shortTermPremium}
              onChange={(e) => setShortTermPremium(e.target.value)}
              placeholder="0.00"
              className="rounded-l-none rounded-r-lg bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Medical Aid Premium */}
        <div>
          <Label className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5">
            Medical Aid Premium
          </Label>
          <div className="flex">
            <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center">
              R
            </span>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={medicalAidPremium}
              onChange={(e) => setMedicalAidPremium(e.target.value)}
              placeholder="0.00"
              className="rounded-l-none rounded-r-lg bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Investment Contributions */}
        <div>
          <Label className="text-navy dark:text-white uppercase tracking-[0.12em] font-normal text-xs mb-1.5">
            Investment Contributions
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-muted-text dark:text-white/60 text-xs mb-1 block">Monthly</span>
              <div className="flex">
                <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center">
                  R
                </span>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  placeholder="0.00"
                  className="rounded-l-none rounded-r-lg bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
                />
              </div>
            </div>
            <div>
              <span className="text-muted-text dark:text-white/60 text-xs mb-1 block">Lump Sum Once-off</span>
              <div className="flex">
                <span className="bg-navy dark:bg-white/80 text-white dark:text-navy font-semibold px-3 h-10 rounded-l-lg border border-r-0 border-border-light dark:border-white/20 text-sm flex items-center">
                  R
                </span>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={lumpSumInvestment}
                  onChange={(e) => setLumpSumInvestment(e.target.value)}
                  placeholder="0.00"
                  className="rounded-l-none rounded-r-lg bg-cream dark:bg-white/10 text-navy dark:text-white border-border-light dark:border-white/20 placeholder:text-muted-text dark:placeholder:text-white/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-gold text-white uppercase tracking-wider hover:bg-gold/90 rounded-full py-6 font-bold text-sm"
        >
          Calculate Profit Share
        </Button>
      </form>

      <SpecifyModal
        open={specifyOpen}
        onOpenChange={setSpecifyOpen}
        onDone={handleSpecifyDone}
        initialValues={{
          lifePremium,
          disabilityPremium,
          criticalIllnessPremium,
          incomeProtectionPremium,
        }}
      />
    </>
  )
}
