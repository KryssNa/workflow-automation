// src/pages/Home.tsx 
import { motion } from "framer-motion"
import { ArrowRight, BarChart, Layers, PlusCircle, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Background } from "../components/background"
import { Header } from "../components/header"
import { Modal } from "../components/modal"
import { CommentModal } from "../components/modals/comment-modal"
import { ConfirmationModal } from "../components/modals/confirmation-modal"
import { IntegrationModal } from "../components/modals/integration-modal"
import { NotificationsPanel } from "../components/notifications/notifications-panel"
import { OfflineBanner } from "../components/pwa/offline-banner"
import { SyncStatus } from "../components/pwa/sync-status"
import { WorkflowSummary } from "../components/workflow-summary"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

import { useWorkflowStore } from "../store/workflow-store"

export default function Home() {
  const { submissions, isOffline, setSelectedSubmission } = useWorkflowStore();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/new-workflow');
  };

  const handleViewWorkflow = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    navigate(`/workflow/${submissionId}`);
  };

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

      <div className="container mx-auto px-4 py-8 flex flex-col">
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

          <Button
            onClick={handleCreateNew}
            className="bg-primary text-white hover:bg-primary/90 mt-4"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
        </motion.div>

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
                        onClick={() => handleViewWorkflow(submission.id)}
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
      </div>
    </main>
  );
}