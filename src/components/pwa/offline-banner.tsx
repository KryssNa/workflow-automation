"use client"

import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Button } from "../ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      // Hide the banner after 5 seconds
      setTimeout(() => setShowBanner(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 z-50 max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <Alert className={isOnline ? "bg-green-900/80 border-green-500" : "bg-red-900/80 border-red-500"}>
          <div className="flex items-start">
            <div className="mr-4 mt-0.5">
              {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            </div>
            <div className="flex-1">
              <AlertTitle className="text-white">{isOnline ? "You're back online!" : "You're offline"}</AlertTitle>
              <AlertDescription className="text-gray-300">
                {isOnline
                  ? "Your changes will now be synchronized with the server."
                  : "Don't worry, you can still view and edit your workflows. Changes will be synchronized when you're back online."}
              </AlertDescription>
              <div className="mt-3 flex gap-2">
                {isOnline && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-white hover:bg-green-500/20"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className={`border-${isOnline ? "green" : "red"}-500 text-white hover:bg-${isOnline ? "green" : "red"
                    }-500/20`}
                  onClick={handleDismiss}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}
