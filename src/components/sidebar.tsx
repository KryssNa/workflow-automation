// src/components/improved-sidebar.tsx
import { motion } from "framer-motion"
import {
  BarChart,
  ChevronDown,
  Clock,
  FolderOpen,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"
import { useWorkflowStore } from "../store/workflow-store"
import { Button } from "./ui/button"

interface ImprovedSidebarProps {
  activeWorkflow?: string
}

export function Sidebar({ activeWorkflow }: ImprovedSidebarProps) {
  const navigate = useNavigate()
  const { submissions } = useWorkflowStore()
  const [expandedCategory, setExpandedCategory] = useState<string | null>("all-workflows")
  const [recentWorkflows, setRecentWorkflows] = useState<typeof submissions>([])

  // Get user from store
  const currentUser = useWorkflowStore(state => state.currentUser)

  // Set recent workflows
  useEffect(() => {
    // Sort by date and get most recent 5
    const recent = [...submissions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    setRecentWorkflows(recent)
  }, [submissions])

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  // Get unique business categories
  const businessCategories = [...new Set(submissions.map(s => s.businessName))]

  return (
    <motion.div
      className="bg-black/70 rounded-3xl p-6 h-full flex flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Workflow</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
          </div>
          <span>{currentUser?.name || 'User'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {/* Main navigation */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 rounded-lg mb-1"
            onClick={() => navigate('/')}
          >
            <LayoutDashboard className="h-5 w-5 mr-3 text-primary" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 rounded-lg mb-1"
            onClick={() => navigate('/my-workflows')}
          >
            <FolderOpen className="h-5 w-5 mr-3 text-primary" />
            All Workflows
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 rounded-lg"
            onClick={() => navigate('/new-workflow')}
          >
            <PlusCircle className="h-5 w-5 mr-3 text-primary" />
            New Workflow
          </Button>
        </div>

        {/* Recent Workflows */}
        <div>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center text-white hover:bg-white/10 rounded-lg"
            onClick={() => toggleCategory("recent")}
          >
            <span className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              Recent Workflows
            </span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${expandedCategory === "recent" ? "rotate-180" : ""}`}
            />
          </Button>

          {expandedCategory === "recent" && (
            <div className="mt-2 ml-4 space-y-1">
              {recentWorkflows.length === 0 ? (
                <p className="text-sm text-gray-500 pl-4">No recent workflows</p>
              ) : (
                recentWorkflows.map((workflow) => (
                  <Button
                    key={workflow.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm pl-8",
                      activeWorkflow === workflow.id
                        ? "bg-primary/20 text-primary"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => navigate(`/workflow/${workflow.id}`)}
                  >
                    <span className="truncate">{workflow.name}</span>
                    {activeWorkflow === workflow.id && (
                      <div className="ml-2 bg-primary w-2 h-2 rounded-full"></div>
                    )}
                  </Button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Business Categories */}
        {businessCategories.length > 0 && (
          <div>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-white hover:bg-white/10 rounded-lg"
              onClick={() => toggleCategory("businesses")}
            >
              <span className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-primary" />
                Businesses
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${expandedCategory === "businesses" ? "rotate-180" : ""}`}
              />
            </Button>

            {expandedCategory === "businesses" && (
              <div className="mt-2 ml-4 space-y-1">
                {businessCategories.map((business) => (
                  <div key={business}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm pl-4 text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => toggleCategory(`business-${business}`)}
                    >
                      {business}
                      <ChevronDown
                        className={`h-4 w-4 ml-2 transition-transform ${expandedCategory === `business-${business}` ? "rotate-180" : ""
                          }`}
                      />
                    </Button>

                    {expandedCategory === `business-${business}` && (
                      <div className="ml-4 space-y-1 mt-1">
                        {submissions
                          .filter((s) => s.businessName === business)
                          .map((workflow) => (
                            <Button
                              key={workflow.id}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-sm pl-4",
                                activeWorkflow === workflow.id
                                  ? "bg-primary/20 text-primary"
                                  : "text-gray-400 hover:text-white hover:bg-white/10"
                              )}
                              onClick={() => navigate(`/workflow/${workflow.id}`)}
                            >
                              <span className="truncate">{workflow.name}</span>
                              {activeWorkflow === workflow.id && (
                                <div className="ml-2 bg-primary w-2 h-2 rounded-full"></div>
                              )}
                            </Button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analysis & Reports */}
        <div>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center text-white hover:bg-white/10 rounded-lg"
            onClick={() => toggleCategory("analysis")}
          >
            <span className="flex items-center">
              <BarChart className="h-5 w-5 mr-3 text-primary" />
              Analytics
            </span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${expandedCategory === "analysis" ? "rotate-180" : ""}`}
            />
          </Button>

          {expandedCategory === "analysis" && (
            <div className="mt-2 ml-4 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm pl-8 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/my-workflows')}
              >
                Cost Analysis
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm pl-8 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/my-workflows')}
              >
                Efficiency Reports
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm pl-8 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/my-workflows')}
              >
                AI Recommendations
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 rounded-lg">
          <Settings className="h-5 w-5 mr-3 text-primary" />
          Settings
        </Button>
      </div>
    </motion.div>
  )
}