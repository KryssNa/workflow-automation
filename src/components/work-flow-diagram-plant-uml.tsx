// "use client"

// import { useEffect, useState } from "react"
// import type { WorkflowSubmission } from "../types"
// import { Button } from "./ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

// interface WorkflowDiagramProps {
//     submission: WorkflowSubmission
// }

// export function WorkflowDiagramPlantUML({ submission }: WorkflowDiagramProps) {
//     const [diagramUrl, setDiagramUrl] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         if (!submission || !submission.steps || submission.steps.length === 0) {
//             setIsLoading(false)
//             setError("No workflow data available to generate diagram")
//             return
//         }

//         const generatePlantUMLDiagram = async () => {
//             setIsLoading(true)
//             setError(null)

//             try {
//                 // Generate dynamic PlantUML code based on the actual submission steps
//                 const plantumlCode = generatePlantUMLFromSubmission(submission)

//                 // Send the PlantUML code to your service
//                 const response = await fetch('https://sunil-nine.vercel.app/generate-urls', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ plantumlCode }),
//                 })

//                 if (!response.ok) {
//                     throw new Error(`Failed to generate diagram URL: ${response.statusText}`)
//                 }

//                 const data = await response.json()

//                 // Set the diagram URL from the response
//                 if (data && data.url) {
//                     setDiagramUrl(data.url)
//                 } else {
//                     throw new Error('No diagram URL received from server')
//                 }
//             } catch (err) {
//                 console.error('Error generating diagram:', err)
//                 setError(err instanceof Error ? err.message : 'Failed to generate workflow diagram')

//                 // Fallback to a direct PlantUML service if available
//                 try {
//                     // Create a simplified version for fallback
//                     const simplifiedPlantUML = generateSimplifiedPlantUML(submission)
//                     const encoded = encodeURIComponent(simplifiedPlantUML)
//                     setDiagramUrl(`https://www.plantuml.com/plantuml/svg/${encoded}`)
//                 } catch (fallbackErr) {
//                     console.error('Fallback diagram generation failed:', fallbackErr)
//                 }
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         generatePlantUMLDiagram()
//     }, [submission])

//     // Function to generate PlantUML code from submission data
//     const generatePlantUMLFromSubmission = (submission: WorkflowSubmission): string => {
//         let umlCode = "@startuml\n\nstart\n\n"

//         // Add analysis phase steps if available (typically from deepseek response)
//         umlCode += `:Task Identification;\nnote right\nManual Time: 15 mins\nend note\n\n`
//         umlCode += `:Identify Bottlenecks and Inefficiencies;\nnote right\nManual Time: 20 mins\nend note\n\n`

//         // Add each step from the workflow with its time estimate and tools
//         submission.steps.forEach(step => {
//             // Add the step name
//             umlCode += `:${step.name};\nnote right\nManual Time: ${step.timeEstimate || 'Unknown'} mins\nend note\n\n`

//             // Add the tools if available
//             if (step.tools && step.tools.length > 0) {
//                 umlCode += `:Use ${step.tools.join(' or ')};\n\n`
//             }
//         })

//         // Add cost calculation section
//         umlCode += `if (Total Time Saved) then (Yes)\n`
//         umlCode += ` :Calculate Time Saved;\n note right\n ${calculateTotalTime(submission)} mins\n end note\n`

//         const hourlyRate = submission.hourlyRate || 50
//         const totalSavings = (calculateTotalTime(submission) / 60) * hourlyRate

//         umlCode += ` :Multiply by Hourly Rate ($${hourlyRate});\n note right\n $${totalSavings.toFixed(2)}\n end note\n`
//         umlCode += `endif\n\nstop\n\n@enduml`

//         return umlCode
//     }

//     // Simplified PlantUML for fallback
//     const generateSimplifiedPlantUML = (submission: WorkflowSubmission): string => {
//         let umlCode = "@startuml\nstart\n"

//         // Add each step in a simpler format
//         submission.steps.forEach(step => {
//             umlCode += `:${step.name};\nnote right: Manual Time: ${step.timeEstimate || 'Unknown'} mins\n`
//         })

//         umlCode += `if (Total Time Saved) then (Yes)\n`
//         umlCode += `  :Calculate Time Saved;\n`
//         umlCode += `  note right: ${calculateTotalTime(submission)} mins\n`
//         umlCode += `  :Multiply by Hourly Rate;\n`
//         umlCode += `  note right: $${((calculateTotalTime(submission) / 60) * (submission.hourlyRate || 50)).toFixed(2)}\n`
//         umlCode += `endif\nstop\n@enduml`

//         return umlCode
//     }

//     // Calculate total time based on the workflow steps
//     const calculateTotalTime = (submission: WorkflowSubmission): number => {
//         return submission.steps.reduce((total, step) => total + (step.timeEstimate || 0), 0)
//     }

//     const totalManualTime = calculateTotalTime(submission)
//     const hourlyRate = submission?.hourlyRate || 50 // Default hourly rate
//     const totalSavings = (totalManualTime / 60) * hourlyRate

//     return (
//         <Card className="bg-secondary/50 border-primary/30 text-white">
//             <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                     <span>Workflow Diagram: {submission?.name || 'Current Workflow'}</span>

//                     <Button
//                         variant="outline"
//                         className="text-white border-primary/50 hover:bg-primary/20"
//                         onClick={() => diagramUrl && window.open(diagramUrl, '_blank')}
//                         disabled={!diagramUrl || isLoading}
//                     >
//                         Open Full Diagram
//                     </Button>
//                 </CardTitle>
//             </CardHeader>

//             <CardContent>
//                 {isLoading ? (
//                     <div className="flex justify-center items-center py-20">
//                         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
//                         <span className="ml-4 text-white">Generating workflow diagram...</span>
//                     </div>
//                 ) : error ? (
//                     <div className="text-center py-10 bg-red-900/20 rounded-md">
//                         <p className="text-red-400 mb-4">{error}</p>
//                         <Button
//                             variant="outline"
//                             className="text-white border-red-500/50 hover:bg-red-500/20"
//                             onClick={() => window.location.reload()}
//                         >
//                             Retry
//                         </Button>
//                     </div>
//                 ) : diagramUrl ? (
//                     <div className="flex flex-col items-center">
//                         <div className="bg-black/20 p-4 rounded-md mb-6 w-full max-w-4xl mx-auto overflow-hidden">
//                             <img
//                                 src={diagramUrl}
//                                 alt="Workflow Diagram"
//                                 className="w-full h-auto bg-white/5 rounded-md object-contain mx-auto"
//                                 style={{ maxHeight: 'auto', maxWidth: '100%' }}
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
//                             <div className="bg-black/20 p-4 rounded-md">
//                                 <h3 className="text-lg font-medium mb-2 text-primary">Workflow Details</h3>
//                                 <div className="space-y-2">
//                                     <p><span className="text-gray-400">Total Manual Time:</span> {totalManualTime} minutes</p>
//                                     <p><span className="text-gray-400">Hourly Rate:</span> ${hourlyRate}</p>
//                                     <p><span className="text-gray-400">Cost per Workflow Run:</span> ${totalSavings.toFixed(2)}</p>
//                                 </div>
//                             </div>

//                             <div className="bg-black/20 p-4 rounded-md">
//                                 <h3 className="text-lg font-medium mb-2 text-primary">Key Automation Tools</h3>
//                                 <ul className="list-disc list-inside space-y-1 text-gray-300">
//                                     {submission.steps.map((step, index) => (
//                                         step.tools && step.tools.length > 0 ? (
//                                             <li key={index}>
//                                                 {step.tools.join('/')} ({step.name})
//                                             </li>
//                                         ) : null
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-center py-10">
//                         <p>No workflow diagram available</p>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }
// src/components/workflow-diagram-simple.tsx// src/components/workflow-diagram-simple.tsx
import { useEffect, useState } from "react"
import type { WorkflowSubmission } from "../types"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface WorkflowDiagramSimpleProps {
    submission: WorkflowSubmission
}

export function WorkflowDiagramSimple({ submission }: WorkflowDiagramSimpleProps) {
    const [diagramUrl, setDiagramUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!submission) return

        const generatePlantUMLDiagram = async () => {
            setIsLoading(true)
            setError(null)
            setDiagramUrl(null) // Reset on each refresh to ensure we get a fresh diagram

            try {
                // Always generate a fresh PlantUML code from the current submission data
                // (ignore any cached plantumlCode to ensure we always have the latest)
                const plantumlCode = generateDynamicPlantUML(submission)

                // Send the PlantUML code to the service
                const response = await fetch('https://sunil-nine.vercel.app/generate-urls', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ plantumlCode }),
                })

                if (!response.ok) {
                    throw new Error(`Failed to generate diagram URL: ${response.statusText}`)
                }

                const data = await response.json()

                // Set the diagram URL from the response
                if (data && data.url) {
                    setDiagramUrl(data.url)
                } else {
                    throw new Error('No diagram URL received from server')
                }
            } catch (err) {
                console.error('Error generating diagram:', err)
                setError(err instanceof Error ? err.message : 'Failed to generate workflow diagram')

                // Fallback to a direct PlantUML service
                try {
                    const simplifiedCode = generateSimplePlantUML(submission)
                    const encodedPlantuml = encodeURIComponent(simplifiedCode)
                    setDiagramUrl(`https://www.plantuml.com/plantuml/svg/${encodedPlantuml}`)
                } catch (fallbackErr) {
                    console.error('Fallback diagram generation failed:', fallbackErr)
                }
            } finally {
                setIsLoading(false)
            }
        }

        generatePlantUMLDiagram()
    }, [submission])

    // Function to generate a dynamic PlantUML code from the submission data
    function generateDynamicPlantUML(submission: WorkflowSubmission): string {
        let umlCode = "@startuml\n\nstart\n\n"

        // Add initial analysis steps if they exist in the workflow
        // Don't use hardcoded values - use actual steps from the submission

        // Add each step from the workflow
        submission.steps.forEach((step, index) => {
            // Add the step name with its time estimate
            umlCode += `:${step.name};\nnote right\nManual Time: ${step.timeEstimate || 'Unknown'} mins\nend note\n\n`

            // Add the tools if available
            if (step.tools && step.tools.length > 0) {
                umlCode += `:Use ${step.tools.join(' or ')};\n\n`
            }
        })

        // Add cost calculation section if hourly rate is available
        const totalTime = submission.steps.reduce((sum, step) => sum + (step.timeEstimate || 0), 0)
        const hourlyRate = submission.hourlyRate || 50
        const totalCost = (totalTime / 60) * hourlyRate

        umlCode += `if (Total Time Saved) then (Yes)\n`
        umlCode += ` :Calculate Time Saved;\n note right\n ${totalTime} mins\n end note\n\n`
        umlCode += ` :Multiply by Hourly Rate ($${hourlyRate});\n note right\n $${totalCost.toFixed(2)}\n end note\n\n`
        umlCode += `endif\n\n`

        umlCode += `stop\n\n@enduml`
        return umlCode
    }

    // Simpler version for fallback
    function generateSimplePlantUML(submission: WorkflowSubmission): string {
        let umlCode = "@startuml\nstart\n"

        submission.steps.forEach(step => {
            umlCode += `:${step.name};\nnote right: ${step.timeEstimate || '?'} mins\n`
        })

        const totalTime = submission.steps.reduce((sum, step) => sum + (step.timeEstimate || 0), 0)
        const hourlyRate = submission.hourlyRate || 50

        umlCode += `if (Cost) then (Yes)\n`
        umlCode += `  :Total: ${totalTime} mins = $${((totalTime / 60) * hourlyRate).toFixed(2)};\n`
        umlCode += `endif\n`
        umlCode += "stop\n@enduml"

        return umlCode
    }

    // Calculate total time and cost based on the workflow steps
    const calculateTotalTime = (): number => {
        return submission.steps.reduce((total, step) => total + (step.timeEstimate || 0), 0)
    }

    const totalManualTime = calculateTotalTime()
    const hourlyRate = submission?.hourlyRate || 50 // Default hourly rate
    const totalSavings = (totalManualTime / 60) * hourlyRate

    return (
        <Card className="bg-secondary/50 border-primary/30 text-white">
            <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span>Flow Chart Diagram: {submission?.name || 'Current Workflow'}</span>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="text-white border-primary/50 hover:bg-primary/20"
                            onClick={() => {
                                // Force refresh the diagram
                                setIsLoading(true)
                                setDiagramUrl(null)
                                const generatePlantUMLDiagram = async () => {
                                    try {
                                        const plantumlCode = generateDynamicPlantUML(submission)
                                        const response = await fetch('https://sunil-nine.vercel.app/generate-urls', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ plantumlCode }),
                                        })
                                        if (!response.ok) throw new Error('Failed to refresh diagram')
                                        const data = await response.json()
                                        if (data && data.url) setDiagramUrl(data.url)
                                    } catch (err) {
                                        console.error('Error refreshing diagram:', err)
                                        const simplifiedCode = generateSimplePlantUML(submission)
                                        const encodedPlantuml = encodeURIComponent(simplifiedCode)
                                        setDiagramUrl(`https://www.plantuml.com/plantuml/svg/${encodedPlantuml}`)
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }
                                generatePlantUMLDiagram()
                            }}
                        >
                            Refresh Diagram
                        </Button>
                        <Button
                            variant="outline"
                            className="text-white border-primary/50 hover:bg-primary/20"
                            onClick={() => diagramUrl && window.open(diagramUrl, '_blank')}
                            disabled={!diagramUrl || isLoading}
                        >
                            Open Full Diagram
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-4 text-white">Generating workflow diagram...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 bg-red-900/20 rounded-md">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            variant="outline"
                            className="text-white border-red-500/50 hover:bg-red-500/20"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                ) : diagramUrl ? (
                    <div className="flex flex-col items-center">
                        <div className="bg-black/20 p-4 rounded-md mb-6 w-full max-w-4xl mx-auto overflow-auto">
                            <img
                                src={diagramUrl}
                                alt="Workflow Diagram"
                                className="bg-white/5 rounded-md shadow-md mx-auto"
                                id="flow-chart-diagram" // Important ID for export functionality
                                style={{ maxWidth: '100%' }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="bg-black/20 p-4 rounded-md">
                                <h3 className="text-lg font-medium mb-2 text-primary">Workflow Details</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-400">Total Manual Time:</span> {totalManualTime} minutes</p>
                                    <p><span className="text-gray-400">Hourly Rate:</span> ${hourlyRate.toFixed(2)}</p>
                                    <p><span className="text-gray-400">Cost per Workflow Run:</span> ${totalSavings.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="bg-black/20 p-4 rounded-md">
                                <h3 className="text-lg font-medium mb-2 text-primary">Key Automation Tools</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {submission.steps.map((step, index) => (
                                        step.tools && step.tools.length > 0 ? (
                                            <li key={index}>
                                                {step.tools.join('/')} ({step.name})
                                            </li>
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p>No workflow diagram available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}