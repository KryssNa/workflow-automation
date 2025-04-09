"use client"

import { Button } from "../ui/button"
import { useWorkflowStore } from "../../store/workflow-store"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

export function ConfirmationModal() {
  const { modalState, closeModal } = useWorkflowStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = modalState.isOpen && modalState.type === "confirmation"
  const { title, message, onConfirm } = modalState.data || {}

  const handleConfirm = async () => {
    if (!onConfirm) return

    setIsSubmitting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error during confirmation action:", error)
    } finally {
      setIsSubmitting(false)
      closeModal()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          className="bg-secondary/90 border-2 border-primary rounded-3xl p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              {title || "Confirm Action"}
            </h2>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={closeModal}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-white">{message || "Are you sure you want to proceed with this action?"}</p>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" className="border-primary/50 text-white" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
