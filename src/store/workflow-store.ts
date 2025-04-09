import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { collaborationService } from "../services/collaboration-service"
import { generateWorkflowAnalysis } from "../services/deepseek-service"
import { integrationService } from "../services/integration-service"
import { notificationService } from "../services/notification-service"
import { pwaService } from "../services/pwa-service"
import type {
  BusinessInfo,
  Comment,
  CostAnalysis,
  DeepseekResponse,
  ExportFormat,
  IntegrationConfig,
  ModalState,
  NotificationMessage,
  UserProfile,
  WorkflowEdge,
  WorkflowGraph,
  WorkflowNode,
  WorkflowQuestion,
  WorkflowStep,
  WorkflowSubmission,
} from "../types"

export interface WorkflowState {
  // Data
  currentQuestions: WorkflowQuestion[]
  currentSteps: WorkflowStep[]
  submissions: WorkflowSubmission[]
  businesses: BusinessInfo[]
  integrations: IntegrationConfig[]
  notifications: NotificationMessage[]
  currentUser: UserProfile | null

  // UI state
  isEditing: boolean
  isAnalyzing: boolean
  isCollaborating: boolean
  isOffline: boolean
  currentSubmissionId: string | null
  currentBusinessName: string
  currentDepartmentName: string
  currentWorkflowName: string
  modalState: ModalState
  costAnalysis: CostAnalysis | null
  currentPage: number
  selectedExportFormat: ExportFormat | null
  deepseekResponse: DeepseekResponse | null
  activeCollaborators: { id: string; name: string; color: string }[]
  showForm: boolean
  selectedSubmission: string | null

  // Graph state (for non-linear workflows)
  currentGraph: WorkflowGraph | null
  isLinearWorkflow: boolean

  // Actions
  updateAnswer: (id: string, answer: string) => void
  submitWorkflow: () => Promise<string | null>
  editSubmission: (submissionId: string) => void
  resetForm: () => void
  setCurrentPage: (page: number) => void
  setBusinessName: (name: string) => void
  setDepartmentName: (name: string) => void
  setWorkflowName: (name: string) => void
  openModal: (
    type:
      | "business"
      | "department"
      | "workflow"
      | "export"
      | "comment"
      | "integration"
      | "notification"
      | "confirmation",
    data?: any,
  ) => void
  closeModal: () => void
  saveModal: () => void
  setExportFormat: (format: ExportFormat | null) => void
  deleteSubmission: (submissionId: string) => void
  setShowForm: (show: boolean) => void
  setSelectedSubmission: (id: string | null) => void

  // Graph actions
  toggleWorkflowType: () => void
  addNode: (node: Omit<WorkflowNode, "id">) => string
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  removeNode: (id: string) => void
  addEdge: (edge: Omit<WorkflowEdge, "id">) => string
  updateEdge: (id: string, updates: Partial<WorkflowEdge>) => void
  removeEdge: (id: string) => void

  // Collaboration actions
  startCollaboration: (submissionId: string) => void
  stopCollaboration: () => void
  addComment: (comment: Omit<Comment, "id" | "user" | "timestamp">) => void

  // Integration actions
  getIntegrations: () => IntegrationConfig[]
  addIntegration: (type: string, config: Record<string, any>) => void
  updateIntegration: (id: string, updates: Partial<IntegrationConfig>) => void
  removeIntegration: (id: string) => void
  executeIntegration: (integrationId: string, action: string, data?: any) => Promise<any>

  // Notification actions
  getNotifications: () => NotificationMessage[]
  addNotification: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
    action?: { label: string; onClick: () => void },
  ) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  removeNotification: (id: string) => void

  // User actions
  setCurrentUser: (user: UserProfile) => void
  updateUserPreferences: (preferences: Partial<UserProfile["preferences"]>) => void
}

const defaultQuestions: WorkflowQuestion[] = [
  {
    id: "q1",
    question: "What workflow would you like to automate or improve with AI?",
    answer: "",
  },
  {
    id: "q2",
    question: "List the key steps in your workflow in order.",
    answer: "",
  },
  {
    id: "q3",
    question: "Which tools or software do you currently use for each step?",
    answer: "",
  },
  {
    id: "q4",
    question: "Which steps in the process involve manual data entry or repetitive tasks?",
    answer: "",
  },
  {
    id: "q5",
    question: "Who are the key people involved in this process, and what are their specific roles?",
    answer: "",
  },
  {
    id: "q6",
    question: "How do you typically receive the information or input needed to start this process?",
    answer: "",
  },
  {
    id: "q7",
    question: "For each step, what key decisions do you need to make?",
    answer: "",
  },
  {
    id: "q8",
    question: "Are there any points in the process where you have to wait for input or approval from others?",
    answer: "",
  },
  {
    id: "q9",
    question: "What are the most common problems or bottlenecks you encounter in this workflow?",
    answer: "",
  },
  {
    id: "q10",
    question: "How do you handle exceptions or unexpected issues that arise during this process?",
    answer: "",
  },
  {
    id: "q11",
    question: "What is the final output of this workflow (e.g., report, invoice, approval)?",
    answer: "",
  },
  {
    id: "q12",
    question: "How do you measure the quality and accuracy of the output?",
    answer: "",
  },
  {
    id: "q13",
    question: "Which steps in this process could be easily automated with the right tools?",
    answer: "",
  },
  {
    id: "q14",
    question: "How frequently do you perform this workflow? (Daily, weekly, monthly, etc.)",
    answer: "",
  },
  {
    id: "q15",
    question: "How much time does each step in this workflow take on average?",
    answer: "",
  },
  {
    id: "q16",
    question:
      "What is your monthly salary or cost to the company? (Approximate figures are fine—this helps calculate potential savings from automation)",
    answer: "",
  },
]

const defaultUser: UserProfile = {
  id: "default-user",
  name: "Rohan",
  email: "rohan@example.com",
  role: "admin",
  preferences: {
    theme: "dark",
    notifications: true,
    collaborationMode: "realtime",
  },
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      // Data
      currentQuestions: [...defaultQuestions],
      currentSteps: [],
      submissions: [],
      businesses: [
        {
          name: "Acme Corp",
          departments: ["Marketing", "Sales", "IT", "HR"],
        },
        {
          name: "TechSolutions Inc",
          departments: ["Development", "Design", "Support", "Operations"],
        },
      ],
      integrations: [],
      notifications: [],
      currentUser: defaultUser,

      // UI state
      isEditing: false,
      isAnalyzing: false,
      isCollaborating: false,
      isOffline: !navigator.onLine,
      currentSubmissionId: null,
      currentBusinessName: "",
      currentDepartmentName: "",
      currentWorkflowName: "",
      modalState: {
        isOpen: false,
        type: null,
      },
      costAnalysis: null,
      currentPage: 0,
      selectedExportFormat: null,
      deepseekResponse: null,
      activeCollaborators: [],
      showForm: false,
      selectedSubmission: null,

      // Graph state
      currentGraph: null,
      isLinearWorkflow: true,

      // Actions
      updateAnswer: (id, answer) => {
        set((state) => ({
          currentQuestions: state.currentQuestions.map((q) => (q.id === id ? { ...q, answer } : q)),
        }))

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`questions.${id}.answer`, answer)
        }
      },

      submitWorkflow: async () => {
        set({ isAnalyzing: true })

        try {
          const {
            currentQuestions,
            isEditing,
            currentSubmissionId,
            submissions,
            currentBusinessName,
            currentDepartmentName,
            currentWorkflowName,
            currentGraph,
            isLinearWorkflow,
          } = get()

          // Generate analysis using Deepseek API
          const deepseekResponse = await generateWorkflowAnalysis(currentQuestions)
          set({ deepseekResponse })

          let updatedSubmission: WorkflowSubmission

          if (isEditing && currentSubmissionId) {
            // Update existing submission
            const existingSubmission = submissions.find((sub) => sub.id === currentSubmissionId)

            if (!existingSubmission) {
              throw new Error("Submission not found")
            }

            updatedSubmission = {
              ...existingSubmission,
              questions: [...currentQuestions],
              steps: [...deepseekResponse.steps],
              name: currentWorkflowName,
              businessName: currentBusinessName,
              departmentName: currentDepartmentName,
              analysis: deepseekResponse.analysis,
              graph: currentGraph || undefined,
              isLinear: isLinearWorkflow,
              updatedAt: new Date(),
              version: (existingSubmission.version || 0) + 1,
            }

            set({
              submissions: submissions.map((sub) => (sub.id === currentSubmissionId ? updatedSubmission : sub)),
              isEditing: false,
              currentSubmissionId: null,
            })
          } else {
            // Create new submission
            updatedSubmission = {
              id: uuidv4(),
              name: currentWorkflowName || "Untitled Workflow",
              businessName: currentBusinessName || "Untitled Business",
              departmentName: currentDepartmentName || "Untitled Department",
              questions: [...currentQuestions],
              steps: [...deepseekResponse.steps],
              graph: currentGraph || undefined,
              isLinear: isLinearWorkflow,
              createdAt: new Date(),
              analysis: deepseekResponse.analysis,
              version: 1,
            }

            set((state) => ({
              submissions: [...state.submissions, updatedSubmission],
            }))
          }

          // Set cost analysis from Deepseek response
          set({
            costAnalysis: deepseekResponse.costAnalysis || null,
            currentSteps: deepseekResponse.steps,
          })

          // Save to offline storage
          await pwaService.saveWorkflow(updatedSubmission)

          // Show success notification
          get().addNotification(
            "success",
            "Workflow Saved",
            `Your workflow "${updatedSubmission.name}" has been saved successfully.`,
            {
              label: "View",
              onClick: () => {
                window.location.href = `/?id=${updatedSubmission.id}`
              },
            },
          )

          // Reset form after submission
          set({
            currentQuestions: defaultQuestions.map((q) => ({ ...q, answer: "" })),
            currentPage: 0,
            showForm: false,
          })

          // Redirect to workflow section with the new ID
          window.history.pushState({}, "", `/?id=${updatedSubmission.id}`)

          // Set the selected submission ID for display
          set({
            selectedSubmission: updatedSubmission.id,
          })

          return updatedSubmission.id
        } catch (error) {
          console.error("Error submitting workflow:", error)

          // Show error notification
          get().addNotification(
            "error",
            "Submission Failed",
            `There was an error saving your workflow: ${error instanceof Error ? error.message : "Unknown error"}`,
            {
              label: "Try Again",
              onClick: () => get().submitWorkflow(),
            },
          )

          return null
        } finally {
          set({ isAnalyzing: false })
        }
      },

      editSubmission: (submissionId) => {
        const { submissions } = get()
        const submission = submissions.find((sub) => sub.id === submissionId)

        if (submission) {
          set({
            currentQuestions: [...submission.questions],
            currentSteps: [...submission.steps],
            currentBusinessName: submission.businessName,
            currentDepartmentName: submission.departmentName,
            currentWorkflowName: submission.name,
            currentGraph: submission.graph || null,
            isLinearWorkflow: submission.isLinear !== false,
            isEditing: true,
            currentSubmissionId: submissionId,
            showForm: true,
          })

          // Start collaboration
          get().startCollaboration(submissionId)
        }
      },

      resetForm: () => {
        set({
          currentQuestions: defaultQuestions.map((q) => ({ ...q, answer: "" })),
          currentSteps: [],
          isEditing: false,
          currentSubmissionId: null,
          currentBusinessName: "",
          currentDepartmentName: "",
          currentWorkflowName: "",
          currentPage: 0,
          deepseekResponse: null,
          currentGraph: null,
          isLinearWorkflow: true,
        })

        // Stop collaboration
        get().stopCollaboration()
      },

      setCurrentPage: (page) => {
        set({ currentPage: page })
      },

      setBusinessName: (name) => {
        set({ currentBusinessName: name })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit("businessName", name)
        }
      },

      setDepartmentName: (name) => {
        set({ currentDepartmentName: name })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit("departmentName", name)
        }
      },

      setWorkflowName: (name) => {
        set({ currentWorkflowName: name })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit("workflowName", name)
        }
      },

      openModal: (type, data) => {
        set({
          modalState: {
            isOpen: true,
            type,
            data,
          },
        })
      },

      closeModal: () => {
        set({
          modalState: {
        isOpen: false,
        type: null,
        data: undefined,
          },
          selectedExportFormat: null,
        })

        // Navigate to the home page
        window.location.href = "/"
      },
      saveModal: () => {
        set({
          modalState: {
        isOpen: false,
        type: null,
        data: undefined,
          },
          selectedExportFormat: null,
        })
      },

      setExportFormat: (format) => {
        set({ selectedExportFormat: format })
      },

      deleteSubmission: (submissionId) => {
        const { submissions } = get()

        // Delete from offline storage
        pwaService.deleteWorkflow(submissionId)

        set({
          submissions: submissions.filter((sub) => sub.id !== submissionId),
        })

        // Show success notification
        get().addNotification("success", "Workflow Deleted", "Your workflow has been deleted successfully.")
      },

      setShowForm: (show) => {
        set({ showForm: show })
      },

      setSelectedSubmission: (id) => {
        set({ selectedSubmission: id })
      },

      // Graph actions
      toggleWorkflowType: () => {
        const { isLinearWorkflow, currentSteps } = get()

        if (isLinearWorkflow) {
          // Convert linear workflow to graph
          const nodes: WorkflowNode[] = [
            {
              id: "start",
              type: "start",
              data: { id: "start", name: "Start", description: "Start of workflow" } as any,
              position: { x: 250, y: 0 },
            },
            ...currentSteps.map((step, index) => ({
              id: step.id,
              type: "step" as const,
              data: step,
              position: { x: 250, y: (index + 1) * 150 },
            })),
            {
              id: "end",
              type: "end",
              data: { id: "end", name: "End", description: "End of workflow" } as any,
              position: { x: 250, y: (currentSteps.length + 1) * 150 },
            },
          ]

          const edges: WorkflowEdge[] = [
            {
              id: "start-to-first",
              source: "start",
              target: currentSteps[0]?.id || "end",
            },
            ...currentSteps.slice(0, -1).map((step, index) => ({
              id: `${step.id}-to-${currentSteps[index + 1].id}`,
              source: step.id,
              target: currentSteps[index + 1].id,
            })),
            {
              id: "last-to-end",
              source: currentSteps[currentSteps.length - 1]?.id || "start",
              target: "end",
            },
          ]

          set({
            isLinearWorkflow: false,
            currentGraph: { nodes, edges },
          })
        } else {
          // Convert graph to linear workflow
          set({
            isLinearWorkflow: true,
          })
        }

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit("isLinearWorkflow", !isLinearWorkflow)
        }
      },

      addNode: (node) => {
        const { currentGraph } = get()
        const id = uuidv4()

        const newNode: WorkflowNode = {
          ...node,
          id,
        }

        set({
          currentGraph: {
            nodes: [...(currentGraph?.nodes || []), newNode],
            edges: [...(currentGraph?.edges || [])],
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.nodes.${id}`, newNode)
        }

        return id
      },

      updateNode: (id, updates) => {
        const { currentGraph } = get()

        if (!currentGraph) return

        set({
          currentGraph: {
            ...currentGraph,
            nodes: currentGraph.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.nodes.${id}`, updates)
        }
      },

      removeNode: (id) => {
        const { currentGraph } = get()

        if (!currentGraph) return

        set({
          currentGraph: {
            nodes: currentGraph.nodes.filter((node) => node.id !== id),
            edges: currentGraph.edges.filter((edge) => edge.source !== id && edge.target !== id),
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.nodes.${id}`, null)
        }
      },

      addEdge: (edge) => {
        const { currentGraph } = get()
        const id = uuidv4() || `${edge.source}-to-${edge.target}`

        const newEdge: WorkflowEdge = {
          ...edge,
          id,
        }

        set({
          currentGraph: {
            nodes: [...(currentGraph?.nodes || [])],
            edges: [...(currentGraph?.edges || []), newEdge],
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.edges.${id}`, newEdge)
        }

        return id
      },

      updateEdge: (id, updates) => {
        const { currentGraph } = get()

        if (!currentGraph) return

        set({
          currentGraph: {
            ...currentGraph,
            edges: currentGraph.edges.map((edge) => (edge.id === id ? { ...edge, ...updates } : edge)),
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.edges.${id}`, updates)
        }
      },

      removeEdge: (id) => {
        const { currentGraph } = get()

        if (!currentGraph) return

        set({
          currentGraph: {
            ...currentGraph,
            edges: currentGraph.edges.filter((edge) => edge.id !== id),
          },
        })

        // If collaborating, send edit event
        if (get().isCollaborating) {
          collaborationService.sendEdit(`graph.edges.${id}`, null)
        }
      },

      // Collaboration actions
      startCollaboration: (submissionId) => {
        const { currentUser, submissions } = get()

        if (!currentUser) return

        const submission = submissions.find((sub) => sub.id === submissionId)

        if (!submission) return

        // Initialize collaboration service
        collaborationService.init(submissionId, currentUser.name, currentUser.avatar)

        // Listen for collaboration events
        collaborationService.on("all", (event) => {
          // Handle different event types
          if (event.type === "edit") {
            // Update local state based on edit event
            const { path, value } = event.data

            // TODO: Implement path-based state updates
            console.log(`Received edit event for path ${path}:`, value)
          } else if (event.type === "comment") {
            // Add comment to local state
            const comment = event.data

            set((state) => {
              const updatedSubmissions = state.submissions.map((sub) => {
                if (sub.id === submissionId) {
                  return {
                    ...sub,
                    comments: [...(sub.comments || []), comment],
                  }
                }
                return sub
              })

              return { submissions: updatedSubmissions }
            })
          }
        })

        // Get active collaborators
        const activeCollaborators = collaborationService.getActiveUsers()

        set({
          isCollaborating: true,
          activeCollaborators,
        })

        // Show notification
        get().addNotification(
          "info",
          "Collaboration Started",
          `You are now collaborating on "${submission.name}" with ${activeCollaborators.length - 1} other users.`,
        )
      },

      stopCollaboration: () => {
        collaborationService.disconnect()

        set({
          isCollaborating: false,
          activeCollaborators: [],
        })
      },

      addComment: (comment) => {
        const { currentSubmissionId, submissions, isCollaborating } = get()

        if (!currentSubmissionId) return

        let newComment

        if (isCollaborating) {
          // Use collaboration service to add comment
          newComment = collaborationService.sendComment(comment)
        } else {
          // Add comment locally
          newComment = {
            id: uuidv4(),
            user: {
              id: get().currentUser?.id || "anonymous",
              name: get().currentUser?.name || "Anonymous",
              avatar: get().currentUser?.avatar,
              color: "#FF5733",
            },
            ...comment,
            timestamp: new Date(),
          }
        }

        // Update local state
        set({
          submissions: submissions.map((sub) => {
            if (sub.id === currentSubmissionId) {
              return {
                ...sub,
                comments: [...(sub.comments || []), newComment],
              }
            }
            return sub
          }),
        })
      },

      // Integration actions
      getIntegrations: () => {
        return integrationService.getIntegrations()
      },

      addIntegration: (type, config) => {
        try {
          const newIntegration = integrationService.createIntegration(type, config)

          set((state) => ({
            integrations: [...state.integrations, newIntegration],
          }))

          // Show success notification
          get().addNotification(
            "success",
            "Integration Added",
            `The ${newIntegration.name} integration has been added successfully.`,
          )

          return newIntegration
        } catch (error) {
          console.error("Error adding integration:", error)

          // Show error notification
          get().addNotification(
            "error",
            "Integration Failed",
            `There was an error adding the integration: ${error instanceof Error ? error.message : "Unknown error"}`,
          )

          throw error
        }
      },

      updateIntegration: (id, updates) => {
        try {
          const updatedIntegration = integrationService.updateIntegration(id, updates)

          set((state) => ({
            integrations: state.integrations.map((integration) =>
              integration.id === id ? updatedIntegration : integration,
            ),
          }))

          // Show success notification
          get().addNotification(
            "success",
            "Integration Updated",
            `The ${updatedIntegration.name} integration has been updated successfully.`,
          )

          return updatedIntegration
        } catch (error) {
          console.error("Error updating integration:", error)

          // Show error notification
          get().addNotification(
            "error",
            "Update Failed",
            `There was an error updating the integration: ${error instanceof Error ? error.message : "Unknown error"}`,
          )

          throw error
        }
      },

      removeIntegration: (id) => {
        try {
          const integration = integrationService.getIntegration(id)

          if (!integration) {
            throw new Error("Integration not found")
          }

          integrationService.deleteIntegration(id)

          set((state) => ({
            integrations: state.integrations.filter((integration) => integration.id !== id),
          }))

          // Show success notification
          get().addNotification(
            "success",
            "Integration Removed",
            `The ${integration.name} integration has been removed successfully.`,
          )
        } catch (error) {
          console.error("Error removing integration:", error)

          // Show error notification
          get().addNotification(
            "error",
            "Removal Failed",
            `There was an error removing the integration: ${error instanceof Error ? error.message : "Unknown error"}`,
          )

          throw error
        }
      },

      executeIntegration: async (integrationId, action, data) => {
        try {
          const { currentSubmissionId, submissions } = get()

          if (!currentSubmissionId) {
            throw new Error("No active workflow")
          }

          const submission = submissions.find((sub) => sub.id === currentSubmissionId)

          if (!submission) {
            throw new Error("Workflow not found")
          }

          const result = await integrationService.executeIntegration(integrationId, submission, action, data)

          // Show success notification
          get().addNotification(
            "success",
            "Integration Executed",
            `The integration action "${action}" was executed successfully.`,
          )

          return result
        } catch (error) {
          console.error("Error executing integration:", error)

          // Show error notification
          get().addNotification(
            "error",
            "Execution Failed",
            `There was an error executing the integration: ${error instanceof Error ? error.message : "Unknown error"}`,
          )

          throw error
        }
      },

      // Notification actions
      getNotifications: () => {
        return notificationService.getNotifications()
      },

      addNotification: (type, title, message, action) => {
        const notification = notificationService.addNotification(type, title, message, action)

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        }))

        return notification
      },

      markNotificationAsRead: (id) => {
        notificationService.markAsRead(id)

        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        }))
      },

      markAllNotificationsAsRead: () => {
        notificationService.markAllAsRead()

        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        }))
      },

      removeNotification: (id) => {
        notificationService.removeNotification(id)

        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        }))
      },

      // User actions
      setCurrentUser: (user) => {
        set({ currentUser: user })
      },

      updateUserPreferences: (preferences) => {
        set((state) => ({
          currentUser: state.currentUser
            ? {
              ...state.currentUser,
              preferences: {
                ...state.currentUser.preferences,
                ...preferences,
              },
            }
            : null,
        }))
      },
    }),
    {
      name: "workflow-storage",
      partialize: (state) => ({
        submissions: state.submissions,
        businesses: state.businesses,
        integrations: state.integrations,
        currentUser: state.currentUser,
      }),
    },
  ),
)