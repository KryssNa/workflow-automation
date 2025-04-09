"use client"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useWorkflowStore } from "../../store/workflow-store"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { useState } from "react"

export function CommentModal() {
  const { modalState, closeModal, addComment } = useWorkflowStore()
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = modalState.isOpen && modalState.type === "comment"
  const stepId = modalState.data?.stepId

  const handleSubmit = async () => {
    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      addComment({
        text: commentText,
        stepId,
      })

      setCommentText("")
      closeModal()
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
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
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Add Comment
            </h2>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={closeModal}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              className="bg-black/30 border-primary/30 text-white min-h-[120px]"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" className="border-primary/50 text-white" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? "Adding..." : "Add Comment"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
