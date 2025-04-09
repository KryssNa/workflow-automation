import { motion } from "framer-motion"
import { ArrowRight, BarChart, Edit, FileText, Layers, PlusCircle, Zap } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Analysis } from "../components/analysis"
import { AdvancedCostAnalysis } from "../components/analytics/advanced-cost-analysis"
import { Background } from "../components/background"
import { Header } from "../components/header"
import { IntegrationsPanel } from "../components/integrations/integrations-panel"
import { Modal } from "../components/modal"
import { CommentModal } from "../components/modals/comment-modal"
import { ConfirmationModal } from "../components/modals/confirmation-modal"
import { IntegrationModal } from "../components/modals/integration-modal"
import { NotificationsPanel } from "../components/notifications/notifications-panel"
import { OfflineBanner } from "../components/pwa/offline-banner"
import { SyncStatus } from "../components/pwa/sync-status"
import { WorkflowDiagramSimple } from "../components/workflow-diagram-simple"
import { WorkflowForm } from "../components/workflow-form"
import { WorkflowSummary } from "../components/workflow-summary"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

import { exportWithFlowChart } from "../services/export-service"
import { useWorkflowStore } from "../store/workflow-store"

// You could use React.lazy for this instead of Next.js dynamic
import { lazy } from "react"
const LazyWorkflowDiagramEditor = lazy(() =>
  import("../components/workflow-diagram-editor").then((module) => ({ default: module.WorkflowDiagramEditor }))
);

export default function Home() {
  const { submissions, currentSubmissionId, isEditing, resetForm, costAnalysis, editSubmission, isOffline } =
    useWorkflowStore()

  const [showForm, setShowForm] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("analysis")
  const [diagramError, setDiagramError] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Handle URL parameters
  useEffect(() => {
    const submissionId = searchParams.get("id")
    const newWorkflow = searchParams.get("new")
    const editMode = searchParams.get("edit")

    // Avoid unnecessary state updates if nothing has changed
    if (newWorkflow === "true" && !showForm) {
      resetForm()
      setShowForm(true)
      setSelectedSubmission(null)
    } else if (submissionId && editMode === "true") {
      const submission = submissions.find((sub) => sub.id === submissionId)
      if (submission && (selectedSubmission !== submissionId || !showForm)) {
        setSelectedSubmission(submissionId)
        editSubmission(submissionId)
        setShowForm(true)
      }
    } else if (submissionId) {
      const submission = submissions.find((sub) => sub.id === submissionId)
      if (submission && (selectedSubmission !== submissionId || showForm)) {
        setSelectedSubmission(submissionId)
        setShowForm(false)
      }
    }
  }, [searchParams, submissions, resetForm, editSubmission, selectedSubmission, showForm])

  // Handle changes to editing state from store - only run when isEditing changes
  useEffect(() => {
    if (isEditing && !showForm) {
      setShowForm(true)
    }
  }, [isEditing, showForm])

  // Get current submission based on selected submission or latest submission
  const currentSubmission = selectedSubmission
    ? submissions.find((sub) => sub.id === selectedSubmission)
    : submissions.length > 0
      ? submissions[submissions.length - 1]
      : null

  // Memoized handlers to prevent recreation on re-renders
  const handleCreateNew = useCallback(() => {
    resetForm()
    setShowForm(true)
    setSelectedSubmission(null)
    // Use replace instead of push to avoid adding to history stack
    navigate("/?new=true", { replace: true })
  }, [resetForm, navigate])

  const handleExportCurrentWorkflow = useCallback(() => {
    if (currentSubmission && !isExporting) {
      setIsExporting(true)

      // Store the current tab
      const currentTab = activeTab

      // Set the diagram tab active
      setActiveTab("diagram")

      // Add a delay to ensure the diagram is fully rendered
      setTimeout(() => {
        try {
          exportWithFlowChart(currentSubmission)
        } catch (error) {
          console.error("Export failed:", error)
          alert("There was an error exporting the workflow. Please try again.")
        } finally {
          setIsExporting(false)
          // Restore the previous tab after export
          setActiveTab(currentTab)
        }
      }, 1000)
    }
  }, [currentSubmission, activeTab, isExporting])

  return (
    <main className="min-h-screen">
      <Background />
      <Modal />
      <IntegrationModal />
      <CommentModal />
      <ConfirmationModal />
      <NotificationsPanel />
      <OfflineBanner />

      {isOffline && <SyncStatus />}

      <div className="container mx-auto px-4 py-8">
        <Header userName="Rohan" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 mt-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-primary">Optimize Your</span> Workflow with AI
          </h1>
          <p className="text-white max-w-2xl mx-auto mb-4">
            Answer a few questions and find the best AI tools to automate your repetitive tasks and save costs.
          </p>

          {currentSubmission && !showForm && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleExportCurrentWorkflow}
                variant="outline"
                className="border-primary/50 text-white mt-4"
                disabled={isExporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Workflow"}
              </Button>

              <Button
                onClick={() => {
                  editSubmission(currentSubmission.id)
                  // Let the effect handle the state updates
                  navigate(`/?id=${currentSubmission.id}&edit=true`, { replace: true })
                }}
                variant="outline"
                className="border-primary/50 text-white mt-4"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Workflow
              </Button>

              <Button
                onClick={handleCreateNew}
                variant="default"
                className="bg-primary text-white mt-4 hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          )}
        </motion.div>

        {showForm ? (
          <WorkflowForm />
        ) : (
          <div>
            {submissions.length > 0 && currentSubmission ? (
              <div className="space-y-12">
                <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-black/30 mb-6">
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="diagram"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Flow Chart Diagram
                    </TabsTrigger>
                    <TabsTrigger
                      value="costs"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Cost Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="integrations"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Integrations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-0">
                    <Analysis submission={currentSubmission} />
                  </TabsContent>

                  <TabsContent value="diagram" className="mt-0">
                    <WorkflowDiagramSimple submission={currentSubmission} />
                  </TabsContent>

                  <TabsContent value="costs" className="mt-0">
                    <AdvancedCostAnalysis submission={currentSubmission} />
                  </TabsContent>

                  <TabsContent value="integrations" className="mt-0">
                    <IntegrationsPanel />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-secondary/50 border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-primary" />
                        Welcome to AI Workflow
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/20 p-6 rounded-lg border border-primary/20 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Layers className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-white text-lg font-medium mb-2">Analyze Your Workflows</h3>
                          <p className="text-gray-300 mb-4">
                            Identify bottlenecks and inefficiencies in your current processes
                          </p>
                          <Button
                            onClick={handleCreateNew}
                            className="mt-auto bg-primary text-white hover:bg-primary/90"
                          >
                            Start Analysis
                          </Button>
                        </div>

                        <div className="bg-black/20 p-6 rounded-lg border border-primary/20 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Zap className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-white text-lg font-medium mb-2">AI-Powered Recommendations</h3>
                          <p className="text-gray-300 mb-4">
                            Get tailored AI tool suggestions to automate repetitive tasks
                          </p>
                          <Button
                            onClick={handleCreateNew}
                            className="mt-auto bg-primary text-white hover:bg-primary/90"
                          >
                            Create Workflow
                          </Button>
                        </div>

                        <div className="bg-black/20 p-6 rounded-lg border border-primary/20 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <BarChart className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-white text-lg font-medium mb-2">Cost Savings Analysis</h3>
                          <p className="text-gray-300 mb-4">
                            Calculate potential time and cost savings with AI automation
                          </p>
                          <Button
                            onClick={() => navigate("/my-workflows")}
                            className="mt-auto bg-primary text-white hover:bg-primary/90"
                          >
                            View Workflows
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-black/20 rounded-lg border border-primary/20">
                        <h3 className="text-white text-lg font-medium mb-4 flex items-center">
                          <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                          Get Started in 3 Simple Steps
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white font-medium">1</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Describe Your Workflow</h4>
                              <p className="text-gray-300 text-sm">
                                Answer questions about your current process and pain points
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white font-medium">2</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Review AI Analysis</h4>
                              <p className="text-gray-300 text-sm">
                                Get detailed insights and recommendations for automation
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-white font-medium">3</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Implement Solutions</h4>
                              <p className="text-gray-300 text-sm">
                                Follow the step-by-step guide to transform your workflow
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {submissions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="bg-secondary/50 border-primary/30">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Layers className="h-5 w-5 mr-2 text-primary" />
                          Your Recent Workflows
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {submissions.slice(0, 4).map((submission) => (
                            <WorkflowSummary
                              key={submission.id}
                              submission={submission}
                              onClick={() => {
                                if (selectedSubmission !== submission.id) {
                                  setSelectedSubmission(submission.id)
                                  setActiveTab("analysis")
                                  // Use replace instead of push to avoid adding to history stack
                                  navigate(`/?id=${submission.id}`, { replace: true })
                                }
                              }}
                            />
                          ))}
                        </div>
                        {submissions.length > 4 && (
                          <div className="mt-4 text-center">
                            <Button
                              onClick={() => navigate("/my-workflows")}
                              variant="outline"
                              className="border-primary/50 text-white"
                            >
                              View All Workflows
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}