import { Background } from '../components/background'
import { Header } from '../components/header'
import { EmptyState } from '../components/empty-state'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/sidebar'

export default function MyWorkflows() {
  const navigate = useNavigate()
  
  const handleCreateNew = () => {
    navigate('/')
  }

  return (
    <main className="min-h-screen flex">
      <Background />
      
      <div className="container mx-auto px-4 py-8 flex flex-col">
        <Header userName="Rohan" />

        <div className="flex flex-1 mt-8 gap-6">
          <div className="w-72">
            <Sidebar activeWorkflow="Task Automation" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">My Workflows</h1>
              <Button onClick={handleCreateNew} className="bg-primary text-white hover:bg-primary/90 rounded-full px-6">
                Create new
              </Button>
            </div>

            <EmptyState onCreateNew={handleCreateNew} />
          </div>
        </div>
      </div>
    </main>
  )
}

