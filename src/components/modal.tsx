"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, FileDown, FileText, ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useWorkflowStore } from "../store/workflow-store"
import type { ExportFormat } from "../types"
import { Alert, AlertDescription } from "./ui/alert"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function Modal() {
  const {
    modalState,
    closeModal,
    saveModal,
    businesses,
    setBusinessName,
    setDepartmentName,
    setWorkflowName,
    currentBusinessName,
    currentDepartmentName,
    currentWorkflowName,
    setExportFormat,
    selectedExportFormat,
    submissions,
  } = useWorkflowStore()

  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("")
  const [newName, setNewName] = useState<string>("")
  const [validationError, setValidationError] = useState<string>("")
  const [recentWorkflows, setRecentWorkflows] = useState<string[]>([])

  // Initialize values on modal open
  useEffect(() => {
    if (modalState.isOpen) {
      // Clear any previous validation errors
      setValidationError("")

      // Set initial values based on modal type
      if (modalState.type === "business") {
        setNewName(currentBusinessName || "")
        setSelectedBusiness("")
      } else if (modalState.type === "department") {
        setNewName(currentDepartmentName || "")
        setSelectedDepartment("")
      } else if (modalState.type === "workflow") {
        setNewName(currentWorkflowName || "")
        setSelectedWorkflow("")

        // Get recent workflow names for the dropdown
        const workflowNames = submissions
          .slice(-5)
          .map(sub => sub.name)
          .filter((name, index, self) => self.indexOf(name) === index) // Unique names only

        setRecentWorkflows(workflowNames)
      }
    }
  }, [modalState, currentBusinessName, currentDepartmentName, currentWorkflowName, submissions])

  // Add custom CSS styles for the dropdowns
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Override Select dropdown styles */
      .custom-select-content {
        background-color: #1a1a1a !important;
        border: 1px solid var(--primary) !important;
        color: white !important;
        z-index: 9999 !important;
        border-radius: 0.5rem !important;
        overflow: hidden !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
        padding: 0.5rem !important;
      }

      [data-radix-select-item] {
        color: white !important;
        background-color: transparent !important;
        padding: 0.5rem 0.75rem !important;
        border-radius: 0.25rem !important;
        margin: 0.1rem 0 !important;
        cursor: pointer !important;
        font-size: 0.875rem !important;
      }

      [data-radix-select-item]:hover,
      [data-radix-select-item][data-highlighted] {
        background-color: rgba(139, 92, 246, 0.2) !important;
        color: white !important;
      }

      .custom-select-label {
        color: #9ca3af !important;
        font-size: 0.75rem !important;
        padding: 0.25rem 0.75rem !important;
        margin-top: 0.25rem !important;
      }

      /* Fix for z-index stacking issues */
      .select-wrapper {
        position: relative !important;
        z-index: 999 !important;
      }

      /* Fix for overlay */
      [data-radix-popper-content-wrapper] {
        z-index: 9999 !important; 
      }

      .radix-select-content {
        background-color: #1a1a1a !important;
        color: white !important;
      }
    `;

    // Add to document head
    document.head.appendChild(styleEl);

    // Cleanup function to remove style element when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const validateInput = (): boolean => {
    // Check if either a selection was made or a new name was entered
    if (modalState.type === "business") {
      if (!selectedBusiness && !newName.trim()) {
        setValidationError("Please select or enter a business name")
        return false
      }
    } else if (modalState.type === "department") {
      if (!selectedDepartment && !newName.trim()) {
        setValidationError("Please select or enter a department name")
        return false
      }
    } else if (modalState.type === "workflow") {
      if (!selectedWorkflow && !newName.trim()) {
        setValidationError("Please select or enter a workflow name")
        return false
      }
    }

    // Input is valid
    setValidationError("")
    return true
  }

  const handleSave = () => {
    // Validate input before saving
    if (!validateInput()) {
      return
    }

    if (modalState.type === "business") {
      const valueToSave = selectedBusiness || newName.trim();
      setBusinessName(valueToSave);
    } else if (modalState.type === "department") {
      const valueToSave = selectedDepartment || newName.trim();
      setDepartmentName(valueToSave);
    } else if (modalState.type === "workflow") {
      const valueToSave = selectedWorkflow || newName.trim();
      setWorkflowName(valueToSave);
    }

    saveModal();
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
        return "Enter your business name"
      case "department":
        return "Enter department name"
      case "workflow":
        return "Enter workflow name"
      default:
        return ""
    }
  }

  const getButtonText = () => {
    if (modalState.type === "workflow") {
      return "Save";
    } else if (modalState.type === "business" || modalState.type === "department") {
      return "Next";
    }
    return "Save";
  };

  if (!modalState.isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
        <motion.div
          className="bg-gray-900 border-2 border-primary rounded-3xl p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">{getTitle()}</h2>

          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive" className="bg-red-900/30 border-red-500/50 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

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
              <div className="relative select-wrapper">
                <p className="text-white mb-2">
                  {modalState.type === "business" && "Choose saved business:"}
                  {modalState.type === "department" && "Choose department:"}
                  {modalState.type === "workflow" && "Choose from recent workflows:"}
                </p>

                <Select
                  onValueChange={(value) => {
                    if (modalState.type === "business") {
                      setSelectedBusiness(value)
                      setNewName("")  // Clear the custom input when selecting from dropdown
                    }
                    if (modalState.type === "department") {
                      setSelectedDepartment(value)
                      setNewName("")
                    }
                    if (modalState.type === "workflow") {
                      setSelectedWorkflow(value)
                      setNewName("")
                    }
                    // Clear any validation errors when a selection is made
                    setValidationError("")
                  }}
                  value={
                    modalState.type === "business"
                      ? selectedBusiness
                      : modalState.type === "department"
                        ? selectedDepartment
                        : selectedWorkflow
                  }
                >
                  <SelectTrigger className="w-full bg-gray-800 border-primary text-white">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>

                  <SelectContent
                    className="custom-select-content"
                    position="popper"
                    sideOffset={5}
                  >
                    {modalState.type === "business" &&
                      businesses.map((business) => (
                        <SelectItem
                          key={business.name}
                          value={business.name}
                          className="hover:bg-primary/20 hover:text-white"
                        >
                          {business.name}
                        </SelectItem>
                      ))}

                    {modalState.type === "department" &&
                      businesses
                        .find((b) => b.name === currentBusinessName)
                        ?.departments.map((dept) => (
                          <SelectItem
                            key={dept}
                            value={dept}
                            className="hover:bg-primary/20 hover:text-white"
                          >
                            {dept}
                          </SelectItem>
                        ))}

                    {modalState.type === "workflow" && (
                      <>
                        {recentWorkflows.length > 0 && (
                          <div className="px-2 py-1.5 text-xs text-gray-400">Recent Workflows</div>
                        )}
                        {recentWorkflows.map((name) => (
                          <SelectItem
                            key={name}
                            value={name}
                            className="hover:bg-primary/20 hover:text-white"
                          >
                            {name}
                          </SelectItem>
                        ))}
                        {recentWorkflows.length > 0 && (
                          <div className="px-2 py-1.5 text-xs text-gray-400">Suggested Workflows</div>
                        )}
                        <SelectItem
                          value="Data Entry Automation"
                          className="hover:bg-primary/20 hover:text-white"
                        >
                          Data Entry Automation
                        </SelectItem>
                        <SelectItem
                          value="Customer Support Workflow"
                          className="hover:bg-primary/20 hover:text-white"
                        >
                          Customer Support Workflow
                        </SelectItem>
                        <SelectItem
                          value="Content Creation"
                          className="hover:bg-primary/20 hover:text-white"
                        >
                          Content Creation
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-white mb-2">
                  {modalState.type === "business" && "Or, write a new business name:"}
                  {modalState.type === "department" && "Or, create a department name:"}
                  {modalState.type === "workflow" && "Or, give your workflow a name:"}
                </p>
                <Input
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value)
                    // Clear the dropdown selection when typing a custom name
                    if (modalState.type === "business") setSelectedBusiness("")
                    if (modalState.type === "department") setSelectedDepartment("")
                    if (modalState.type === "workflow") setSelectedWorkflow("")
                    // Clear any validation errors when typing
                    if (e.target.value.trim()) setValidationError("")
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full bg-transparent border-1 border-primary text-white rounded-md p-4"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                >
                  {getButtonText()}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}