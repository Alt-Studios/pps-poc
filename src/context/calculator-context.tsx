import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CalculatorInputs, CalculateResponse } from '@/lib/types'
import { calculateProfitShare } from '@/lib/mock-api'

interface CalculatorContextType {
  inputs: CalculatorInputs | null
  result: CalculateResponse | null
  calculate: (inputs: CalculatorInputs) => CalculateResponse
  reset: () => void
}

const CalculatorContext = createContext<CalculatorContextType | null>(null)

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null)
  const [result, setResult] = useState<CalculateResponse | null>(null)

  function calculate(newInputs: CalculatorInputs): CalculateResponse {
    setInputs(newInputs)
    const response = calculateProfitShare(newInputs)
    setResult(response)
    return response
  }

  function reset() {
    setInputs(null)
    setResult(null)
  }

  return (
    <CalculatorContext.Provider value={{ inputs, result, calculate, reset }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
