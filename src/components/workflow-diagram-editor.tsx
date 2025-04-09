"use client"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, RefreshCw, Save } from "lucide-react"
import { useWorkflowStore } from "../store/workflow-store"
import type { WorkflowSubmission } from "../types"
import { ReactFlowWrapper } from "./diagram/react-flow-wrapper"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import dynamic from "next/dynamic"

// Dynamically import ReactFlow with no SSR
// const ReactFlowWrapper = dynamic(() => import("./diagram/react-flow-wrapper").then((mod) => mod.ReactFlowWrapper), {
//   ssr: false,
//   loading: () => <DiagramLoading />,
// })

interface WorkflowDiagramEditorProps {
  submission: WorkflowSubmission
  readOnly?: boolean
  onError?: () => void
}

function DiagramLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-black/30 rounded-md">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4 mx-auto"></div>
        <p className="text-white">Loading workflow diagram...</p>
      </div>
    </div>
  )
}

export function WorkflowDiagramEditor({ submission, readOnly = false, onError }: WorkflowDiagramEditorProps) {
  const { isLinearWorkflow, toggleWorkflowType } = useWorkflowStore()

  const handleToggleWorkflowType = () => {
    toggleWorkflowType()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[600px] w-full"
    >
      <Card className="bg-secondary/50 border-primary/30 h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Workflow Diagram:</CardTitle>
          <div className="flex gap-2">
            {!readOnly && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/50 text-white"
                  onClick={handleToggleWorkflowType}
                >
                  {isLinearWorkflow ? <ArrowDown className="h-4 w-4 mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  {isLinearWorkflow ? "Linear Flow" : "Complex Flow"}
                </Button>
                <Button size="sm" variant="outline" className="border-primary/50 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Diagram
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="border-primary/50 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-60px)]">
          <ReactFlowWrapper submission={submission} readOnly={readOnly} onError={onError} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
