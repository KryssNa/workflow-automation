import type { NotificationMessage } from "../types"
import { v4 as uuidv4 } from "uuid"

class NotificationService {
  private notifications: NotificationMessage[] = []
  private listeners: ((notifications: NotificationMessage[]) => void)[] = []

  constructor() {
    // Load notifications from localStorage
    this.loadNotifications()
  }

  private loadNotifications() {
    try {
      const savedNotifications = localStorage.getItem("notifications")
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      this.notifications = []
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem("notifications", JSON.stringify(this.notifications))
      this.notifyListeners()
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener([...this.notifications])
    })
  }

  public addListener(listener: (notifications: NotificationMessage[]) => void): () => void {
    this.listeners.push(listener)

    // Return function to remove listener
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index !== -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  public getNotifications(): NotificationMessage[] {
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length
  }

  public addNotification(
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
    action?: { label: string; onClick: () => void },
  ): NotificationMessage {
    const notification: NotificationMessage = {
      id: uuidv4(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      action,
    }

    this.notifications.unshift(notification)

    // Limit to 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    this.saveNotifications()

    return notification
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id)

    if (notification) {
      notification.read = true
      this.saveNotifications()
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.read = true
    })

    this.saveNotifications()
  }

  public removeNotification(id: string): void {
    const index = this.notifications.findIndex((n) => n.id === id)

    if (index !== -1) {
      this.notifications.splice(index, 1)
      this.saveNotifications()
    }
  }

  public clearAll(): void {
    this.notifications = []
    this.saveNotifications()
  }
}

// Singleton instance
export const notificationService = new NotificationService()
