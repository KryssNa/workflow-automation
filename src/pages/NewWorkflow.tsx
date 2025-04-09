// src/pages/NewWorkflow.tsx
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Background } from "../components/background"
import { Header } from "../components/header"
import { Modal } from "../components/modal"
import { OfflineBanner } from "../components/pwa/offline-banner"
import { SyncStatus } from "../components/pwa/sync-status"
import { WorkflowForm } from "../components/workflow-form"
import { useWorkflowStore } from "../store/workflow-store"

export default function NewWorkflow() {
    const {
        isOffline,
        resetForm,
        currentBusinessName,
        currentDepartmentName,
        currentWorkflowName,
        openModal,
        isEditing,
        submissions,
        editSubmission
    } = useWorkflowStore()

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Handle initialization based on mode (create new or edit)
    useEffect(() => {
        const workflowId = searchParams.get("id")
        const editMode = searchParams.get("edit") === "true"

        if (workflowId && editMode) {
            // Find the workflow and set it for editing
            const workflow = submissions.find(sub => sub.id === workflowId)
            if (workflow) {
                editSubmission(workflowId)
            }
        } else {
            // Only reset form when creating a new workflow (not editing)
            resetForm()
        }
    }, [searchParams, resetForm, submissions, editSubmission])

    // Check for business name, department name, and workflow name only for new workflows
    useEffect(() => {
        const workflowId = searchParams.get("id")
        if (!isEditing && !workflowId) {
            if (!currentBusinessName) {
            openModal("business")
            } else if (!currentDepartmentName) {
            openModal("department")
            } else if (!currentWorkflowName) {
            openModal("workflow")
            }
        }
    }, [currentBusinessName, currentDepartmentName, currentWorkflowName, openModal, isEditing])

    return (
        <main className="min-h-screen">
            <Background />
            <Modal />
            <OfflineBanner />
            {isOffline && <SyncStatus />}

            <div className="container mx-auto px-4 py-8">
                <Header userName="Rohan" />

                <div className="flex justify-between items-center mb-8 mt-4">
                    <h1 className="text-3xl font-bold text-white">
                        {isEditing
                            ? `Edit Workflow: ${currentWorkflowName}`
                            : "Create New Workflow"
                        }
                    </h1>
                    <button
                        onClick={() => navigate("/")}
                        className="text-white hover:text-primary transition-colors"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="max-w-4xl mx-auto">
                    <WorkflowForm />
                </div>
            </div>
        </main>
    )
}