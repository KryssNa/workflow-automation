// src/pages/MyWorkflows.tsx
import { Clock, Filter, Search, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/background'
import { Header } from '../components/header'
import { EmptyState } from '../components/empty-state'
import { Sidebar } from '../components/sidebar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { WorkflowSummary } from '../components/workflow-summary'
import { useWorkflowStore } from '../store/workflow-store'

export default function MyWorkflows() {
  const navigate = useNavigate()
  const { submissions, setSelectedSubmission } = useWorkflowStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [filteredWorkflows, setFilteredWorkflows] = useState(submissions)

  // Get unique business categories
  const businessCategories = [...new Set(submissions.map(s => s.businessName))]

  useEffect(() => {
    let result = [...submissions]

    // Apply search filter if exists
    if (searchQuery) {
      result = result.filter(workflow =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'recent') {
        // Sort by date and take most recent
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5)
      } else {
        // Filter by business category
        result = result.filter(workflow =>
          workflow.businessName.toLowerCase() === activeFilter.toLowerCase()
        )
      }
    }

    setFilteredWorkflows(result)
  }, [submissions, searchQuery, activeFilter])

  const handleCreateNew = () => {
    navigate('/')
  }

  const handleWorkflowClick = (workflowId: string) => {
    setSelectedSubmission(workflowId)
    navigate(`/workflow/${workflowId}`)
  }

  return (
    <main className="min-h-screen flex">
      <Background />

      <div className="container mx-auto px-4 py-8 flex flex-col">
        <Header userName="Rohan" />

        <div className="flex flex-1 mt-8 gap-6">
          <div className="w-72 hidden md:block">
            <Sidebar />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">My Workflows</h1>
              <Button onClick={handleCreateNew} className="bg-primary text-white hover:bg-primary/90 rounded-full px-6">
                <span className="hidden sm:inline mr-2">Create</span> new
              </Button>
            </div>

            {submissions.length === 0 ? (
              <EmptyState onCreateNew={handleCreateNew} />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search workflows..."
                      className="bg-secondary/30 border-primary/30 pl-10 text-white w-full md:w-80"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Tabs
                  defaultValue="all"
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                  className="w-full"
                >
                  <TabsList className="bg-black/30 w-full md:w-auto overflow-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Tag className="h-4 w-4 mr-1.5" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Clock className="h-4 w-4 mr-1.5" />
                      Recent
                    </TabsTrigger>
                    {businessCategories.map(category => (
                      <TabsTrigger
                        key={category}
                        value={category.toLowerCase()}
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    {filteredWorkflows.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">No workflows match your search</p>
                        <p className="text-sm">Try adjusting your search query</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkflows.map(workflow => (
                          <WorkflowSummary
                            key={workflow.id}
                            submission={workflow}
                            onClick={() => handleWorkflowClick(workflow.id)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Content for other tabs */}
                  {['recent', ...businessCategories.map(c => c.toLowerCase())].map(tab => (
                    <TabsContent key={tab} value={tab} className="mt-6">
                      {filteredWorkflows.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">No workflows in this category</p>
                          <Button
                            onClick={handleCreateNew}
                            variant="outline"
                            className="mt-4 border-primary/50 text-white"
                          >
                            Create new workflow
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredWorkflows.map(workflow => (
                            <WorkflowSummary
                              key={workflow.id}
                              submission={workflow}
                              onClick={() => handleWorkflowClick(workflow.id)}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}