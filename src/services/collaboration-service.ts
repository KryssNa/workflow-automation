import type { Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
import type { Comment } from "../types"

// In a real implementation, this would be your WebSocket server URL
const SOCKET_URL =""

interface CollaborationUser {
  id: string
  name: string
  avatar?: string
  color: string
}

interface CollaborationEvent {
  type: "join" | "leave" | "edit" | "comment" | "cursor"
  user: CollaborationUser
  data?: any
  timestamp: number
}

class CollaborationService {
  private socket: Socket | null = null
  private workflowId: string | null = null
  private user: CollaborationUser | null = null
  private eventListeners: Map<string, ((event: CollaborationEvent) => void)[]> = new Map()
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null

  // For offline support
  private offlineEvents: CollaborationEvent[] = []
  private isOnline: boolean = navigator.onLine

  constructor() {
    // Listen for online/offline events
    window.addEventListener("online", this.handleOnline)
    window.addEventListener("offline", this.handleOffline)
  }

  private handleOnline = () => {
    this.isOnline = true
    this.syncOfflineEvents()
  }

  private handleOffline = () => {
    this.isOnline = false
  }

  private syncOfflineEvents() {
    if (this.isOnline && this.connected && this.offlineEvents.length > 0) {
      // Send all offline events to the server
      this.offlineEvents.forEach((event) => {
        this.socket?.emit("event", {
          workflowId: this.workflowId,
          event,
        })
      })
      this.offlineEvents = []
    }
  }

  public init(workflowId: string, userName: string, userAvatar?: string) {
    this.workflowId = workflowId

    // Generate a random color for the user
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A8", "#33FFF6"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    this.user = {
      id: uuidv4(),
      name: userName,
      avatar: userAvatar,
      color: randomColor,
    }

    // In a real implementation, this would connect to your WebSocket server
    // For now, we'll simulate the connection
    this.simulateConnection()
  }

  private simulateConnection() {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true
      this.triggerEvent("connection", {
        type: "join",
        user: this.user!,
        timestamp: Date.now(),
      })

      // Sync any offline events
      this.syncOfflineEvents()
    }, 1000)
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.connected = false
    this.workflowId = null
    this.user = null
    this.eventListeners.clear()

    window.removeEventListener("online", this.handleOnline)
    window.removeEventListener("offline", this.handleOffline)
  }

  public on(event: string, callback: (event: CollaborationEvent) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  public off(event: string, callback: (event: CollaborationEvent) => void) {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private triggerEvent(event: string, data: CollaborationEvent) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach((callback) => {
        callback(data)
      })
    }

    // Also trigger "all" event listeners
    if (this.eventListeners.has("all")) {
      this.eventListeners.get("all")!.forEach((callback) => {
        callback(data)
      })
    }
  }

  public sendEdit(path: string, value: any) {
    const event: CollaborationEvent = {
      type: "edit",
      user: this.user!,
      data: { path, value },
      timestamp: Date.now(),
    }

    if (!this.isOnline) {
      // Store event for later sync
      this.offlineEvents.push(event)
      return
    }

    if (this.socket && this.connected) {
      this.socket.emit("event", {
        workflowId: this.workflowId,
        event,
      })
    } else {
      // Simulate sending event
      setTimeout(() => {
        this.triggerEvent("edit", event)
      }, 100)
    }
  }

  public sendComment(comment: Omit<Comment, "id" | "user" | "timestamp">) {
    const newComment: Comment = {
      id: uuidv4(),
      user: {
        id: this.user!.id,
        name: this.user!.name,
        avatar: this.user!.avatar,
        color: this.user!.color,
      },
      ...comment,
      timestamp: new Date(),
    }

    const event: CollaborationEvent = {
      type: "comment",
      user: this.user!,
      data: newComment,
      timestamp: Date.now(),
    }

    if (!this.isOnline) {
      // Store event for later sync
      this.offlineEvents.push(event)
      return newComment
    }

    if (this.socket && this.connected) {
      this.socket.emit("event", {
        workflowId: this.workflowId,
        event,
      })
    } else {
      // Simulate sending event
      setTimeout(() => {
        this.triggerEvent("comment", event)
      }, 100)
    }

    return newComment
  }

  public sendCursorPosition(position: { x: number; y: number }) {
    if (!this.isOnline || !this.connected) return

    const event: CollaborationEvent = {
      type: "cursor",
      user: this.user!,
      data: position,
      timestamp: Date.now(),
    }

    if (this.socket) {
      this.socket.emit("event", {
        workflowId: this.workflowId,
        event,
      })
    } else {
      // Simulate sending event
      setTimeout(() => {
        this.triggerEvent("cursor", event)
      }, 50)
    }
  }

  public getActiveUsers(): CollaborationUser[] {
    // In a real implementation, this would get the active users from the server
    // For now, we'll return a simulated list
    return [
      this.user!,
      {
        id: "user2",
        name: "Jane Smith",
        color: "#33FFF6",
      },
      {
        id: "user3",
        name: "Bob Johnson",
        color: "#F033FF",
      },
    ]
  }
}

// Singleton instance
export const collaborationService = new CollaborationService()
