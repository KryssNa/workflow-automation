"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useWorkflowStore } from "../store/workflow-store"
import { QuestionInput } from "./question-input"
import { Button } from "./ui/button"

export function WorkflowForm() {
  const {
    currentQuestions,
    updateAnswer,
    submitWorkflow,
    isEditing,
    isAnalyzing,
    currentPage,
    setCurrentPage,
    openModal,
    currentBusinessName,
    currentDepartmentName,
    currentWorkflowName,
  } = useWorkflowStore()

  const questionsPerPage = 4
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage)

  const currentPageQuestions = currentQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage,
  )

  useEffect(() => {
    if (!currentBusinessName) {
      openModal("business")
    } else if (!currentDepartmentName) {
      openModal("department")
    } else if (!currentWorkflowName) {
      openModal("workflow")
    }
  }, [currentBusinessName, currentDepartmentName, currentWorkflowName, openModal])

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    await submitWorkflow()
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        {currentPageQuestions.map((question, index) => (
          <QuestionInput
            key={question.id}
            id={question.id}
            question={question.question}
            answer={question.answer}
            onChange={updateAnswer}
            index={index}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0 || isAnalyzing}
          variant="outline"
          className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
        >
          Previous
        </Button>

        <div className="text-white">
          Page {currentPage + 1} of {totalPages}
        </div>

        {currentPage < totalPages - 1 ? (
          <Button
            onClick={handleNext}
            disabled={isAnalyzing}
            variant="outline"
            className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
