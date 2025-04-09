"use client"

import { Card, CardContent } from "./ui/card"
import type { WorkflowSubmission } from "../types"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"

interface WorkflowSummaryProps {
  submission: WorkflowSubmission
  onClick: () => void
}

export function WorkflowSummary({ submission, onClick }: WorkflowSummaryProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="bg-black/30 border-primary/20 hover:border-primary cursor-pointer transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <h3 className="text-white font-medium text-lg mb-2">{submission.name}</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{submission.analysis?.substring(0, 120)}...</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(submission.createdAt)}</span>
            </div>
            <div className="flex items-center text-gray-400 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{submission.steps.length} steps</span>
            </div>
            <div className="text-primary text-xs flex items-center">
              View Details
              <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
