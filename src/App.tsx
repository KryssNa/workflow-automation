import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import Home from './pages/Home'
import MyWorkflows from './pages/MyWorkflows'
import WorkflowDetails from './pages/WorkflowDetails'
import NewWorkflow from './pages/NewWorkflow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-workflows" element={<MyWorkflows />} />
        <Route path="/new-workflow" element={<NewWorkflow />} />
        <Route path="/workflow/:id" element={<WorkflowDetails />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

