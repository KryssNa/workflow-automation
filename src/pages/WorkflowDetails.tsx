// // src/pages/WorkflowDetails.tsx
// import { motion } from 'framer-motion'
// import {
//     ArrowLeft,
//     Building,
//     Calendar,
//     Clock,
//     Edit, FileText,
//     Loader2,
//     Share2,
//     Users,
//     Zap
// } from 'lucide-react'
// import { useCallback, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { Analysis } from '../components/analysis'
// import { AdvancedCostAnalysis } from '../components/analytics/advanced-cost-analysis'
// import { Background } from '../components/background'
// import { CollaboratorsPanel } from '../components/collaboration/collaborators-panel'
// import { CommentsPanel } from '../components/collaboration/comments-panel'
// import { Header } from '../components/header'
// import { IntegrationsPanel } from '../components/integrations/integrations-panel'
// import { Sidebar } from '../components/sidebar'
// import { Button } from '../components/ui/button'
// import { Card } from '../components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
// import { WorkflowDiagramSimple } from '../components/workflow-diagram-simple'
// import { exportWithFlowChart } from '../services/export-service'
// import { useWorkflowStore } from '../store/workflow-store'

// export default function WorkflowDetails() {
//     const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//     const [activeTab, setActiveTab] = useState('analysis')
//     const [isExporting, setIsExporting] = useState(false)

//     const {
//         submissions,
//         editSubmission,
//         isCollaborating,
//         setSelectedSubmission
//     } = useWorkflowStore()

//     // Find the current workflow based on the ID from URL params
//     const workflow = submissions.find(sub => sub.id === id)

//     // Update selected submission in store when component mounts or ID changes
//     useEffect(() => {
//         if (id) {
//             setSelectedSubmission(id)
//         }
//     }, [id, setSelectedSubmission])

//     // Handle when workflow is not found
//     useEffect(() => {
//         if (id && !workflow) {
//             // Workflow not found, redirect to workflows page
//             navigate('/my-workflows')
//         }
//     }, [id, workflow, navigate])

//     const handleEdit = () => {
//         if (workflow) {
//             editSubmission(workflow.id)
//             navigate('/', { state: { editing: true } })
//         }
//     }

//     const handleBackToList = () => {
//         navigate('/my-workflows')
//     }

//     const handleExport = useCallback(() => {
//         if (workflow && !isExporting) {
//             setIsExporting(true)

//             // Store the current tab
//             const currentTab = activeTab

//             // Set the diagram tab active for export
//             setActiveTab('diagram')

//             // Add a delay to ensure the diagram is fully rendered
//             setTimeout(() => {
//                 try {
//                     exportWithFlowChart(workflow)
//                 } catch (error) {
//                     console.error('Export failed:', error)
//                     alert('There was an error exporting the workflow. Please try again.')
//                 } finally {
//                     setIsExporting(false)
//                     // Restore the previous tab after export
//                     setActiveTab(currentTab)
//                 }
//             }, 1000)
//         }
//     }, [workflow, activeTab, isExporting])

//     // Format date for display
//     const formatDate = (date: Date) => {
//         return new Date(date).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         })
//     }

//     if (!workflow) {
//         return (
//             <main className="min-h-screen flex">
//                 <Background />
//                 <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
//                     <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
//                     <p className="text-white">Loading workflow...</p>
//                 </div>
//             </main>
//         )
//     }

//     return (
//         <main className="min-h-screen flex">
//             <Background />

//             <div className="container mx-auto px-4 py-8 flex flex-col">
//                 <Header userName="Rohan" />

//                 <div className="flex flex-1 mt-8 gap-6">
//                     <div className="w-72 hidden md:block">
//                         <Sidebar activeWorkflow={workflow.id} />
//                     </div>

//                     <div className="flex-1">
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="mb-6"
//                         >
//                             <Button
//                                 variant="ghost"
//                                 className="text-gray-400 hover:text-white mb-4"
//                                 onClick={handleBackToList}
//                             >
//                                 <ArrowLeft className="h-4 w-4 mr-2" />
//                                 Back to workflows
//                             </Button>

//                             <Card className="bg-secondary/20 border-primary/30 p-6">
//                                 <div className="flex flex-col md:flex-row justify-between">
//                                     <div>
//                                         <h1 className="text-3xl font-bold text-white mb-2">{workflow.name}</h1>
//                                         <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
//                                             <div className="flex items-center">
//                                                 <Building className="h-4 w-4 mr-1.5 text-primary" />
//                                                 {workflow.businessName}
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Users className="h-4 w-4 mr-1.5 text-primary" />
//                                                 {workflow.departmentName}
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Calendar className="h-4 w-4 mr-1.5 text-primary" />
//                                                 Created: {formatDate(workflow.createdAt)}
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Clock className="h-4 w-4 mr-1.5 text-primary" />
//                                                 {workflow.updatedAt
//                                                     ? `Updated: ${formatDate(workflow.updatedAt)}`
//                                                     : `Created: ${formatDate(workflow.createdAt)}`
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
//                                         <Button
//                                             onClick={handleExport}
//                                             variant="outline"
//                                             className="border-primary/50 text-white"
//                                             disabled={isExporting}
//                                         >
//                                             <FileText className="h-4 w-4 mr-2" />
//                                             {isExporting ? "Exporting..." : "Export"}
//                                         </Button>
//                                         <Button
//                                             onClick={handleEdit}
//                                             className="bg-primary text-white hover:bg-primary/90"
//                                         >
//                                             <Edit className="h-4 w-4 mr-2" />
//                                             Edit Workflow
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 {/* Collaboration status badge */}
//                                 {isCollaborating && (
//                                     <div className="mt-4 flex items-center">
//                                         <div className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm flex items-center">
//                                             <Share2 className="h-3.5 w-3.5 mr-1.5" />
//                                             <span>Collaboration Active</span>
//                                         </div>
//                                         <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             className="ml-2 text-primary hover:bg-primary/10 hover:text-primary"
//                                         >
//                                             <Zap className="h-3.5 w-3.5 mr-1" />
//                                             <span className="text-xs">Invite Others</span>
//                                         </Button>
//                                     </div>
//                                 )}
//                             </Card>
//                         </motion.div>

//                         <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
//                             <TabsList className="bg-black/30 mb-6">
//                                 <TabsTrigger
//                                     value="analysis"
//                                     className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                                 >
//                                     Analysis
//                                 </TabsTrigger>
//                                 <TabsTrigger
//                                     value="diagram"
//                                     className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                                 >
//                                     Flow Chart Diagram
//                                 </TabsTrigger>
//                                 <TabsTrigger
//                                     value="costs"
//                                     className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                                 >
//                                     Cost Analysis
//                                 </TabsTrigger>
//                                 <TabsTrigger
//                                     value="integrations"
//                                     className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                                 >
//                                     Integrations
//                                 </TabsTrigger>
//                             </TabsList>

//                             <TabsContent value="analysis" className="mt-0">
//                                 <Analysis submission={workflow} />
//                             </TabsContent>

//                             <TabsContent value="diagram" className="mt-0">
//                                 <WorkflowDiagramSimple submission={workflow} />
//                             </TabsContent>

//                             <TabsContent value="costs" className="mt-0">
//                                 <AdvancedCostAnalysis submission={workflow} />
//                             </TabsContent>

//                             <TabsContent value="integrations" className="mt-0">
//                                 <IntegrationsPanel />
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                 </div>

//                 {/* Collaboration panels */}
//                 {isCollaborating && (
//                     <>
//                         <CollaboratorsPanel submissionId={workflow.id} />
//                         <CommentsPanel submission={workflow} />
//                     </>
//                 )}
//             </div>
//         </main>
//     )
// }
// src/pages/WorkflowDetails.tsx

// import { motion } from "framer-motion"
// import { Edit, FileText, PlusCircle } from "lucide-react"
// import { useCallback, useEffect, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"

// import { Analysis } from "../components/analysis"
// import { AdvancedCostAnalysis } from "../components/analytics/advanced-cost-analysis"
// import { Background } from "../components/background"
// import { CollaboratorsPanel } from "../components/collaboration/collaborators-panel"
// import { CommentsPanel } from "../components/collaboration/comments-panel"
// import { Header } from "../components/header"
// import { IntegrationsPanel } from "../components/integrations/integrations-panel"
// import { Modal } from "../components/modal"
// import { CommentModal } from "../components/modals/comment-modal"
// import { ConfirmationModal } from "../components/modals/confirmation-modal"
// import { IntegrationModal } from "../components/modals/integration-modal"
// import { NotificationsPanel } from "../components/notifications/notifications-panel"
// import { OfflineBanner } from "../components/pwa/offline-banner"
// import { SyncStatus } from "../components/pwa/sync-status"
// import { WorkflowDiagramSimple } from "../components/workflow-diagram-simple"

// import { Button } from "../components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// import { exportWithFlowChart } from "../services/export-service"
// import { useWorkflowStore } from "../store/workflow-store"

// export default function WorkflowDetails() {
//     const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//     const {
//         submissions,
//         isOffline,
//         isCollaborating,
//         editSubmission,
//         setSelectedSubmission
//     } = useWorkflowStore()

//     const [activeTab, setActiveTab] = useState("analysis")
//     const [isExporting, setIsExporting] = useState(false)

//     // Get current submission based on URL param
//     const currentSubmission = submissions.find(sub => sub.id === id)

//     // Set the current submission in the store
//     useEffect(() => {
//         if (id) {
//             setSelectedSubmission(id)
//         }
//     }, [id, setSelectedSubmission])

//     // Redirect to home if submission not found
//     useEffect(() => {
//         if (id && !currentSubmission) {
//             navigate('/')
//         }
//     }, [id, currentSubmission, navigate])

//     const handleEditSubmission = useCallback(() => {
//         if (currentSubmission) {
//             editSubmission(currentSubmission.id)
//             navigate(`/new-workflow?edit=true&id=${currentSubmission.id}`)
//         }
//     }, [currentSubmission, editSubmission, navigate])

//     const handleExportWorkflow = useCallback(() => {
//         if (currentSubmission && !isExporting) {
//             setIsExporting(true)

//             // Store the current tab
//             const currentTab = activeTab

//             // Set the diagram tab active
//             setActiveTab("diagram")

//             // Add a delay to ensure the diagram is fully rendered
//             setTimeout(() => {
//                 try {
//                     exportWithFlowChart(currentSubmission)
//                 } catch (error) {
//                     console.error("Export failed:", error)
//                     alert("There was an error exporting the workflow. Please try again.")
//                 } finally {
//                     setIsExporting(false)
//                     // Restore the previous tab after export
//                     setActiveTab(currentTab)
//                 }
//             }, 1000)
//         }
//     }, [currentSubmission, activeTab, isExporting])

//     if (!currentSubmission) {
//         return null
//     }

//     return (
//         <main className="min-h-screen">
//             <Background />
//             <Modal />
//             <IntegrationModal />
//             <CommentModal />
//             <ConfirmationModal />
//             <NotificationsPanel />
//             <OfflineBanner />

//             {isOffline && <SyncStatus />}

//             <div className="container mx-auto px-4 py-8">
//                 <Header userName="Rohan" />

//                 <div className="flex justify-between items-center mb-8 mt-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-white">{currentSubmission.name}</h1>
//                         <p className="text-gray-400">
//                             {currentSubmission.businessName} • {currentSubmission.departmentName} •
//                             Last updated: {new Date(currentSubmission.updatedAt || currentSubmission.createdAt).toLocaleDateString()}
//                         </p>
//                     </div>
//                     <div className="flex gap-3">
//                         <Button
//                             onClick={() => navigate("/")}
//                             variant="outline"
//                             className="border-primary/50 text-white"
//                         >
//                             Back to Home
//                         </Button>
//                         <Button
//                             onClick={handleCreateNew}
//                             className="bg-primary text-white hover:bg-primary/90"
//                         >
//                             <PlusCircle className="h-4 w-4 mr-2" />
//                             New Workflow
//                         </Button>
//                     </div>
//                 </div>

//                 <div className="flex justify-center gap-4 mb-8">
//                     <Button
//                         onClick={handleExportWorkflow}
//                         variant="outline"
//                         className="border-primary/50 text-white"
//                         disabled={isExporting}
//                     >
//                         <FileText className="h-4 w-4 mr-2" />
//                         {isExporting ? "Exporting..." : "Export Workflow"}
//                     </Button>

//                     <Button
//                         onClick={handleEditSubmission}
//                         variant="outline"
//                         className="border-primary/50 text-white"
//                     >
//                         <Edit className="h-4 w-4 mr-2" />
//                         Edit Workflow
//                     </Button>
//                 </div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
//                         <TabsList className="bg-black/30 mb-6">
//                             <TabsTrigger
//                                 value="analysis"
//                                 className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                             >
//                                 Analysis
//                             </TabsTrigger>
//                             <TabsTrigger
//                                 value="diagram"
//                                 className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                             >
//                                 Flow Chart Diagram
//                             </TabsTrigger>
//                             <TabsTrigger
//                                 value="costs"
//                                 className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                             >
//                                 Cost Analysis
//                             </TabsTrigger>
//                             <TabsTrigger
//                                 value="integrations"
//                                 className="data-[state=active]:bg-primary data-[state=active]:text-white"
//                             >
//                                 Integrations
//                             </TabsTrigger>
//                         </TabsList>

//                         <TabsContent value="analysis" className="mt-0">
//                             <Analysis submission={currentSubmission} />
//                         </TabsContent>

//                         <TabsContent value="diagram" className="mt-0">
//                             <WorkflowDiagramSimple submission={currentSubmission} />
//                         </TabsContent>

//                         <TabsContent value="costs" className="mt-0">
//                             <AdvancedCostAnalysis submission={currentSubmission} />
//                         </TabsContent>

//                         <TabsContent value="integrations" className="mt-0">
//                             <IntegrationsPanel />
//                         </TabsContent>
//                     </Tabs>
//                 </motion.div>

//                 {/* Collaboration panels */}
//                 {isCollaborating && (
//                     <>
//                         <CollaboratorsPanel submissionId={currentSubmission.id} />
//                         <CommentsPanel submission={currentSubmission} />
//                     </>
//                 )}
//             </div>
//         </main>
//     )

//     function handleCreateNew() {
//         navigate('/new-workflow')
//     }
// }
// src/pages/WorkflowDetails.tsx
// src/pages/WorkflowDetails.tsx



import { motion } from "framer-motion"
import { Download, Edit, FileText, PlusCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Analysis } from "../components/analysis"
import { AdvancedCostAnalysis } from "../components/analytics/advanced-cost-analysis"
import { Background } from "../components/background"
import { CollaboratorsPanel } from "../components/collaboration/collaborators-panel"
import { CommentsPanel } from "../components/collaboration/comments-panel"
import { Header } from "../components/header"
import { IntegrationsPanel } from "../components/integrations/integrations-panel"
import { InteractiveWorkflowChart } from "../components/interactive-workflow-chart"
import { Modal } from "../components/modal"
import { CommentModal } from "../components/modals/comment-modal"
import { ConfirmationModal } from "../components/modals/confirmation-modal"
import { IntegrationModal } from "../components/modals/integration-modal"
import { NotificationsPanel } from "../components/notifications/notifications-panel"
import { OfflineBanner } from "../components/pwa/offline-banner"
import { SyncStatus } from "../components/pwa/sync-status"
import { WorkflowDiagramSimple } from "../components/work-flow-diagram-plant-uml"

import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

import { exportWithFlowChart } from "../services/export-service"
import { useWorkflowStore } from "../store/workflow-store"

export default function WorkflowDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const {
        submissions,
        isOffline,
        isCollaborating,
        editSubmission,
        setSelectedSubmission,
        deleteSubmission,
        openModal
    } = useWorkflowStore()

    const [activeTab, setActiveTab] = useState("analysis")
    const [isExporting, setIsExporting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    // Get current submission based on URL param
    const currentSubmission = submissions.find(sub => sub.id === id)

    // Set the current submission in the store
    useEffect(() => {
        if (id) {
            setSelectedSubmission(id)
        }
    }, [id, setSelectedSubmission])

    // Redirect to home if submission not found
    useEffect(() => {
        if (id && !currentSubmission) {
            navigate('/')
        }
    }, [id, currentSubmission, navigate])

    const handleEditSubmission = useCallback(() => {
        if (currentSubmission) {
            editSubmission(currentSubmission.id)
            navigate(`/new-workflow?edit=true&id=${currentSubmission.id}`)
        }
    }, [currentSubmission, editSubmission, navigate])

    const handleDeleteSubmission = useCallback(() => {
        if (currentSubmission && confirmDelete) {
            deleteSubmission(currentSubmission.id)
            navigate('/', { replace: true })
        } else {
            setConfirmDelete(true)
            // Reset confirmation after 5 seconds
            setTimeout(() => setConfirmDelete(false), 5000)
        }
    }, [currentSubmission, confirmDelete, deleteSubmission, navigate])

    const handleExportWorkflow = useCallback(() => {
        if (currentSubmission && !isExporting) {
            setIsExporting(true)

            // Note to the user that export is in progress
            const exportMessage = document.createElement('div');
            exportMessage.className = 'export-message';
            exportMessage.textContent = 'Preparing your export...';
            exportMessage.style.position = 'fixed';
            exportMessage.style.top = '50%';
            exportMessage.style.left = '50%';
            exportMessage.style.transform = 'translate(-50%, -50%)';
            exportMessage.style.padding = '20px';
            exportMessage.style.background = 'rgba(0, 0, 0, 0.8)';
            exportMessage.style.color = 'white';
            exportMessage.style.borderRadius = '8px';
            exportMessage.style.zIndex = '9999';
            document.body.appendChild(exportMessage);

            // Use the improved exportWithFlowChart function
            try {
                // For our diagram tab, we need to switch to it first to make sure it's rendered
                if (activeTab !== 'diagram') {
                    setActiveTab('diagram');
                    // Give time for the diagram to render
                    setTimeout(async () => {
                        try {
                            await exportWithFlowChart(currentSubmission);
                        } finally {
                            setIsExporting(false);
                            document.body.removeChild(exportMessage);
                        }
                    }, 1000);
                } else {
                    exportWithFlowChart(currentSubmission)
                        .finally(() => {
                            setIsExporting(false);
                            document.body.removeChild(exportMessage);
                        });
                }
            } catch (error) {
                console.error("Export failed:", error);
                alert("There was an error exporting the workflow. Please try again.");
                setIsExporting(false);
                document.body.removeChild(exportMessage);
            }
        }
    }, [currentSubmission, activeTab, isExporting])

    const handleExportOptions = useCallback(() => {
        if (currentSubmission) {
            openModal("export")
        }
    }, [currentSubmission, openModal])

    if (!currentSubmission) {
        return null
    }

    // Format date for display
    const formattedDate = new Date(currentSubmission.updatedAt || currentSubmission.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <main className="min-h-screen">
            <Background />
            <Modal />
            <IntegrationModal />
            <CommentModal />
            <ConfirmationModal />
            <NotificationsPanel />
            <OfflineBanner />

            {isOffline && <SyncStatus />}

            <div className="container mx-auto px-4 py-8">
                <Header userName="Rohan" />

                <Card className="bg-secondary/20 border-primary/30 p-6 mb-8 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{currentSubmission.name}</h1>
                            <p className="text-gray-400">
                                {currentSubmission.businessName} • {currentSubmission.departmentName} •
                                Last updated: {formattedDate}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={() => navigate("/")}
                                variant="outline"
                                className="border-primary/50 text-white"
                            >
                                Back to Home
                            </Button>
                            <Button
                                onClick={handleCreateNew}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                New Workflow
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleExportWorkflow}
                                    variant="outline"
                                    className="border-primary/50 text-white"
                                    disabled={isExporting}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    {isExporting ? "Exporting..." : "Export Complete Report"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Export complete workflow report as PDF</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleExportOptions}
                                    variant="outline"
                                    className="border-primary/50 text-white"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Options
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Choose export format and options</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        onClick={handleEditSubmission}
                        variant="outline"
                        className="border-primary/50 text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Workflow
                    </Button>

                    <Button
                        onClick={handleDeleteSubmission}
                        variant={confirmDelete ? "destructive" : "outline"}
                        className={confirmDelete ? "" : "border-red-500/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"}
                    >
                        {confirmDelete ? "Confirm Delete" : "Delete Workflow"}
                    </Button>
                </div>

                <div id="workflow-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-black/30 mb-6">
                                <TabsTrigger
                                    value="analysis"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    Analysis
                                </TabsTrigger>
                                <TabsTrigger
                                    value="interactive"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    Interactive Workflow
                                </TabsTrigger>
                                <TabsTrigger
                                    value="diagram"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    Flow Chart
                                </TabsTrigger>
                                <TabsTrigger
                                    value="costs"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    Cost Analysis
                                </TabsTrigger>
                                <TabsTrigger
                                    value="integrations"
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    Integrations
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="analysis" className="mt-0" id="analysis-tab">
                                <Analysis submission={currentSubmission} />
                            </TabsContent>

                            <TabsContent value="interactive" className="mt-0" id="interactive-tab">
                                <InteractiveWorkflowChart submission={currentSubmission} />
                            </TabsContent>

                            <TabsContent value="diagram" className="mt-0" id="diagram-tab">
                                {/* Replace WorkflowDiagramSimple with WorkflowDiagramPlantUML */}
                                <WorkflowDiagramSimple submission={currentSubmission} />
                            </TabsContent>

                            <TabsContent value="costs" className="mt-0" id="costs-tab">
                                <AdvancedCostAnalysis submission={currentSubmission} />
                            </TabsContent>

                            <TabsContent value="integrations" className="mt-0" id="integrations-tab">
                                <IntegrationsPanel />
                            </TabsContent>
                        </Tabs>
                    </motion.div>

                    {/* Collaboration panels - mark with no-export class so they're excluded from PDF */}
                    {isCollaborating && (
                        <div className="no-export">
                            <CollaboratorsPanel submissionId={currentSubmission.id} />
                            <CommentsPanel submission={currentSubmission} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    )

    function handleCreateNew() {
        navigate('/new-workflow')
    }
}