import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import Home from './pages/Home'
import MyWorkflows from './pages/MyWorkflows'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-workflows" element={<MyWorkflows />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

