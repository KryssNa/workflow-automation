"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Settings } from "lucide-react"
import { Button } from "./ui/button"
// import { Button } from "/components/ui/button"



interface SidebarProps {
  activeWorkflow?: string
}

export function Sidebar({ activeWorkflow }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Information Technology")

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const categories = [
    {
      name: "Information Technology",
      workflows: ["Task Automation", "Data Processing", "System Integration"],
    },
    {
      name: "Marketing",
      workflows: ["Content Creation", "Campaign Management", "Analytics"],
    },
    {
      name: "Human Resources",
      workflows: ["Recruitment", "Onboarding", "Performance Review"],
    },
    {
      name: "Finance",
      workflows: ["Invoice Processing", "Expense Management", "Financial Reporting"],
    },
  ]

  return (
    <motion.div
      className="bg-black/70 rounded-3xl p-6 h-full flex flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Workflow</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {categories.map((category) => (
          <div key={category.name} className="mb-4">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-white hover:bg-white/10 rounded-lg"
              onClick={() => toggleCategory(category.name)}
            >
              <span>{category.name}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${expandedCategory === category.name ? "rotate-180" : ""}`}
              />
            </Button>

            {expandedCategory === category.name && (
              <div className="mt-2 ml-4 space-y-2">
                {category.workflows.map((workflow) => (
                  <Button
                    key={workflow}
                    variant="ghost"
                    className={`w-full justify-start text-sm pl-4 ${
                      activeWorkflow === workflow
                        ? "bg-primary/20 text-primary"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    } rounded-lg`}
                  >
                    {workflow}
                    {activeWorkflow === workflow && <div className="ml-2 bg-primary w-2 h-2 rounded-full"></div>}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 rounded-lg">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </Button>
      </div>
    </motion.div>
  )
}
