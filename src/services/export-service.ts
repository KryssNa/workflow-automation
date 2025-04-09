import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import type { ExportFormat, WorkflowSubmission } from "../types"

export async function exportAnalysis(
  submission: WorkflowSubmission,
  format: ExportFormat,
  elementId?: string,
): Promise<void> {
  switch (format) {
    case "pdf":
      await exportToPdf(submission, elementId)
      break
    case "text":
      exportToText(submission)
      break
    case "png":
      if (elementId) {
        await exportToPng(elementId)
      } else {
        throw new Error("PNG export requires an element ID")
      }
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

async function exportToPdf(submission: WorkflowSubmission, elementId?: string): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set the title of the PDF
    pdf.setProperties({
      title: "AIWorkflows",
      subject: "Workflow Analysis",
      author: "AI Clone Hub",
      keywords: "workflow, ai, automation",
      creator: "AI Clone Hub",
    })

    // If elementId is provided, use html2canvas to capture the element
    if (elementId) {
      const element = document.getElementById(elementId)
      if (!element) throw new Error("Element not found")

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#1a1a1a",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    } else {
      // Otherwise, generate PDF from workflow data
      let yOffset = 10

      // Add title
      pdf.setFontSize(24)
      pdf.setTextColor(0, 200, 83) // Primary color
      pdf.text("AIWorkflows", 105, yOffset, { align: "center" })
      yOffset += 15

      // Add workflow name
      pdf.setFontSize(18)
      pdf.setTextColor(255, 255, 255)
      pdf.text(`Workflow: ${submission.name}`, 10, yOffset)
      yOffset += 10

      // Add business and department
      pdf.setFontSize(12)
      pdf.text(`Business: ${submission.businessName}`, 10, yOffset)
      yOffset += 7
      pdf.text(`Department: ${submission.departmentName}`, 10, yOffset)
      yOffset += 7
      pdf.text(`Created: ${new Date(submission.createdAt).toLocaleDateString()}`, 10, yOffset)
      yOffset += 12

      // Add analysis section
      if (submission.analysis) {
        pdf.setFontSize(16)
        pdf.setTextColor(0, 200, 83)
        pdf.text("Analysis:", 10, yOffset)
        yOffset += 8

        pdf.setFontSize(10)
        pdf.setTextColor(50, 50, 50)

        // Split analysis into lines to fit page width
        const splitAnalysis = pdf.splitTextToSize(submission.analysis, 190)
        pdf.text(splitAnalysis, 10, yOffset)
        yOffset += splitAnalysis.length * 5 + 10
      }

      // Add Flow Chart Diagram section
      pdf.setFontSize(16)
      pdf.setTextColor(0, 200, 83)
      pdf.text("Flow Chart Diagram:", 10, yOffset)
      yOffset += 8

      pdf.setFontSize(10)
      pdf.setTextColor(50, 50, 50)

      // Add steps
      if (submission.steps && submission.steps.length > 0) {
        for (let j = 0; j < submission.steps.length; j++) {
          const step = submission.steps[j]

          // Check if we need a new page
          if (yOffset > 270) {
            pdf.addPage()
            yOffset = 10
          }

          pdf.setTextColor(0, 0, 0)
          pdf.text(`${j + 1}. ${step.name}`, 10, yOffset)
          yOffset += 5

          pdf.setTextColor(50, 50, 50)
          if (step.description) {
            const splitDesc = pdf.splitTextToSize(`Description: ${step.description}`, 180)
            pdf.text(splitDesc, 15, yOffset)
            yOffset += splitDesc.length * 5
          }

          if (step.tools && step.tools.length > 0) {
            pdf.text(`Tools: ${step.tools.join(", ")}`, 15, yOffset)
            yOffset += 5
          }

          if (step.instructions) {
            const splitInstr = pdf.splitTextToSize(`Instructions: ${step.instructions}`, 180)
            pdf.text(splitInstr, 15, yOffset)
            yOffset += splitInstr.length * 5
          }

          yOffset += 5
        }
      }

      // Add cost analysis section if available
      if (submission.costAnalysis) {
        // Check if we need a new page
        if (yOffset > 200) {
          pdf.addPage()
          yOffset = 10
        }

        pdf.setFontSize(16)
        pdf.setTextColor(0, 200, 83)
        pdf.text("Cost Analysis:", 10, yOffset)
        yOffset += 8

        pdf.setFontSize(10)
        pdf.setTextColor(50, 50, 50)

        const ca = submission.costAnalysis
        pdf.text(`Manual Workflow Cost: $${ca.manualWorkflowCost.toFixed(2)} per task`, 15, yOffset)
        yOffset += 5
        pdf.text(`AI-Assisted Workflow Cost: $${ca.aiAssistedWorkflowCost.toFixed(2)} per task`, 15, yOffset)
        yOffset += 5
        pdf.text(`Net Savings per Task: $${ca.netSavingsPerTask.toFixed(2)}`, 15, yOffset)
        yOffset += 5
        pdf.text(`Weekly Savings (40 tasks): $${ca.weeklySavings.toFixed(2)}`, 15, yOffset)
        yOffset += 5
        pdf.text(`Monthly Savings (160 tasks): $${ca.monthlySavings.toFixed(2)}`, 15, yOffset)
        yOffset += 5
        pdf.text(`Yearly Savings (1,920 tasks): $${ca.yearlySavings.toFixed(2)}`, 15, yOffset)
        yOffset += 10
      }
    }

    // Save the PDF
    pdf.save(`${submission.name}_analysis.pdf`)
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    throw new Error("Failed to export to PDF")
  }
}

function exportToText(submission: WorkflowSubmission): void {
  try {
    let analysisText = "AIWorkflows - WORKFLOW ANALYSIS\n\n"

    analysisText += `
=== ${submission.name} ===
Business: ${submission.businessName}
Department: ${submission.departmentName}
Created: ${new Date(submission.createdAt).toLocaleDateString()}

ANALYSIS:
${submission.analysis || "No analysis available"}

FLOW CHART DIAGRAM:
${submission.steps
        .map(
          (step, index) => `
${index + 1}. ${step.name}
 Description: ${step.description}
 Tools: ${step.tools?.join(", ") || "None specified"}
 Instructions: ${step.instructions || "None provided"}
`,
        )
        .join("\n")}

`

    if (submission.costAnalysis) {
      const ca = submission.costAnalysis
      analysisText += `
COST ANALYSIS:
Manual Workflow Cost: $${ca.manualWorkflowCost.toFixed(2)} per task
AI-Assisted Workflow Cost: $${ca.aiAssistedWorkflowCost.toFixed(2)} per task
Net Savings per Task: $${ca.netSavingsPerTask.toFixed(2)}
Weekly Savings (40 tasks): $${ca.weeklySavings.toFixed(2)}
Monthly Savings (160 tasks): $${ca.monthlySavings.toFixed(2)}
Yearly Savings (1,920 tasks): $${ca.yearlySavings.toFixed(2)}
`
    }

    const blob = new Blob([analysisText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${submission.name}_analysis.txt`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting to text:", error)
    throw new Error("Failed to export to text")
  }
}

async function exportToPng(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) throw new Error("Element not found")

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#1a1a1a",
    })

    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = url
    link.download = "workflow_analysis.png"
    link.click()
  } catch (error) {
    console.error("Error exporting to PNG:", error)
    throw new Error("Failed to export to PNG")
  }
}

// Function to capture and include the flow chart diagram in the PDF
export async function exportWithFlowChart(submission: WorkflowSubmission): Promise<void> {
  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set the title of the PDF
    pdf.setProperties({
      title: "AIWorkflows",
      subject: "Workflow Analysis",
      author: "AI Clone Hub",
      keywords: "workflow, ai, automation",
      creator: "AI Clone Hub",
    })

    let yOffset = 10

    // Add title
    pdf.setFontSize(24)
    pdf.setTextColor(0, 200, 83) // Primary color
    pdf.text("AIWorkflows", 105, yOffset, { align: "center" })
    yOffset += 15

    // Add workflow name
    pdf.setFontSize(18)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Workflow: ${submission.name}`, 10, yOffset)
    yOffset += 10

    // Add business and department
    pdf.setFontSize(12)
    pdf.text(`Business: ${submission.businessName}`, 10, yOffset)
    yOffset += 7
    pdf.text(`Department: ${submission.departmentName}`, 10, yOffset)
    yOffset += 7
    pdf.text(`Created: ${new Date(submission.createdAt).toLocaleDateString()}`, 10, yOffset)
    yOffset += 12

    // Add analysis section
    if (submission.analysis) {
      pdf.setFontSize(16)
      pdf.setTextColor(0, 200, 83)
      pdf.text("Analysis:", 10, yOffset)
      yOffset += 8

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)

      // Split analysis into lines to fit page width
      const splitAnalysis = pdf.splitTextToSize(submission.analysis, 190)
      pdf.text(splitAnalysis, 10, yOffset)
      yOffset += splitAnalysis.length * 5 + 10
    }

    // Try to capture the flow chart diagram
    let diagramImgData = null
    try {
      // First, capture the flow chart diagram
      const diagramElement = document.getElementById("flow-chart-diagram")
      if (diagramElement) {
        const diagramCanvas = await html2canvas(diagramElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1a1a1a",
        })

        diagramImgData = diagramCanvas.toDataURL("image/png")
      }
    } catch (error) {
      console.warn("Could not capture flow chart diagram:", error)
      // Continue without the diagram
    }

    // Add Flow Chart Diagram section
    pdf.setFontSize(16)
    pdf.setTextColor(0, 200, 83)
    pdf.text("Flow Chart Diagram:", 10, yOffset)
    yOffset += 8

    if (diagramImgData) {
      // If we have a diagram image, add it to the PDF
      try {
        // Calculate image dimensions properly
        const imgWidth = 190 // A4 width in mm minus margins

        // Create a temporary image to get dimensions
        const tempImg = new Image()
        tempImg.src = diagramImgData

        // Use a safer approach to calculate height
        // We'll use a fixed aspect ratio if we can't get the actual dimensions
        let imgHeight

        if (tempImg.width && tempImg.height) {
          imgHeight = (tempImg.height * imgWidth) / tempImg.width
        } else {
          // Default to a reasonable aspect ratio if dimensions aren't available
          imgHeight = imgWidth * 0.75 // 4:3 aspect ratio
        }

        // Check if we need a new page for the diagram
        if (yOffset + imgHeight > 280) {
          pdf.addPage()
          yOffset = 10
        }

        // Add the image with proper dimensions
        pdf.addImage(diagramImgData, "PNG", 10, yOffset, imgWidth, imgHeight)
        yOffset += imgHeight + 10
      } catch (error) {
        console.warn("Error adding diagram to PDF:", error)
        // Fall back to text representation
        addTextDiagram(pdf, submission, yOffset)
        // Update yOffset after adding text diagram
        yOffset += submission.steps.length * 15 + 20
      }
    } else {
      // If we don't have a diagram image, add a text representation of the steps
      addTextDiagram(pdf, submission, yOffset)
      // Update yOffset after adding text diagram
      yOffset += submission.steps.length * 15 + 20
    }

    // Add cost analysis section if available
    if (submission.costAnalysis) {
      // Check if we need a new page
      if (yOffset > 200) {
        pdf.addPage()
        yOffset = 10
      }

      pdf.setFontSize(16)
      pdf.setTextColor(0, 200, 83)
      pdf.text("Cost Analysis:", 10, yOffset)
      yOffset += 8

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)

      const ca = submission.costAnalysis
      pdf.text(`Manual Workflow Cost: $${ca.manualWorkflowCost.toFixed(2)} per task`, 15, yOffset)
      yOffset += 5
      pdf.text(`AI-Assisted Workflow Cost: $${ca.aiAssistedWorkflowCost.toFixed(2)} per task`, 15, yOffset)
      yOffset += 5
      pdf.text(`Net Savings per Task: $${ca.netSavingsPerTask.toFixed(2)}`, 15, yOffset)
      yOffset += 5
      pdf.text(`Weekly Savings (40 tasks): $${ca.weeklySavings.toFixed(2)}`, 15, yOffset)
      yOffset += 5
      pdf.text(`Monthly Savings (160 tasks): $${ca.monthlySavings.toFixed(2)}`, 15, yOffset)
      yOffset += 5
      pdf.text(`Yearly Savings (1,920 tasks): $${ca.yearlySavings.toFixed(2)}`, 15, yOffset)
    }

    // Save the PDF
    pdf.save(`${submission.name}_analysis.pdf`)
  } catch (error) {
    console.error("Error exporting with flow chart:", error)
    // Fall back to basic export if there's an error
    try {
      await exportToPdf(submission)
    } catch (fallbackError) {
      console.error("Fallback export also failed:", fallbackError)
      throw new Error("Failed to export workflow")
    }
  }
}

// Helper function to add a text representation of the workflow diagram
function addTextDiagram(pdf: jsPDF, submission: WorkflowSubmission, startY: number): void {
  let yOffset = startY

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)

  // Start of workflow
  pdf.text("Start of Workflow", 105, yOffset, { align: "center" })
  yOffset += 10

  // Draw arrow
  pdf.setDrawColor(0, 200, 83) // Primary color
  pdf.line(105, yOffset - 5, 105, yOffset) // Vertical line
  pdf.line(102, yOffset - 3, 105, yOffset) // Left arrow head
  pdf.line(108, yOffset - 3, 105, yOffset) // Right arrow head
  yOffset += 5

  // Add steps
  if (submission.steps && submission.steps.length > 0) {
    for (let j = 0; j < submission.steps.length; j++) {
      const step = submission.steps[j]

      // Check if we need a new page
      if (yOffset > 270) {
        pdf.addPage()
        yOffset = 10
      }

      // Draw step box
      pdf.setFillColor(240, 240, 240)
      pdf.roundedRect(40, yOffset - 5, 130, 10, 2, 2, "F")

      pdf.setTextColor(0, 0, 0)
      pdf.text(`${j + 1}. ${step.name}`, 105, yOffset, { align: "center" })
      yOffset += 10

      // Draw arrow if not the last step
      if (j < submission.steps.length - 1) {
        pdf.setDrawColor(0, 200, 83) // Primary color
        pdf.line(105, yOffset - 5, 105, yOffset) // Vertical line
        pdf.line(102, yOffset - 3, 105, yOffset) // Left arrow head
        pdf.line(108, yOffset - 3, 105, yOffset) // Right arrow head
        yOffset += 5
      }
    }
  }

  // End of workflow
  pdf.setDrawColor(0, 200, 83) // Primary color
  pdf.line(105, yOffset - 5, 105, yOffset) // Vertical line
  pdf.line(102, yOffset - 3, 105, yOffset) // Left arrow head
  pdf.line(108, yOffset - 3, 105, yOffset) // Right arrow head
  yOffset += 5

  pdf.setFillColor(220, 240, 255)
  pdf.roundedRect(40, yOffset - 5, 130, 10, 2, 2, "F")
  pdf.text("End of Workflow", 105, yOffset, { align: "center" })
}
