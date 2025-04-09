"use client"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { integrationService } from "../../services/integration-service"
import { useWorkflowStore } from "../../store/workflow-store"
import { AnimatePresence, motion } from "framer-motion"
import { Settings, X } from "lucide-react"
import { useEffect, useState } from "react"

export function IntegrationModal() {
  const { modalState, closeModal, addIntegration, updateIntegration, getIntegrations } = useWorkflowStore()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = modalState.isOpen && modalState.type === "integration"
  const integrationType = modalState.data?.type
  const integrationId = modalState.data?.id

  // Get integration template or existing integration
  useEffect(() => {
    if (!isOpen) return

    if (integrationId) {
      // Editing existing integration
      const integration = getIntegrations().find((i) => i.id === integrationId)
      if (integration) {
        setFormData(integration.config)
      }
    } else if (integrationType) {
      // Creating new integration
      const template = integrationService.getIntegrationTemplate(integrationType)
      if (template && template.config) {
        setFormData(template.config as Record<string, string>)
      }
    }
  }, [isOpen, integrationType, integrationId, getIntegrations])

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      if (integrationId) {
        // Update existing integration
        await updateIntegration(integrationId, { config: formData })
      } else if (integrationType) {
        // Create new integration
        await addIntegration(integrationType, formData)
      }

      closeModal()
    } catch (error) {
      console.error("Error saving integration:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const getTitle = () => {
    if (integrationId) {
      const integration = getIntegrations().find((i) => i.id === integrationId)
      return `Edit ${integration?.name || "Integration"}`
    } else if (integrationType) {
      const template = integrationService.getIntegrationTemplate(integrationType)
      return `Add ${template?.name || "Integration"}`
    }
    return "Configure Integration"
  }

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
              <Settings className="h-5 w-5 mr-2 text-primary" />
              {getTitle()}
            </h2>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={closeModal}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="text-white capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="bg-black/30 border-primary/30 text-white mt-1"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" className="border-primary/50 text-white" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : integrationId ? "Update" : "Add Integration"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
