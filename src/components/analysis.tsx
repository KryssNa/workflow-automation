"use client"

import { Button } from "./ui/button"
import { exportWithFlowChart } from "../services/export-service"
import { useWorkflowStore } from "../store/workflow-store"
import type { WorkflowSubmission } from "../types"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Copy,
  Download,
  Layers,
  Lightbulb,
  PenToolIcon as Tool,
  Zap,
} from "lucide-react"
import { useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface AnalysisProps {
  submission: WorkflowSubmission
}

export function Analysis({ submission }: AnalysisProps) {
  const { openModal } = useWorkflowStore()
  const [isCopying, setIsCopying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleCopy = useCallback(async () => {
    if (isCopying) return

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(submission.analysis || "No analysis available")

      // Use setTimeout to clear the copying state after 2 seconds
      const timer = setTimeout(() => setIsCopying(false), 2000)
      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Failed to copy:", error)
      setIsCopying(false)
    }
  }, [submission.analysis, isCopying])

  const handleExport = useCallback(async () => {
    if (isExporting) return

    setIsExporting(true)

    // Use setTimeout to ensure any necessary rendering is complete
    const timer = setTimeout(async () => {
      try {
        await exportWithFlowChart(submission)
      } catch (error) {
        console.error("Failed to export:", error)
        alert("There was an error exporting the workflow. Please try again.")
      } finally {
        setIsExporting(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [submission, isExporting])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      id="analysis-content"
    >
      <Card className="bg-secondary/50 border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/50 text-white"
              onClick={handleCopy}
              disabled={isCopying}
            >
              {isCopying ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {isCopying ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/50 text-white"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-black/20 p-4 rounded-lg border border-primary/20">
              <p className="text-white mb-4">{submission.analysis || "No analysis available"}</p>
            </div>

            <div className="bg-black/10 p-4 rounded-lg border border-primary/10">
              <h3 className="text-primary font-medium mb-2 flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Understand the Manual Workflow
              </h3>
              <p className="text-white mb-2">Key Steps:</p>
              <ul className="list-disc pl-5 space-y-1 text-white mb-4">
                <li>Task Identification: Identify all tasks involved in the workflow.</li>
                <li>
                  Bottlenecks and Inefficiencies: Determine which steps are time-consuming, repetitive, or prone to
                  errors.
                </li>
                <li>Constraints: Note any budget, privacy, or technical limitations.</li>
              </ul>
            </div>

            <div className="bg-black/10 p-4 rounded-lg border border-primary/10">
              <h3 className="text-primary font-medium mb-2 flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Design the Step-by-Step AI & Automation Workflow
              </h3>

              {submission.steps.map((step, index) => (
                <div key={step.id} className="mb-4 bg-black/20 p-3 rounded-md border border-primary/20 mt-3">
                  <h4 className="text-white font-medium flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    Step {index + 1}: {step.name}
                  </h4>
                  <p className="text-gray-400 ml-6 mt-1">{step.description}</p>
                  <div className="flex items-center mt-2 ml-6">
                    <span className="text-gray-400 mr-2">Tool:</span>
                    <span className="text-primary">{step.tools?.join(" or ")}</span>
                  </div>
                  <div className="flex items-center mt-1 ml-6">
                    <span className="text-gray-400 mr-2">Instructions:</span>
                    <span className="text-white">{step.instructions}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/10 p-4 rounded-lg border border-primary/10">
              <h3 className="text-primary font-medium mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Identify Potential End-to-End AI Solutions
              </h3>
              <p className="text-white mb-2">Single AI Tool for Multiple Steps:</p>
              <div className="bg-black/30 p-3 rounded-md mb-2">
                <h4 className="text-white font-medium flex items-center">
                  <Tool className="h-4 w-4 mr-2 text-primary" />
                  IBM Watson Orchestrate
                </h4>
                <p className="text-gray-400 text-sm">
                  This tool can handle multiple steps by creating personalized AI assistants and agents that automate
                  repetitive tasks and simplify complex processes.
                </p>
              </div>
            </div>

            <div className="bg-black/10 p-4 rounded-lg border border-primary/10">
              <h3 className="text-primary font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Customization Based on Industry & Constraints
              </h3>
              <p className="text-white mb-2">Industry-Specific Constraints:</p>
              <ul className="space-y-2 text-white">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    If the workflow involves HR tasks, consider using Pulpstream for leave of absence management and
                    workers' comp claims processing.
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    For compliance and security, ensure tools like Artwork Flow are ISO certified and SOC 2 compliant.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
