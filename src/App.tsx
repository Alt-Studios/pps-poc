import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Placeholder({ name }: { name: string }) {
  return <div className="p-8 text-dark-text">{name} page</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/results" element={<Placeholder name="Results" />} />
        <Route path="/more-details" element={<Placeholder name="More Details" />} />
      </Routes>
    </BrowserRouter>
  )
}
