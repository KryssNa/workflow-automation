"use client"

import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { AlertTriangle, Check, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export function SyncStatus() {
  const [syncState, setSyncState] = useState<"synced" | "syncing" | "pending" | "error">("synced")
  const [pendingChanges, setPendingChanges] = useState(0)

  useEffect(() => {
    // This would be updated by the PWA service in a real implementation
    // For now, we'll simulate some sync activity
    const interval = setInterval(() => {
      // Randomly change sync state for demonstration
      const states: Array<"synced" | "syncing" | "pending" | "error"> = ["synced", "syncing", "pending", "error"]
      const randomState = states[Math.floor(Math.random() * states.length)]
      setSyncState(randomState)
      setPendingChanges(randomState === "pending" ? Math.floor(Math.random() * 5) + 1 : 0)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = () => {
    switch (syncState) {
      case "synced":
        return <Check className="h-4 w-4 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />
      case "pending":
        return <RefreshCw className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getText = () => {
    switch (syncState) {
      case "synced":
        return "All changes synced"
      case "syncing":
        return "Syncing changes..."
      case "pending":
        return `${pendingChanges} change${pendingChanges > 1 ? "s" : ""} pending`
      case "error":
        return "Sync error"
    }
  }

  const handleSync = () => {
    setSyncState("syncing")
    // Simulate sync
    setTimeout(() => {
      setSyncState("synced")
      setPendingChanges(0)
    }, 2000)
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-secondary/90 border border-primary/30 rounded-full px-3 py-1 flex items-center gap-2">
        {getIcon()}
        <span className="text-xs text-white">{getText()}</span>
        {(syncState === "pending" || syncState === "error") && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-primary hover:text-white hover:bg-primary/20 rounded-full"
            onClick={handleSync}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
