"use client"

import { Avatar, AvatarFallback } from ".ui/avatar"
import { Button } from ".ui/button"
import { useWorkflowStore } from "@/store/workflow-store"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface CollaboratorsPanelProps {
  submissionId: string
}

export function CollaboratorsPanel({ submissionId }: CollaboratorsPanelProps) {
  const { activeCollaborators } = useWorkflowStore()
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // This would be updated by the collaboration service in a real implementation
  }, [submissionId])

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, width: 0 }}
            animate={{ opacity: 1, y: 0, width: "auto" }}
            exit={{ opacity: 0, y: 20, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-secondary/90 border-primary/30 w-64">
              <CardHeader className="p-3 flex flex-row items-center justify-between">
                <CardTitle className="text-white text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Collaborators
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {activeCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full bg-green-500"
                        style={{ backgroundColor: collaborator.color }}
                      />
                      <Avatar className="h-6 w-6">
                        <AvatarFallback style={{ backgroundColor: collaborator.color }} className="text-xs text-white">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white">{collaborator.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => {
                      // Open comments panel
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="rounded-full bg-primary text-white hover:bg-primary/90 h-12 w-12 p-0 relative"
              onClick={() => setIsExpanded(true)}
            >
              <Users className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeCollaborators.length}
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
