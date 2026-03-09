import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'
import HomePage from '@/pages/home'
import ResultsPage from '@/pages/results'
import MoreDetailsPage from '@/pages/more-details'

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/more-details" element={<MoreDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
