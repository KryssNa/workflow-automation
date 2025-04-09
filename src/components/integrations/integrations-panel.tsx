"use client"

import { Button } from "../ui/button"
import { integrationService } from "../../services/integration-service"
import { useWorkflowStore } from "../../store/workflow-store"
import { motion } from "framer-motion"
import { Check, ExternalLink, Plus, Settings, X } from "lucide-react"
import { useState } from "react"
import { IntegrationCard } from "./integration-card"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function IntegrationsPanel() {
  const { getIntegrations, addIntegration, updateIntegration, removeIntegration, openModal } = useWorkflowStore()
  const [isAddingNew, setIsAddingNew] = useState(false)

  const integrations = getIntegrations()
  const availableIntegrationTypes = integrationService.getAvailableIntegrationTypes()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-secondary/50 border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Integrations</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/50 text-white"
            onClick={() => setIsAddingNew(!isAddingNew)}
          >
            {isAddingNew ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {isAddingNew ? "Cancel" : "Add Integration"}
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingNew ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrationTypes.map((type) => {
                const template = integrationService.getIntegrationTemplate(type)
                if (!template) return null

                return (
                  <Card
                    key={type}
                    className="bg-black/30 border-primary/20 hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => {
                      openModal("integration", { type })
                      setIsAddingNew(false)
                    }}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-white font-medium">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">Click to configure</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <>
              {integrations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No Integrations Yet</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Connect your workflow to other tools and services to automate your processes.
                  </p>
                  <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setIsAddingNew(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Integration
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onEdit={() => openModal("integration", { id: integration.id })}
                      onDelete={() => removeIntegration(integration.id)}
                      onToggle={() => updateIntegration(integration.id, { enabled: !integration.enabled })}
                    />
                  ))}
                </div>
              )}

              {integrations.length > 0 && (
                <div className="mt-6 border-t border-primary/20 pt-4">
                  <h3 className="text-white font-medium mb-3">Integration Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="border-primary/50 text-white justify-start"
                      onClick={() => {
                        // Open documentation
                        window.open("https://docs.aiclonehub.com/integrations", "_blank")
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary/50 text-white justify-start"
                      onClick={() => {
                        // Test all integrations
                        integrations.forEach((integration) => {
                          if (integration.enabled) {
                            // Test integration
                          }
                        })
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Test All Integrations
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
