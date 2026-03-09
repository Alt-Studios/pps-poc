export interface CalculatorInputs {
  age: number
  lifeOverallPremium: number
  lifePremium: number | null
  disabilityPremium: number | null
  criticalIllnessPremium: number | null
  incomeProtectionPremium: number | null
  shortTermPremium: number
  medicalAidPremium: number
  monthlyInvestmentContribution: number
  lumpSumInvestmentContribution: number
  usedSpecifyModal: boolean
}

export interface Projection {
  anb: number
  life: number
  sti: number
  profmed: number
  investment: number
  chb: number
  chbEffect: number
}

export interface CalculateResponse {
  additionalProfitShare: number
  projections: Projection[]
}
