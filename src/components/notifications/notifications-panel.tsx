"use client"

import { Button } from "../ui/button"
import { useWorkflowStore } from "../../store/workflow-store"
import type { NotificationMessage } from "../../types"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Bell, Check, Info, X } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export function NotificationsPanel() {
  const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, removeNotification } =
    useWorkflowStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const notifications = getNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: NotificationMessage["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "error":
        return <X className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed top-4 right-4 z-10">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: -20, width: 0 }}
            animate={{ opacity: 1, y: 0, width: "auto" }}
            exit={{ opacity: 0, y: -20, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-secondary/90 border-primary/30 w-80 max-h-[500px] flex flex-col">
              <CardHeader className="p-3 flex flex-row items-center justify-between">
                <CardTitle className="text-white text-sm flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs p-1 text-gray-400 hover:text-white"
                      onClick={() => markAllNotificationsAsRead()}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                    <p className="text-xs">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/10">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-primary/10 transition-colors ${notification.read ? "opacity-60" : ""}`}
                        onClick={() => {
                          if (!notification.read) {
                            markNotificationAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                              <span className="text-xs text-gray-400">{formatDate(notification.timestamp)}</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                            {notification.action && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 h-7 text-xs p-1 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  notification.action?.onClick()
                                }}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              className="rounded-full bg-primary text-white hover:bg-primary/90 h-10 w-10 p-0 relative"
              onClick={() => setIsExpanded(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
