"use client"

import { motion } from "framer-motion"
import { BarChart, Check, Copy, Download, LineChart, PieChart } from "lucide-react"
import { useState } from "react"
import { useWorkflowStore } from "../../store/workflow-store"
import type { WorkflowSubmission } from "../../types"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BarChart as BarChartComponent } from "./bar-chart"
import { LineChart as LineChartComponent } from "./line-chart"
import { PieChart as PieChartComponent } from "./pie-chart"

interface AdvancedCostAnalysisProps {
  submission: WorkflowSubmission
}

export function AdvancedCostAnalysis({ submission }: AdvancedCostAnalysisProps) {
  const { costAnalysis } = useWorkflowStore()
  const [isCopying, setIsCopying] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  if (!costAnalysis) return null

  const handleCopy = async () => {
    try {
      setIsCopying(true)

      const costText = `
Cost Differential Analysis Summary:
- Manual Workflow Cost: ${costAnalysis.manualWorkflowCost.toFixed(2)} per task
- AI-Assisted Workflow Cost: ${costAnalysis.aiAssistedWorkflowCost.toFixed(2)} per task
- Net Savings per Task: ${costAnalysis.netSavingsPerTask.toFixed(2)}

Projected Savings:
- Weekly (40 tasks): ${costAnalysis.weeklySavings.toFixed(2)}
- Monthly (160 tasks): ${costAnalysis.monthlySavings.toFixed(2)}
- Quarterly (480 tasks): ${costAnalysis.quarterlySavings.toFixed(2)}
- Yearly (1,920 tasks): ${costAnalysis.yearlySavings.toFixed(2)}
      `

      await navigator.clipboard.writeText(costText)
      setTimeout(() => setIsCopying(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      setIsCopying(false)
    }
  }

  const handleExport = () => {
    // In a real implementation, this would export the analysis to a CSV or PDF
    alert("Exporting analysis...")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-secondary/50 border-primary/30 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Advanced Cost Analysis</CardTitle>
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
            <Button size="sm" variant="outline" className="border-primary/50 text-white" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/30 mb-4">
              <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Summary
              </TabsTrigger>
              <TabsTrigger value="charts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Charts
              </TabsTrigger>
              <TabsTrigger value="roi" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                ROI Projection
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-0">
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
                    The use of AI in generating output with human review and editing significantly reduces operational
                    costs compared to manual workflows. By leveraging AI for repetitive tasks and automating processes
                    where possible, businesses can achieve substantial savings over various timeframes while maintaining
                    high accuracy through human oversight.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-md p-4">
                  <h3 className="text-primary font-medium mb-3 flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    Cost Comparison
                  </h3>
                  <div className="h-64">
                    <BarChartComponent
                      data={[
                        { name: "Manual", value: costAnalysis.manualWorkflowCost },
                        { name: "AI-Assisted", value: costAnalysis.aiAssistedWorkflowCost },
                      ]}
                    />
                  </div>
                </div>

                <div className="bg-black/30 rounded-md p-4">
                  <h3 className="text-primary font-medium mb-3 flex items-center">
                    <PieChart className="h-4 w-4 mr-2" />
                    Cost Distribution
                  </h3>
                  <div className="h-64">
                    <PieChartComponent
                      data={[
                        { name: "Manual Labor", value: costAnalysis.manualWorkflowCost * 0.8 },
                        { name: "Tools", value: costAnalysis.manualWorkflowCost * 0.15 },
                        { name: "Infrastructure", value: costAnalysis.manualWorkflowCost * 0.05 },
                      ]}
                    />
                  </div>
                </div>

                <div className="bg-black/30 rounded-md p-4 md:col-span-2">
                  <h3 className="text-primary font-medium mb-3 flex items-center">
                    <LineChart className="h-4 w-4 mr-2" />
                    Projected Savings Over Time
                  </h3>
                  <div className="h-64">
                    <LineChartComponent
                      data={[
                        { name: "Week 1", value: costAnalysis.weeklySavings },
                        { name: "Week 2", value: costAnalysis.weeklySavings * 2 },
                        { name: "Week 3", value: costAnalysis.weeklySavings * 3 },
                        { name: "Week 4", value: costAnalysis.weeklySavings * 4 },
                        { name: "Month 2", value: costAnalysis.monthlySavings * 2 },
                        { name: "Month 3", value: costAnalysis.monthlySavings * 3 },
                        { name: "Month 6", value: costAnalysis.quarterlySavings * 2 },
                        { name: "Year 1", value: costAnalysis.yearlySavings },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roi" className="mt-0">
              <div className="space-y-6">
                <div className="bg-black/30 rounded-md p-4">
                  <h3 className="text-primary font-medium mb-3">Return on Investment (ROI) Analysis</h3>
                  <p className="text-white mb-4">
                    Based on the cost analysis, we've calculated the ROI for implementing AI-assisted workflow
                    automation:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-primary/30">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-left py-2">Value</th>
                          <th className="text-left py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/20">
                          <td className="py-2">Implementation Cost</td>
                          <td className="py-2">$5,000</td>
                          <td className="py-2">One-time cost for setup and training</td>
                        </tr>
                        <tr className="border-b border-primary/20">
                          <td className="py-2">Annual Savings</td>
                          <td className="py-2">${costAnalysis.yearlySavings.toFixed(2)}</td>
                          <td className="py-2">Projected savings over one year</td>
                        </tr>
                        <tr className="border-b border-primary/20">
                          <td className="py-2">ROI (Year 1)</td>
                          <td className="py-2">{(((costAnalysis.yearlySavings - 5000) / 5000) * 100).toFixed(2)}%</td>
                          <td className="py-2">Return on investment in first year</td>
                        </tr>
                        <tr className="border-b border-primary/20">
                          <td className="py-2">Payback Period</td>
                          <td className="py-2">{(5000 / costAnalysis.monthlySavings).toFixed(1)} months</td>
                          <td className="py-2">Time to recoup implementation cost</td>
                        </tr>
                        <tr>
                          <td className="py-2">5-Year Net Benefit</td>
                          <td className="py-2">${(costAnalysis.yearlySavings * 5 - 5000).toFixed(2)}</td>
                          <td className="py-2">Total savings over 5 years minus implementation cost</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary font-medium mb-3">Additional Benefits</h3>
                  <ul className="space-y-2 text-white list-disc pl-5">
                    <li>Reduced error rates by an estimated 35%</li>
                    <li>Improved employee satisfaction by reducing repetitive tasks</li>
                    <li>Faster turnaround times for workflow completion</li>
                    <li>Scalability to handle increased workload without proportional cost increase</li>
                    <li>Better data collection for continuous process improvement</li>
                  </ul>
                </div>

                <div className="bg-black/30 rounded-md p-4">
                  <h3 className="text-primary font-medium mb-3">Implementation Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white text-sm font-medium">Phase 1: Setup (Weeks 1-2)</h4>
                      <p className="text-gray-300 text-sm">Initial configuration and integration of AI tools</p>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">Phase 2: Training (Weeks 3-4)</h4>
                      <p className="text-gray-300 text-sm">Staff training and workflow adjustment period</p>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">Phase 3: Optimization (Months 2-3)</h4>
                      <p className="text-gray-300 text-sm">Fine-tuning processes and addressing feedback</p>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">Phase 4: Full Deployment (Month 4+)</h4>
                      <p className="text-gray-300 text-sm">Complete transition to AI-assisted workflow</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
