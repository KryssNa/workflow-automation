"use client"

import { useEffect } from "react"
import { WorkflowSubmission } from "../../types"
import ReactFlow from "reactflow"
// import type { WorkflowSubmission } from "../../services/workflow/types"

// Add onError prop to the component props
interface ReactFlowWrapperProps {
  submission: WorkflowSubmission
  readOnly?: boolean
  onError?: () => void
}

export function ReactFlowWrapper({ submission, readOnly = false, onError }: ReactFlowWrapperProps) {
  // Add error handling
  useEffect(() => {
    try {
      // Test if ReactFlow is available
      if (typeof ReactFlow === "undefined") {
        throw new Error("ReactFlow is not available")
      }
    } catch (error) {
      console.error("Error loading ReactFlow:", error)
      if (onError) onError()
    }
  }, [onError])

  // Rest of the component remains the same
  return (
    <div>
      {/* Placeholder for ReactFlow component */}
      <p>ReactFlow component will be rendered here. Submission ID: {submission.id}</p>
    </div>
  )
}
