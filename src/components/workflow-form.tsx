// // src/components/enhanced-workflow-form.tsx
// "use client"

// import { AnimatePresence, motion } from "framer-motion"
// import {
//   AlertTriangle,
//   CheckCircle2, ChevronRight,
//   Loader2
// } from "lucide-react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useFormValidation } from "../hooks/use-formValidation"
// import { useWorkflowStore } from "../store/workflow-store"
// import { QuestionInput } from "./question-input"
// import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
// import { Button } from "./ui/button"
// import { Card, CardContent } from "./ui/card"
// import { Progress } from "./ui/progress"

// export function WorkflowForm() {
//   const {
//     currentQuestions,
//     updateAnswer,
//     submitWorkflow,
//     isEditing,
//     isAnalyzing,
//     currentPage,
//     setCurrentPage,
//     openModal,
//     currentBusinessName,
//     currentDepartmentName,
//     currentWorkflowName,
//     setSelectedSubmission,
//     setShowForm
//   } = useWorkflowStore()

//   const navigate = useNavigate();
//   const [showValidationWarning, setShowValidationWarning] = useState(false);
//   const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

//   const {
//     validationErrors,
//     isFormValid,
//     isSectionComplete,
//     isBusinessInfoComplete
//   } = useFormValidation(currentQuestions);

//   const questionsPerPage = 4
//   const totalPages = Math.ceil(currentQuestions.length / questionsPerPage)
//   const currentPageQuestions = currentQuestions.slice(
//     currentPage * questionsPerPage,
//     (currentPage + 1) * questionsPerPage,
//   )

//   // Calculate progress
//   const completedQuestions = currentQuestions.filter(q => q.answer.trim().length > 0).length;
//   const progressPercentage = Math.floor((completedQuestions / currentQuestions.length) * 100);

//   useEffect(() => {
//     // Check if business info is complete
//     if (!isBusinessInfoComplete(currentBusinessName, currentDepartmentName, currentWorkflowName)) {
//       // Ask for business info if not available
//       if (!currentBusinessName) {
//         openModal("business")
//       } else if (!currentDepartmentName) {
//         openModal("department")
//       } else if (!currentWorkflowName) {
//         openModal("workflow")
//       }
//     }
//   }, [currentBusinessName, currentDepartmentName, currentWorkflowName, openModal])

//   // Toggle section visibility
//   const toggleSection = (sectionId: string) => {
//     setVisibleSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId]
//     }));
//   };

//   const handleNext = () => {
//     // Check if current section is valid before proceeding
//     const currentSectionIds = currentPageQuestions.map(q => q.id);
//     const isSectionValid = isSectionComplete(currentSectionIds);

//     if (!isSectionValid) {
//       setShowValidationWarning(true);
//       // Auto-hide warning after 5 seconds
//       setTimeout(() => setShowValidationWarning(false), 5000);
//       return;
//     }

//     if (currentPage < totalPages - 1) {
//       setCurrentPage(currentPage + 1)
//       window.scrollTo({ top: 0, behavior: "smooth" })
//       setShowValidationWarning(false);
//     }
//   }

//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1)
//       window.scrollTo({ top: 0, behavior: "smooth" })
//       setShowValidationWarning(false);
//     }
//   }

//   const handleSubmit = async () => {
//     if (!isFormValid) {
//       setShowValidationWarning(true);
//       // Show validation errors for all pages
//       setVisibleSections({
//         section1: true,
//         section2: true,
//         section3: true,
//         section4: true
//       });
//       return;
//     }

//     // Clear any validation warnings
//     setShowValidationWarning(false);

//     // Submit the workflow
//     const newWorkflowId = await submitWorkflow();

//     // If submission was successful
//     if (newWorkflowId) {
//       // Set the selected submission ID for display
//       setSelectedSubmission(newWorkflowId);
//       setShowForm(false);

//       // Add a little delay before navigating to ensure state updates
//       setTimeout(() => {
//         navigate(`/?id=${newWorkflowId}`, { replace: true });
//       }, 300);
//     }
//   }

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-xl font-semibold text-white">
//             Workflow Progress
//           </h2>
//           <span className="text-primary font-medium">{progressPercentage}% Complete</span>
//         </div>
//         <Progress value={progressPercentage} className="h-2 bg-gray-700" />
//       </div>

//       <AnimatePresence>
//         {showValidationWarning && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="mb-6"
//           >
//             <Alert variant="destructive" className="bg-red-900/30 border-red-500/50 text-white">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertTitle>Missing Information</AlertTitle>
//               <AlertDescription>
//                 Please complete all required fields before proceeding. Complete responses help us provide better AI-powered recommendations.
//               </AlertDescription>
//             </Alert>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="mb-8">
//         <Card className="mb-6 bg-secondary/30 border-primary/30">
//           <CardContent className="pt-6">
//             <div className="text-sm text-gray-300 mb-2">
//               <span className="text-primary font-medium">Current Section:</span> {currentPage * questionsPerPage + 1}-{Math.min((currentPage + 1) * questionsPerPage, currentQuestions.length)} of {currentQuestions.length} questions
//             </div>
//             {currentPageQuestions.map((question, index) => (
//               <QuestionInput
//                 key={question.id}
//                 id={question.id}
//                 question={question.question}
//                 answer={question.answer}
//                 error={validationErrors[question.id]}
//                 onChange={updateAnswer}
//                 index={index}
//               />
//             ))}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex justify-between">
//         <Button
//           onClick={handlePrevious}
//           disabled={currentPage === 0 || isAnalyzing}
//           variant="outline"
//           className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
//         >
//           Previous
//         </Button>

//         <div className="text-white flex items-center gap-2">
//           {Array.from({ length: totalPages }).map((_, i) => (
//             <Button
//               key={i}
//               variant="ghost"
//               size="sm"
//               className={`w-8 h-8 p-0 ${currentPage === i ? 'bg-primary text-white' : 'bg-gray-800/50 text-gray-400'}`}
//               onClick={() => setCurrentPage(i)}
//             >
//               {i + 1}
//             </Button>
//           ))}
//         </div>

//         {currentPage < totalPages - 1 ? (
//           <Button
//             onClick={handleNext}
//             disabled={isAnalyzing}
//             variant="outline"
//             className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
//           >
//             Next
//           </Button>
//         ) : (
//           <Button
//             onClick={handleSubmit}
//             disabled={isAnalyzing}
//             className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
//           >
//             {isAnalyzing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Analyzing...
//               </>
//             ) : isEditing ? (
//               <>
//                 <CheckCircle2 className="mr-2 h-4 w-4" />
//                 Update
//               </>
//             ) : (
//               <>
//                 <ChevronRight className="mr-2 h-4 w-4" />
//                 Submit
//               </>
//             )}
//           </Button>
//         )}
//       </div>

//       {currentPage === totalPages - 1 && (
//         <motion.div
//           className="mt-8 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <p className="text-gray-300 text-sm">
//             Once submitted, our AI will analyze your workflow and provide recommendations for automation and improvement.
//           </p>
//         </motion.div>
//       )}
//     </motion.div>
//   )
// }
// src/components/workflow-form.tsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2, ChevronRight,
  Loader2
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useFormValidation } from "../hooks/use-formValidation"
import { useWorkflowStore } from "../store/workflow-store"
import { QuestionInput } from "./question-input"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"

export function WorkflowForm() {
  const {
    currentQuestions,
    updateAnswer,
    submitWorkflow,
    isEditing,
    isAnalyzing,
    currentPage,
    setCurrentPage,
    openModal,
    currentBusinessName,
    currentDepartmentName,
    currentWorkflowName,
    setSelectedSubmission,
    setShowForm,
    submissions,
    editSubmission
  } = useWorkflowStore()

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [validatedSections, setValidatedSections] = useState<string[]>([]);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  // Track which sections have been validated
  const {
    validationErrors,
    isFormValid,
    isSectionComplete,
    isBusinessInfoComplete
  } = useFormValidation(currentQuestions);

  // Check if we're in edit mode based on URL parameters
  useEffect(() => {
    const workflowId = searchParams.get("id");
    const editMode = searchParams.get("edit") === "true";

    if (workflowId && editMode && !isEditing) {
      // Find the workflow and set it for editing
      const workflow = submissions.find(sub => sub.id === workflowId);
      if (workflow) {
        editSubmission(workflowId);
      }
    }
  }, [searchParams, submissions, editSubmission, isEditing]);

  const questionsPerPage = 4
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage)
  const currentPageQuestions = currentQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage,
  )

  // Calculate progress
  const completedQuestions = currentQuestions.filter(q => q.answer.trim().length > 0).length;
  const progressPercentage = Math.floor((completedQuestions / currentQuestions.length) * 100);

  const memoizedIsBusinessInfoComplete = useMemo(() => isBusinessInfoComplete, []);

  const checkBusinessInfoComplete = useCallback(() => {
    if (!memoizedIsBusinessInfoComplete(currentBusinessName, currentDepartmentName, currentWorkflowName)) {
      if (!currentBusinessName) {
        openModal("business");
      } else if (!currentDepartmentName) {
        openModal("department");
      } else if (!currentWorkflowName) {
        openModal("workflow");
      }
    }
    // Check if all required fields are complete
    const allRequiredFieldsComplete = currentQuestions.every(q => q.answer.trim() !== "");
    if (allRequiredFieldsComplete) {
      setValidatedSections(prev => [...new Set([...prev, `section${currentPage + 1}`])]);
    } else {
      // If not all required fields are complete, remove the section from validated sections
      const currentSectionId = `section${currentPage + 1}`;
      setValidatedSections(prev => prev.filter(section => section !== currentSectionId));
    }
  }, [currentBusinessName, currentDepartmentName, currentWorkflowName, openModal, memoizedIsBusinessInfoComplete]);

  useEffect(() => {
    checkBusinessInfoComplete();
  }, [checkBusinessInfoComplete]);

  // Only show validation errors for sections that have been validated
  const shouldShowValidationError = (questionId: string) => {
    const sectionIndex = Math.floor(currentQuestions.findIndex(q => q.id === questionId) / questionsPerPage);
    const sectionId = `section${sectionIndex + 1}`;
    return validatedSections.includes(sectionId) && validationErrors[questionId];
  };

  const handleNext = () => {
    // Mark current section as validated
    const currentSectionId = `section${currentPage + 1}`;
    if (!validatedSections.includes(currentSectionId)) {
      setValidatedSections(prev => [...prev, currentSectionId]);
    }

    // Check if current section is valid before proceeding
    const currentSectionIds = currentPageQuestions.map(q => q.id);
    const isSectionValid = isSectionComplete(currentSectionIds);

    if (!isSectionValid) {
      setShowValidationWarning(true);
      // Auto-hide warning after 5 seconds
      setTimeout(() => setShowValidationWarning(false), 5000);
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      setShowValidationWarning(false);
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      setShowValidationWarning(false);
    }
  }

  const handleSubmit = async () => {
    // Mark all sections as validated when trying to submit
    const allSections = Array.from({ length: totalPages }, (_, i) => `section${i + 1}`);
    setValidatedSections(allSections);

    if (!isFormValid) {
      setShowValidationWarning(true);
      return;
    }

    // Clear any validation warnings
    setShowValidationWarning(false);

    // Submit the workflow
    const newWorkflowId = await submitWorkflow();

    // If submission was successful
    if (newWorkflowId) {
      // Set the selected submission ID for display
      setSelectedSubmission(newWorkflowId);
      setShowForm(false);

      // Add a little delay before navigating to ensure state updates
      setTimeout(() => {
        navigate(`/workflow/${newWorkflowId}`, { replace: true });
      }, 300);
    }
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold text-white">
            {isEditing
              ? `Editing: ${currentWorkflowName}`
              : "New Workflow"
            }
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium text-sm">{progressPercentage}% Complete</span>
            <div className="w-24 sm:w-32">
              <Progress value={progressPercentage} className="h-2 bg-gray-700" />
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {currentBusinessName && currentDepartmentName && (
            <>Business: {currentBusinessName} • Department: {currentDepartmentName}</>
          )}
        </p>
      </div>

      <AnimatePresence>
        {showValidationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <Alert variant="destructive" className="bg-red-900/30 border-red-500/50 text-white">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Information</AlertTitle>
              <AlertDescription>
                Please complete all required fields before proceeding. Complete responses help us provide better AI-powered recommendations.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <Card className="mb-6 bg-secondary/30 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-300 mb-4">
              <span className="text-primary font-medium">Current Section:</span> {currentPage * questionsPerPage + 1}-{Math.min((currentPage + 1) * questionsPerPage, currentQuestions.length)} of {currentQuestions.length} questions
            </div>
            {currentPageQuestions.map((question, index) => (
              <QuestionInput
                key={question.id}
                id={question.id}
                question={question.question}
                answer={question.answer}
                error={shouldShowValidationError(question.id) ? validationErrors[question.id] : undefined}
                onChange={updateAnswer}
                index={index}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0 || isAnalyzing}
          variant="outline"
          className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
        >
          Previous
        </Button>

        <div className="text-white flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 ${currentPage === i ? 'bg-primary text-white' : 'bg-gray-800/50 text-gray-400'}`}
              onClick={() => {
                // Mark all previous sections as validated when jumping around
                const previousSections = Array.from(
                  { length: i + 1 },
                  (_, idx) => `section${idx + 1}`
                );
                setValidatedSections(prev =>
                  [...new Set([...prev, ...previousSections])]
                );
                setCurrentPage(i);
              }}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {currentPage < totalPages - 1 ? (
          <Button
            onClick={handleNext}
            disabled={isAnalyzing}
            variant="outline"
            className="border-primary text-white hover:bg-primary/20 rounded-full px-6"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : isEditing ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Update
              </>
            ) : (
              <>
                <ChevronRight className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        )}
      </div>

      {currentPage === totalPages - 1 && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-300 text-sm">
            Once submitted, our AI will analyze your workflow and provide recommendations for automation and improvement.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}