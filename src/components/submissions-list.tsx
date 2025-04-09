"use client"

import { Button } from "./ui/button"
import { useWorkflowStore } from "../store/workflow-store"
import { motion } from "framer-motion"
import { SubmissionCard } from "./submission-card"

export function SubmissionsList() {
  const { submissions, resetForm } = useWorkflowStore()

  const handleNewWorkflow = () => {
    resetForm()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex justify-between items-center"
      >
        <h2 className="text-2xl font-bold text-white">Your Workflow Submissions</h2>
        <Button onClick={handleNewWorkflow} className="bg-primary text-white hover:bg-primary/90">
          New Workflow
        </Button>
      </motion.div>

      {submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No submissions yet. Start by creating a new workflow.</p>
        </motion.div>
      ) : (
        <div>
          {submissions.map((submission, index) => (
            <SubmissionCard key={submission.id} submission={submission} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
