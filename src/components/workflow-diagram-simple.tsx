"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { WorkflowSubmission } from "../types"
import { motion } from "framer-motion"
import { ArrowDown, RefreshCw, Zap } from "lucide-react"
import { useCallback, useState } from "react"

interface WorkflowDiagramSimpleProps {
  submission: WorkflowSubmission
}

export function WorkflowDiagramSimple({ submission }: WorkflowDiagramSimpleProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return

    setIsRefreshing(true)
    const timer = setTimeout(() => setIsRefreshing(false), 1500)
    return () => clearTimeout(timer)
  }, [isRefreshing])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-secondary/50 border-primary/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Flow Chart Diagram
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/50 text-white"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add the id="flow-chart-diagram" to this div */}
          <div id="flow-chart-diagram" className="bg-black/30 rounded-md p-8 flex flex-col items-center">
            <motion.div
              className="bg-gradient-to-r from-green-600/30 to-green-500/30 border border-green-500/50 rounded-md p-4 text-center text-white mb-4 w-48 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium">Start of Workflow</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ArrowDown className="text-primary h-6 w-6 my-2" />
            </motion.div>

            {submission.steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <div className="flex items-center gap-4 w-full max-w-2xl">
                  <motion.div
                    className="bg-gradient-to-r from-secondary/80 to-secondary/60 border border-primary/30 rounded-md p-4 text-white mb-2 flex-grow shadow-lg"
                    whileHover={{ scale: 1.02, borderColor: "rgba(0, 200, 83, 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-medium text-primary mb-1">{step.name}</div>
                    <div className="text-sm text-gray-300">{step.description}</div>
                    {step.tools && step.tools.length > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        <span className="text-primary">Tools:</span> {step.tools.join(", ")}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="bg-yellow-900/30 border border-yellow-500/30 rounded-md p-2 text-center text-white mb-2 text-sm min-w-[100px] shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-yellow-500 font-medium">Time</div>
                    <div>{step.timeEstimate || "?"} min</div>
                  </motion.div>
                </div>

                {index < submission.steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1.5) }}
                  >
                    <ArrowDown className="text-primary h-6 w-6 my-2" />
                  </motion.div>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (submission.steps.length + 1) }}
            >
              <ArrowDown className="text-primary h-6 w-6 my-2" />
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-blue-600/30 to-blue-500/30 border border-blue-500/50 rounded-md p-4 text-center text-white w-48 shadow-lg"
              whileHover={{ scale: 1.05 }}
              // transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (submission.steps.length + 2) }}
            >
              <span className="font-medium">End of Workflow</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
