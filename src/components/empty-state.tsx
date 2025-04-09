"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="text-4xl">👀</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">*Once you create a workflow, it will appear here.</h2>
        <p className="text-gray-400">Click the "Create New" button to start one.</p>
      </div>

      <Button
        onClick={onCreateNew}
        className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-6 text-lg"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Create new workflow
      </Button>
    </motion.div>
  )
}
