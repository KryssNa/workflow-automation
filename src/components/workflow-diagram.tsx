"use client"

import { motion } from "framer-motion"
import { ArrowDown, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import type { WorkflowSubmission } from "../types"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface WorkflowDiagramProps {
  submission: WorkflowSubmission
}

export function WorkflowDiagram({ submission }: WorkflowDiagramProps) {
  const [isLoading, setIsLoading] = useState(true)

  // This would be replaced with actual Miro API integration
  useEffect(() => {
    // Simulate API call to generate diagram
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [submission])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-secondary/50 border-primary/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Flow Chart:</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-primary/50 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="bg-black/30 rounded-md p-4 h-[400px] flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <div>Generating workflow diagram...</div>
              </div>
            </div>
          ) : (
            <div className="bg-black/30 rounded-md p-8 flex flex-col items-center">
              <div className="bg-white/10 rounded-md p-4 text-center text-white mb-4 w-40">Start of Workflow</div>
              <ArrowDown className="text-primary h-6 w-6 my-2" />

              {submission.steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 rounded-md p-4 text-center text-white mb-2 w-40">{step.name}</div>
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-md p-2 text-center text-white mb-2 text-sm">
                      Time: {step.timeEstimate || "Unknown"} min
                    </div>
                  </div>
                  {index < submission.steps.length - 1 && <ArrowDown className="text-primary h-6 w-6 my-2" />}
                </div>
              ))}

              <ArrowDown className="text-primary h-6 w-6 my-2" />
              <div className="bg-white/10 rounded-md p-4 text-center text-white w-40">End of Workflow</div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
