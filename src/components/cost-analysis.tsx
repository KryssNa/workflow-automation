"use client"

import { Button } from "./ui/button"
import { useWorkflowStore } from "../store/workflow-store"
import { motion } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function CostAnalysis() {
  const { costAnalysis } = useWorkflowStore()
  const [isCopying, setIsCopying] = useState(false)

  if (!costAnalysis) return null

  const handleCopy = async () => {
    try {
      setIsCopying(true)

      const costText = `
Cost Differential Analysis Summary:
- Manual Workflow Cost: $${costAnalysis.manualWorkflowCost.toFixed(2)} per task
- AI-Assisted Workflow Cost: $${costAnalysis.aiAssistedWorkflowCost.toFixed(2)} per task
- Net Savings per Task: $${costAnalysis.netSavingsPerTask.toFixed(2)}

Projected Savings:
- Weekly (40 tasks): $${costAnalysis.weeklySavings.toFixed(2)}
- Monthly (160 tasks): $${costAnalysis.monthlySavings.toFixed(2)}
- Quarterly (480 tasks): $${costAnalysis.quarterlySavings.toFixed(2)}
- Yearly (1,920 tasks): $${costAnalysis.yearlySavings.toFixed(2)}
      `

      await navigator.clipboard.writeText(costText)
      setTimeout(() => setIsCopying(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      setIsCopying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-secondary/50 border-primary/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Cost Differential Analysis</CardTitle>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-primary font-medium mb-3">Cost Differential Analysis Summary</h3>
              <ul className="space-y-2 text-white">
                <li className="flex justify-between">
                  <span>Manual Workflow Cost:</span>
                  <span>${costAnalysis.manualWorkflowCost.toFixed(2)} per task</span>
                </li>
                <li className="flex justify-between">
                  <span>AI-Assisted Workflow Cost:</span>
                  <span>${costAnalysis.aiAssistedWorkflowCost.toFixed(2)} per task</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span>Net Savings per Task:</span>
                  <span>${costAnalysis.netSavingsPerTask.toFixed(2)}</span>
                </li>
              </ul>
            </div>

            <div className="bg-black/30 rounded-md p-4">
              <h3 className="text-primary font-medium mb-3">Projected Savings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left py-2">Timeframe</th>
                      <th className="text-left py-2">Number of Tasks</th>
                      <th className="text-left py-2">Manual Cost</th>
                      <th className="text-left py-2">AI-Assisted Cost</th>
                      <th className="text-left py-2">Net Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-primary/20">
                      <td className="py-2">Weekly</td>
                      <td className="py-2">40</td>
                      <td className="py-2">${(costAnalysis.manualWorkflowCost * 40).toFixed(2)}</td>
                      <td className="py-2">${(costAnalysis.aiAssistedWorkflowCost * 40).toFixed(2)}</td>
                      <td className="py-2">${costAnalysis.weeklySavings.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-primary/20">
                      <td className="py-2">Monthly</td>
                      <td className="py-2">160</td>
                      <td className="py-2">${(costAnalysis.manualWorkflowCost * 160).toFixed(2)}</td>
                      <td className="py-2">${(costAnalysis.aiAssistedWorkflowCost * 160).toFixed(2)}</td>
                      <td className="py-2">${costAnalysis.monthlySavings.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-primary/20">
                      <td className="py-2">Quarterly</td>
                      <td className="py-2">480</td>
                      <td className="py-2">${(costAnalysis.manualWorkflowCost * 480).toFixed(2)}</td>
                      <td className="py-2">${(costAnalysis.aiAssistedWorkflowCost * 480).toFixed(2)}</td>
                      <td className="py-2">${costAnalysis.quarterlySavings.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Yearly</td>
                      <td className="py-2">1,920</td>
                      <td className="py-2">${(costAnalysis.manualWorkflowCost * 1920).toFixed(2)}</td>
                      <td className="py-2">${(costAnalysis.aiAssistedWorkflowCost * 1920).toFixed(2)}</td>
                      <td className="py-2">${costAnalysis.yearlySavings.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-primary font-medium mb-3">Conclusion</h3>
              <p className="text-white">
                The use of AI in generating output with human review and editing significantly reduces operational costs
                compared to manual workflows. By leveraging AI for repetitive tasks and automating processes where
                possible, businesses can achieve substantial savings over various timeframes while maintaining high
                accuracy through human oversight.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
