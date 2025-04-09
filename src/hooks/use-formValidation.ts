// src/hooks/use-formValidation.ts
import { useMemo } from 'react'
import type { WorkflowQuestion } from '../types'

export function useFormValidation(questions: WorkflowQuestion[]) {
    // Memoize validation results to avoid recalculating on every render
    const validationResults = useMemo(() => {
        const errors: Record<string, string> = {}
        let isValid = true

        // Validate each question
        for (const question of questions) {
            if (!question.answer || question.answer.trim() === '') {
                errors[question.id] = 'This field is required'
                isValid = false
            } else if (question.answer.length < 3) {
                errors[question.id] = 'Please provide a more detailed answer'
                isValid = false
            }
        }

        // Function to check if a section is complete
        const checkSectionComplete = (questionIds: string[]) => {
            return questionIds.every(id => {
                const question = questions.find(q => q.id === id)
                return question && question.answer && question.answer.trim().length >= 3
            })
        }

        // Check if business info is complete
        const checkBusinessInfoComplete = (
            businessName: string | undefined,
            departmentName: string | undefined,
            workflowName: string | undefined
        ) => {
            return (
                businessName !== undefined &&
                businessName.trim() !== '' &&
                departmentName !== undefined &&
                departmentName.trim() !== '' &&
                workflowName !== undefined &&
                workflowName.trim() !== ''
            )
        }

        return {
            validationErrors: errors,
            isFormValid: isValid,
            isSectionComplete: checkSectionComplete,
            isBusinessInfoComplete: checkBusinessInfoComplete
        }
    }, [questions])

    return validationResults
}