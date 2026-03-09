import type { CalculatorInputs, CalculateResponse, Projection } from './types'

function preprocessInputs(inputs: CalculatorInputs) {
  let lifePremium = inputs.lifePremium ?? 0
  let disabilityPremium = inputs.disabilityPremium ?? 0
  let criticalIllnessPremium = inputs.criticalIllnessPremium ?? 0
  let incomeProtectionPremium = inputs.incomeProtectionPremium ?? 0

  if (!inputs.usedSpecifyModal) {
    lifePremium = inputs.lifeOverallPremium / 2
    incomeProtectionPremium = inputs.lifeOverallPremium / 2
    disabilityPremium = 0
    criticalIllnessPremium = 0
  }

  return {
    age: inputs.age,
    lifePremium,
    disabilityPremium,
    criticalIllnessPremium,
    incomeProtectionPremium,
    shortTermPremium: inputs.shortTermPremium || 0,
    medicalAidPremium: inputs.medicalAidPremium || 0,
    monthlyInvestmentContribution: inputs.monthlyInvestmentContribution || 0,
    lumpSumInvestmentContribution: inputs.lumpSumInvestmentContribution || 0,
  }
}

export function calculateProfitShare(inputs: CalculatorInputs): CalculateResponse {
  const p = preprocessInputs(inputs)
  const yearsToRetirement = 65 - p.age
  const projections: Projection[] = []

  const lifeMonthly = p.lifePremium + p.disabilityPremium + p.criticalIllnessPremium + p.incomeProtectionPremium
  const growthRate = 0.08

  for (let i = 1; i <= yearsToRetirement; i++) {
    const anb = p.age + i
    const yearFactor = Math.pow(1 + growthRate, i)
    const cumulativeFactor = ((yearFactor - 1) / growthRate)

    const life = Math.round(lifeMonthly * 12 * cumulativeFactor * 0.35)
    const sti = Math.round(p.shortTermPremium * 12 * cumulativeFactor * 0.08)
    const profmed = Math.round(p.medicalAidPremium * 12 * cumulativeFactor * 0.10)

    const investmentMonthly = p.monthlyInvestmentContribution * 12 * cumulativeFactor * 0.15
    const investmentLumpSum = p.lumpSumInvestmentContribution * yearFactor * 0.20
    const investment = Math.round(investmentMonthly + investmentLumpSum)

    const productCount = [
      lifeMonthly > 0,
      p.shortTermPremium > 0,
      p.medicalAidPremium > 0,
      p.monthlyInvestmentContribution > 0 || p.lumpSumInvestmentContribution > 0,
    ].filter(Boolean).length

    const boosterMultiplier = productCount > 1 ? 0.12 * (productCount - 1) : 0
    const chb = Math.round((life + sti + profmed + investment) * boosterMultiplier)
    const chbEffect = Math.round(chb + sti + profmed + investment)

    projections.push({ anb, life, sti, profmed, investment, chb, chbEffect })
  }

  const lastProjection = projections[projections.length - 1]
  const additionalProfitShare = lastProjection
    ? lastProjection.life + lastProjection.sti + lastProjection.profmed + lastProjection.investment + lastProjection.chb
    : 0

  return { additionalProfitShare, projections }
}
