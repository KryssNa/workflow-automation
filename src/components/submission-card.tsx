"use client"

import { Button } from "./ui/button"
import { useWorkflowStore } from "../store/workflow-store"
import type { WorkflowSubmission } from "../types"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface SubmissionCardProps {
  submission: WorkflowSubmission
  index: number
}

export function SubmissionCard({ submission, index }: SubmissionCardProps) {
  const { editSubmission } = useWorkflowStore()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-secondary/50 border-primary/30 mb-4">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            <span>Workflow Submission</span>
            <span className="text-sm font-normal text-gray-400">{formatDate(submission.createdAt)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submission.questions.slice(0, 3).map((q) => (
              <div key={q.id} className="space-y-1">
                <h3 className="text-primary font-medium">{q.question}</h3>
                <p className="text-white text-sm">{q.answer || "No answer provided"}</p>
              </div>
            ))}

            {submission.questions.length > 3 && (
              <p className="text-gray-400 text-sm">+{submission.questions.length - 3} more questions</p>
            )}

            <Button
              onClick={() => editSubmission(submission.id)}
              variant="outline"
              className="mt-4 border-primary text-white hover:bg-primary/20"
            >
              Edit Submission
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
