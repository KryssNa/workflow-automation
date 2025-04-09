"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { PlusCircle, Zap, ArrowRight, Lightbulb, BarChart } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  const exampleWorkflows = [
    {
      title: "Customer Onboarding",
      description: "Automate the process of welcoming and setting up new customers",
      icon: <Zap className="h-8 w-8 text-primary" />
    },
    {
      title: "Content Approval",
      description: "Streamline review and publishing of marketing materials",
      icon: <Lightbulb className="h-8 w-8 text-primary" />
    },
    {
      title: "Financial Reporting",
      description: "Automate collection and analysis of financial data",
      icon: <BarChart className="h-8 w-8 text-primary" />
    }
  ];
  
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <PlusCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Create Your First Workflow</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-8">
          Start by creating a workflow to identify bottlenecks and automate repetitive tasks with AI assistance.
        </p>
        
        <Button
          onClick={onCreateNew}
          className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create new workflow
        </Button>
      </div>
      
      <div className="w-full max-w-4xl mt-6">
        <h3 className="text-xl font-medium text-white mb-6 text-center">
          Popular workflow templates to get started
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exampleWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Card className="bg-black/30 border-primary/20 h-full hover:border-primary transition-colors cursor-pointer" onClick={onCreateNew}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    {workflow.icon}
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{workflow.title}</h4>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{workflow.description}</p>
                  <Button 
                    variant="ghost" 
                    className="justify-start p-0 text-primary hover:text-primary hover:bg-transparent"
                    onClick={onCreateNew}
                  >
                    Use template <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 bg-secondary/30 border border-primary/30 rounded-xl p-6 text-center">
          <h3 className="text-xl font-medium text-white mb-3">Not sure where to start?</h3>
          <p className="text-gray-400 mb-6">
            Our AI assistant can help you identify which workflows in your business would benefit most from automation.
          </p>
          <Button className="bg-primary text-white hover:bg-primary/90" onClick={onCreateNew}>
            Get AI recommendations
          </Button>
        </div>
      </div>
    </motion.div>
  )
}