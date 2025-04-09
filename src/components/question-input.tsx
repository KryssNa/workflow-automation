// src/components/question-input.tsx
"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"

interface QuestionInputProps {
  id: string
  question: string
  answer: string
  error?: string
  onChange: (id: string, value: string) => void
  index: number
}

export function QuestionInput({ id, question, answer, error, onChange, index }: QuestionInputProps) {
  const [value, setValue] = useState(answer)

  useEffect(() => {
    setValue(answer)
  }, [answer])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange(id, e.target.value)
  }

  const getPlaceholder = (question: string): string => {
    if (question.includes("automate or improve")) {
      return "e.g., Customer onboarding process, Invoice approval workflow, Content creation pipeline..."
    }
    if (question.includes("key steps")) {
      return "e.g., 1. Receive customer information, 2. Verify identity, 3. Create account..."
    }
    if (question.includes("tools or software")) {
      return "e.g., Google Sheets for data entry, Slack for communication, Asana for task tracking..."
    }
    if (question.includes("manual data entry")) {
      return "e.g., Copying information from emails into a database, Manually updating spreadsheets..."
    }
    if (question.includes("key people")) {
      return "e.g., Marketing team creates content, Manager approves, IT team publishes..."
    }
    if (question.includes("receive the information")) {
      return "e.g., Through email submissions, Web form entries, Phone calls..."
    }
    if (question.includes("key decisions")) {
      return "e.g., Determining if a lead qualifies, Deciding which team handles the request..."
    }
    if (question.includes("wait for input")) {
      return "e.g., Manager approval for expenses over $500, Legal review of contracts..."
    }
    if (question.includes("bottlenecks")) {
      return "e.g., Slow approval process, Manual data entry errors, Communication delays..."
    }
    if (question.includes("exceptions")) {
      return "e.g., Escalation to managers, Special handling for VIP customers..."
    }
    if (question.includes("final output")) {
      return "e.g., Approved invoice, Published content, Onboarded customer..."
    }
    if (question.includes("measure the quality")) {
      return "e.g., Customer satisfaction scores, Error rates, Completion time..."
    }
    if (question.includes("could be easily automated")) {
      return "e.g., Data entry, Document generation, Status update notifications..."
    }
    if (question.includes("frequently")) {
      return "e.g., Multiple times daily, Weekly, Monthly for reporting..."
    }
    if (question.includes("how much time")) {
      return "e.g., Data entry: 15 min, Review: 30 min, Approval: 1-2 hours..."
    }
    if (question.includes("monthly salary")) {
      return "e.g., $5,000/month, $60,000/year, $40/hour for 20 hours/week..."
    }

    return "Your answer..."
  }

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <label className={`block mb-3 text-lg ${error ? 'text-red-400' : 'text-white'}`}>
        {index + 1}. {question} {error && <span className="text-red-400">*</span>}
      </label>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder(question)}
        className={`w-full bg-transparent border-2 ${error
            ? 'border-red-500/50 focus:border-red-400'
            : value.trim()
              ? 'border-green-500/50 focus:border-primary'
              : 'border-primary/50 focus:border-primary'
          } text-white rounded-md p-4 min-h-[120px] placeholder:text-gray-400`}
      />
      {error && (
        <div className="flex items-center mt-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          <span>{error}</span>
        </div>
      )}

      {value.trim() && !error && (
        <div className="text-right mt-1">
          <span className="text-green-400 text-xs">
            {value.length < 20 ? 'Consider adding more details' : 'Great response!'}
          </span>
        </div>
      )}
    </motion.div>
  )
}