"use client"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Switch } from "../ui/switch"
import type { IntegrationConfig } from "../../types"
import { ExternalLink, Settings, Trash2 } from "lucide-react"

interface IntegrationCardProps {
  integration: IntegrationConfig
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}

export function IntegrationCard({ integration, onEdit, onDelete, onToggle }: IntegrationCardProps) {
  return (
    <Card className={`bg-black/30 border-primary/20 ${integration.enabled ? "" : "opacity-60"}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-medium">{integration.name}</h3>
              <p className="text-gray-400 text-xs">
                {integration.lastSynced
                  ? `Last synced: ${new Date(integration.lastSynced).toLocaleString()}`
                  : "Not synced yet"}
              </p>
            </div>
          </div>
          <Switch checked={integration.enabled} onCheckedChange={onToggle} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="border-primary/50 text-white h-8" onClick={onEdit}>
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-primary/50 text-white h-8"
            onClick={() => {
              // Open external link to integration
              window.open(integration.config.webhookUrl || "#", "_blank")
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
          <Button size="sm" variant="outline" className="border-destructive/50 text-destructive h-8" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
