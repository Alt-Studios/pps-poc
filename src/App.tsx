import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CalculatorProvider } from '@/context/calculator-context'
import HomePage from '@/pages/home'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<Placeholder name="Results" />} />
          <Route path="/more-details" element={<Placeholder name="More Details" />} />
        </Routes>
      </BrowserRouter>
    </CalculatorProvider>
  )
}
