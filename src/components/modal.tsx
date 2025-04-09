"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useWorkflowStore } from "../store/workflow-store"
import type { ExportFormat } from "../types"
import { AnimatePresence, motion } from "framer-motion"
import { FileDown, FileText, ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function Modal() {
  const {
    modalState,
    closeModal,
    businesses,
    setBusinessName,
    setDepartmentName,
    setWorkflowName,
    currentBusinessName,
    currentDepartmentName,
    currentWorkflowName,
    setExportFormat,
    selectedExportFormat,
  } = useWorkflowStore()

  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("")
  const [newName, setNewName] = useState<string>("")

  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.type === "business") {
        setNewName(currentBusinessName)
      } else if (modalState.type === "department") {
        setNewName(currentDepartmentName)
      } else if (modalState.type === "workflow") {
        setNewName(currentWorkflowName)
      }
    }
  }, [modalState, currentBusinessName, currentDepartmentName, currentWorkflowName])

  const handleSave = () => {
    if (modalState.type === "business") {
      if (selectedBusiness) {
        setBusinessName(selectedBusiness)
      } else if (newName) {
        setBusinessName(newName)
      }
    } else if (modalState.type === "department") {
      if (selectedDepartment) {
        setDepartmentName(selectedDepartment)
      } else if (newName) {
        setDepartmentName(newName)
      }
    } else if (modalState.type === "workflow") {
      if (selectedWorkflow) {
        setWorkflowName(selectedWorkflow)
      } else if (newName) {
        setWorkflowName(newName)
      }
    }

    closeModal()
  }

  const handleExportSelect = (format: ExportFormat) => {
    setExportFormat(format)
    closeModal()
  }

  const getTitle = () => {
    switch (modalState.type) {
      case "business":
        return "What's the name of this business?"
      case "department":
        return "What's the name of the department?"
      case "workflow":
        return "What's the name of the workflow?"
      case "export":
        return "Choose export format"
      default:
        return ""
    }
  }

  const getPlaceholder = () => {
    switch (modalState.type) {
      case "business":
        return "Enter your business name."
      case "department":
        return "Enter department name..."
      case "workflow":
        return "Enter workflow name..."
      default:
        return ""
    }
  }

  if (!modalState.isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          className="bg-transparent border-2 border-primary rounded-3xl p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">{getTitle()}</h2>

          {modalState.type === "export" ? (
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => handleExportSelect("pdf")}
                className="flex flex-col items-center justify-center p-6 bg-transparent border-2 border-primary hover:bg-primary/20 text-white rounded-xl"
              >
                <FileDown className="h-10 w-10 mb-2" />
                <span>PDF</span>
              </Button>
              <Button
                onClick={() => handleExportSelect("text")}
                className="flex flex-col items-center justify-center p-6 bg-transparent border-2 border-primary hover:bg-primary/20 text-white rounded-xl"
              >
                <FileText className="h-10 w-10 mb-2" />
                <span>Text</span>
              </Button>
              <Button
                onClick={() => handleExportSelect("png")}
                className="flex flex-col items-center justify-center p-6 bg-transparent border-2 border-primary hover:bg-primary/20 text-white rounded-xl"
              >
                <ImageIcon className="h-10 w-10 mb-2" />
                <span>Image</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-white mb-2">
                  {modalState.type === "business" && "Choose saved business:"}
                  {modalState.type === "department" && "Choose department:"}
                  {modalState.type === "workflow" && "Choose workflow:"}
                </p>
                <Select
                  onValueChange={(value) => {
                    if (modalState.type === "business") setSelectedBusiness(value)
                    if (modalState.type === "department") setSelectedDepartment(value)
                    if (modalState.type === "workflow") setSelectedWorkflow(value)
                  }}
                >
                  <SelectTrigger className="w-full bg-white/10 border-primary text-white">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modalState.type === "business" &&
                      businesses.map((business) => (
                        <SelectItem key={business.name} value={business.name}>
                          {business.name}
                        </SelectItem>
                      ))}
                    {modalState.type === "department" &&
                      businesses
                        .find((b) => b.name === currentBusinessName)
                        ?.departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                    {modalState.type === "workflow" && (
                      <>
                        <SelectItem value="Data Entry Automation">Data Entry Automation</SelectItem>
                        <SelectItem value="Customer Support Workflow">Customer Support Workflow</SelectItem>
                        <SelectItem value="Content Creation">Content Creation</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-white mb-2">
                  {modalState.type === "business" && "Or, write a new business name:"}
                  {modalState.type === "department" && "Or, Create a department name:"}
                  {modalState.type === "workflow" && "Or, Give your workflow a name:"}
                </p>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full bg-transparent border-2 border-primary text-white rounded-full p-4"
                />
              </div>

              <div className="flex justify-between pt-4">
                {modalState.type === "business" && (
                  <Button
                    onClick={() => (window.location.href = "/my-workflows")}
                    className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                  >
                    My workflows
                  </Button>
                )}

                <Button
                  onClick={handleSave}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 ml-auto"
                >
                  {modalState.type === "workflow" ? "Save" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
