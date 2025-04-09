import type { WorkflowSubmission } from "../types"
import localforage from "localforage"

// Initialize localforage instances for different data types
const workflowsStore = localforage.createInstance({
  name: "aiCloneHub",
  storeName: "workflows",
})

const userStore = localforage.createInstance({
  name: "aiCloneHub",
  storeName: "user",
})

const syncQueueStore = localforage.createInstance({
  name: "aiCloneHub",
  storeName: "syncQueue",
})

interface SyncQueueItem {
  id: string
  action: "create" | "update" | "delete"
  data: any
  timestamp: number
  retries: number
}

class PWAService {
  private isOnline: boolean = navigator.onLine
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    // Listen for online/offline events
    window.addEventListener("online", this.handleOnline)
    window.addEventListener("offline", this.handleOffline)

    // Initialize sync interval
    this.startSyncInterval()
  }

  private handleOnline = () => {
    this.isOnline = true
    this.syncData()
  }

  private handleOffline = () => {
    this.isOnline = false
  }

  private startSyncInterval() {
    // Sync data every 5 minutes
    this.syncInterval = setInterval(
      () => {
        if (this.isOnline) {
          this.syncData()
        }
      },
      5 * 60 * 1000,
    )
  }

  public async saveWorkflow(workflow: WorkflowSubmission): Promise<void> {
    try {
      // Save to local storage
      await workflowsStore.setItem(workflow.id, workflow)

      // Add to sync queue if online
      if (this.isOnline) {
        await this.addToSyncQueue({
          id: workflow.id,
          action: "update",
          data: workflow,
          timestamp: Date.now(),
          retries: 0,
        })

        // Trigger sync
        this.syncData()
      }
    } catch (error) {
      console.error("Error saving workflow:", error)
      throw new Error("Failed to save workflow")
    }
  }

  public async getWorkflow(id: string): Promise<WorkflowSubmission | null> {
    try {
      return await workflowsStore.getItem<WorkflowSubmission>(id)
    } catch (error) {
      console.error("Error getting workflow:", error)
      return null
    }
  }

  public async getAllWorkflows(): Promise<WorkflowSubmission[]> {
    try {
      const workflows: WorkflowSubmission[] = []

      await workflowsStore.iterate<WorkflowSubmission, void>((value) => {
        workflows.push(value)
      })

      return workflows
    } catch (error) {
      console.error("Error getting all workflows:", error)
      return []
    }
  }

  public async deleteWorkflow(id: string): Promise<void> {
    try {
      // Remove from local storage
      await workflowsStore.removeItem(id)

      // Add to sync queue if online
      if (this.isOnline) {
        await this.addToSyncQueue({
          id,
          action: "delete",
          data: { id },
          timestamp: Date.now(),
          retries: 0,
        })

        // Trigger sync
        this.syncData()
      }
    } catch (error) {
      console.error("Error deleting workflow:", error)
      throw new Error("Failed to delete workflow")
    }
  }

  private async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    try {
      await syncQueueStore.setItem(item.id, item)
    } catch (error) {
      console.error("Error adding to sync queue:", error)
    }
  }

  private async syncData(): Promise<void> {
    if (!this.isOnline) return

    try {
      const syncQueue: SyncQueueItem[] = []

      // Get all items from sync queue
      await syncQueueStore.iterate<SyncQueueItem, void>((value) => {
        syncQueue.push(value)
      })

      // Sort by timestamp (oldest first)
      syncQueue.sort((a, b) => a.timestamp - b.timestamp)

      // Process each item in the queue
      for (const item of syncQueue) {
        try {
          // In a real implementation, this would make API calls to sync with the server
          // For now, we'll just simulate the sync

          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Remove from sync queue after successful sync
          await syncQueueStore.removeItem(item.id)
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error)

          // Increment retry count
          item.retries += 1

          // If too many retries, remove from queue
          if (item.retries >= 5) {
            await syncQueueStore.removeItem(item.id)
          } else {
            // Update retry count
            await syncQueueStore.setItem(item.id, item)
          }
        }
      }
    } catch (error) {
      console.error("Error syncing data:", error)
    }
  }

  public async clearAllData(): Promise<void> {
    try {
      await workflowsStore.clear()
      await userStore.clear()
      await syncQueueStore.clear()
    } catch (error) {
      console.error("Error clearing data:", error)
      throw new Error("Failed to clear data")
    }
  }

  public destroy() {
    window.removeEventListener("online", this.handleOnline)
    window.removeEventListener("offline", this.handleOffline)

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}

// Singleton instance
export const pwaService = new PWAService()
