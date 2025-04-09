import { motion } from 'framer-motion';
import { AlertCircle, Check, ChevronRight, Clock, Download, Edit, Share, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

// Sample data structure for the workflow
const sampleWorkflow = {
    name: "Customer Onboarding Process",
    steps: [
        {
            id: 'step1',
            name: 'Initial Contact',
            description: 'First interaction with customer',
            tools: ['Email', 'CRM'],
            timeEstimate: 15,
            manualCost: 35,
            aiAssistedCost: 15,
            status: "completed"
        },
        {
            id: 'step2',
            name: 'Document Collection',
            description: 'Gather necessary documents',
            tools: ['Dropbox', 'DocuSign'],
            timeEstimate: 30,
            manualCost: 65,
            aiAssistedCost: 20,
            status: "completed"
        },
        {
            id: 'step3',
            name: 'Verification',
            description: 'Verify customer identity and documents',
            tools: ['Onfido', 'Internal Tools'],
            timeEstimate: 45,
            manualCost: 95,
            aiAssistedCost: 35,
            status: "in-progress"
        },
        {
            id: 'step4',
            name: 'Account Creation',
            description: 'Create customer account in system',
            tools: ['CRM', 'Internal Database'],
            timeEstimate: 20,
            manualCost: 45,
            aiAssistedCost: 15,
            status: "not-started"
        },
        {
            id: 'step5',
            name: 'Welcome Package',
            description: 'Send welcome materials to customer',
            tools: ['Email Marketing', 'PDF Generator'],
            timeEstimate: 25,
            manualCost: 55,
            aiAssistedCost: 10,
            status: "not-started"
        }
    ]
};

export const InteractiveWorkflowChart = ({ submission }) => {
    const [activeStep, setActiveStep] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [workflow, setWorkflow] = useState(submission || sampleWorkflow);

    useEffect(() => {
        if (submission) {
            setWorkflow(submission);
        }
    }, [submission]);

    const totalTime = workflow.steps.reduce((sum, step) => sum + (step.timeEstimate || 0), 0);
    const totalManualCost = workflow.steps.reduce((sum, step) => sum + (step.manualCost || 0), 0);
    const totalAICost = workflow.steps.reduce((sum, step) => sum + (step.aiAssistedCost || 0), 0);
    const totalSavings = totalManualCost - totalAICost;

    const handleStepClick = (stepId) => {
        if (activeStep === stepId) {
            setShowDetails(!showDetails);
        } else {
            setActiveStep(stepId);
            setShowDetails(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'in-progress':
                return 'bg-blue-500';
            case 'blocked':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <Check className="h-4 w-4" />;
            case 'in-progress':
                return <Clock className="h-4 w-4" />;
            case 'blocked':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <ChevronRight className="h-4 w-4" />;
        }
    };

    return (
        <div className="w-full">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    className="bg-secondary/20 border border-primary/20 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-gray-400 text-sm mb-1">Total Steps</div>
                    <div className="text-2xl font-bold text-white">{workflow.steps.length}</div>
                </motion.div>

                <motion.div
                    className="bg-secondary/20 border border-primary/20 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="text-gray-400 text-sm mb-1">Total Time</div>
                    <div className="text-2xl font-bold text-white">{totalTime} mins</div>
                </motion.div>

                <motion.div
                    className="bg-secondary/20 border border-primary/20 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="text-gray-400 text-sm mb-1">Manual Cost</div>
                    <div className="text-2xl font-bold text-white">${totalManualCost}</div>
                </motion.div>

                <motion.div
                    className="bg-secondary/20 border border-primary/20 rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <div className="text-gray-400 text-sm mb-1">AI-Assisted Savings</div>
                    <div className="text-2xl font-bold text-primary">${totalSavings}</div>
                </motion.div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-6">
                {workflow.steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className={`border ${activeStep === step.id ? 'border-primary' : 'border-primary/20'} 
                        rounded-lg overflow-hidden bg-secondary/20`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => handleStepClick(step.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-white mr-3`}>
                                    {getStatusIcon(step.status)}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg">{index + 1}. {step.name}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-gray-400 text-xs">Time</div>
                                    <div className="text-white">{step.timeEstimate} mins</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-xs">Savings</div>
                                    <div className="text-primary">${step.manualCost - step.aiAssistedCost}</div>
                                </div>
                                <ChevronRight className={`h-5 w-5 text-gray-400 transform transition-transform ${activeStep === step.id && showDetails ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {/* Expanded details */}
                        {activeStep === step.id && showDetails && (
                            <motion.div
                                className="p-4 border-t border-primary/20 bg-black/20"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="text-white font-medium mb-2 flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-primary" />
                                            Time Analysis
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Manual Process:</span>
                                                <span className="text-white">{step.timeEstimate} mins</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">AI-Assisted:</span>
                                                <span className="text-white">{Math.round(step.timeEstimate * 0.6)} mins</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Time Savings:</span>
                                                <span className="text-primary">{Math.round(step.timeEstimate * 0.4)} mins (40%)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-medium mb-2 flex items-center">
                                            <Zap className="h-4 w-4 mr-2 text-primary" />
                                            Cost Analysis
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Manual Cost:</span>
                                                <span className="text-white">${step.manualCost}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">AI-Assisted Cost:</span>
                                                <span className="text-white">${step.aiAssistedCost}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Cost Savings:</span>
                                                <span className="text-primary">${step.manualCost - step.aiAssistedCost} ({Math.round((1 - step.aiAssistedCost / step.manualCost) * 100)}%)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-medium mb-2 flex items-center">
                                            <Share className="h-4 w-4 mr-2 text-primary" />
                                            Tools & Integration
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {step.tools && step.tools.map((tool, i) => (
                                                    <span key={i} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-xs flex items-center">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </button>
                                                <button className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded text-xs flex items-center">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-4">
                <button className="border border-primary/50 text-white hover:bg-primary/20 px-4 py-2 rounded-lg flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Workflow
                </button>
                <button className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Workflow
                </button>
            </div>
        </div>
    )
}