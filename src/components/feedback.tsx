"use client"

import type { WorkflowSubmission } from "../types"
import { motion } from "framer-motion"
import { AlertTriangle, Check, PenToolIcon as Tool } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface FeedbackProps {
  submission: WorkflowSubmission
}

export function Feedback({ submission }: FeedbackProps) {
  // This would be replaced with actual LLM integration
  const generateFeedback = () => {
    const workflowType = submission.questions[0]?.answer || "your workflow"

    return {
      suggestions: [
        `Consider using AI to automate the repetitive tasks in ${workflowType}`,
        "Implement a centralized data storage solution to reduce manual data entry",
        "Use workflow automation tools to streamline approval processes",
      ],
      aiTools: [
        {
          name: "Zapier",
          description: "Connect different apps and services, ensuring seamless initiation of tasks",
          cost: "Free plan available, Standard plan - $12/month, Professional - $30/month, Business - $60/month",
        },
        {
          name: "Otter.ai",
          description: "Use Otter.ai for transcription and Pipefy for customizable forms",
          cost: "Free plan available, Premium - $20/month",
        },
        {
          name: "Workato",
          description: "Use Workato's easy data mapping feature to organize API data",
          cost: "Custom pricing plans based on requirements",
        },
      ],
      bottlenecks: [
        "Manual data entry is time-consuming and error-prone",
        "Waiting for approvals creates significant delays",
        "Lack of centralized data storage leads to information silos",
      ],
    }
  }

  const feedback = generateFeedback()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-secondary/50 border-primary/30">
        <CardHeader>
          <CardTitle className="text-white">Analysis:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-white mb-4">
                To address the query effectively, let's break down the process into steps and identify the best tools
                and AI solutions for each step. Here's a structured approach to automating and improving the workflow:
              </p>

              <h3 className="text-primary font-medium mb-2">1. Understand the Manual Workflow</h3>
              <p className="text-white mb-2">Key Steps:</p>
              <ul className="list-disc pl-5 space-y-1 text-white mb-4">
                <li>Task Identification: Identify all tasks involved in the workflow.</li>
                <li>
                  Bottlenecks and Inefficiencies: Determine which steps are time-consuming, repetitive, or prone to
                  errors.
                </li>
                <li>Constraints: Note any budget, privacy, or technical limitations.</li>
              </ul>

              <h3 className="text-primary font-medium mb-2">2. Design the Step-by-Step AI & Automation Workflow</h3>

              {submission.steps.map((step, index) => (
                <div key={step.id} className="mb-4">
                  <h4 className="text-white font-medium">
                    Step {index + 1}: {step.name} and Initiation
                  </h4>
                  <p className="text-gray-400">Manual Action: {step.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-400 mr-2">Tool:</span>
                    <span className="text-primary">{feedback.aiTools[index % feedback.aiTools.length].name}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-400 mr-2">Improvement:</span>
                    <span className="text-white">Automate {step.name.toLowerCase()} using AI integration</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-primary font-medium mb-2">3. Identify Potential End-to-End AI Solutions</h3>
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

            <div>
              <h3 className="text-primary font-medium mb-2">4. Ensure Tools Are Up-to-Date</h3>
              <p className="text-white mb-2">Recent Tools:</p>
              <ul className="space-y-2 text-white">
                {feedback.aiTools.map((tool, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">{tool.name}:</span> {tool.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-primary font-medium mb-2">5. Customization Based on Industry & Constraints</h3>
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
