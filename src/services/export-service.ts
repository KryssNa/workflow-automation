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

      // Add Flow Chart Diagram section
      pdf.setFontSize(16)
      pdf.setTextColor(0, 200, 83)
      pdf.text("Flow Chart Diagram:", 10, yOffset)
      yOffset += 8

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)

      // Add steps
      if (submission.steps && submission.steps.length > 0) {
        for (let j = 0; j < submission.steps.length; j++) {
          const step = submission.steps[j]

          // Check if we need a new page
          if (yOffset > 270) {
            pdf.addPage()
            yOffset = 10
          }

          pdf.text(`${j + 1}. ${step.name}`, 10, yOffset)
          yOffset += 5

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

// Function to export workflow with all content
export async function exportWithFlowChart(submission: WorkflowSubmission): Promise<void> {
  try {
    // First, look for the flow chart diagram image 
    const diagramImg = document.getElementById("flow-chart-diagram") as HTMLImageElement;

    // Create PDF document with more reliable settings
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set the title of the PDF
    pdf.setProperties({
      title: "AIWorkflows - Complete Report",
      subject: "Workflow Analysis",
      author: "AI Clone Hub",
      keywords: "workflow, ai, automation, analysis",
      creator: "AI Clone Hub",
    });

    // Add title page
    let yOffset = 20;

    // Add title
    pdf.setFontSize(28);
    pdf.setTextColor(83, 0, 200); // Primary color
    pdf.text("Workflow Analysis Report", 105, yOffset, { align: "center" });
    yOffset += 20;

    // Add workflow name
    pdf.setFontSize(22);
    pdf.setTextColor(0, 0, 0);
    pdf.text(submission.name, 105, yOffset, { align: "center" });
    yOffset += 20;

    // Add a separator line
    pdf.setDrawColor(83, 0, 200);
    pdf.setLineWidth(0.5);
    pdf.line(40, yOffset, 170, yOffset);
    yOffset += 15;

    // Add workflow details
    pdf.setFontSize(14);
    pdf.text(`Business: ${submission.businessName}`, 40, yOffset);
    yOffset += 10;

    pdf.text(`Department: ${submission.departmentName}`, 40, yOffset);
    yOffset += 10;

    const dateStr = new Date(submission.updatedAt || submission.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    pdf.text(`Last Updated: ${dateStr}`, 40, yOffset);
    yOffset += 20;

    // Add table of contents
    pdf.setFontSize(16);
    pdf.setTextColor(83, 0, 200);
    pdf.text("Table of Contents", 105, yOffset, { align: "center" });
    yOffset += 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);

    pdf.text("1. Analysis", 60, yOffset);
    pdf.text("Page 2", 150, yOffset);
    yOffset += 10;

    pdf.text("2. Workflow Steps", 60, yOffset);
    pdf.text("Page 3", 150, yOffset);
    yOffset += 10;

    pdf.text("3. Flow Chart Diagram", 60, yOffset);
    pdf.text("Page 4", 150, yOffset);
    yOffset += 10;

    if (submission.costAnalysis) {
      pdf.text("4. Cost Analysis", 60, yOffset);
      pdf.text("Page 5", 150, yOffset);
    }

    // Add page number
    pdf.setFontSize(10);
    pdf.text(`Page 1 of ${submission.costAnalysis ? '5' : '4'}`, 105, 280, { align: "center" });

    // Add analysis page
    pdf.addPage();
    yOffset = 20;

    // Section title
    pdf.setFontSize(20);
    pdf.setTextColor(83, 0, 200);
    pdf.text("1. Analysis", 105, yOffset, { align: "center" });
    yOffset += 15;

    // Add a separator line
    pdf.setDrawColor(83, 0, 200);
    pdf.setLineWidth(0.5);
    pdf.line(40, yOffset, 170, yOffset);
    yOffset += 15;

    // Add analysis content
    if (submission.analysis) {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      // Split analysis into lines to fit page width
      const splitAnalysis = pdf.splitTextToSize(submission.analysis, 150);
      pdf.text(splitAnalysis, 30, yOffset);
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("No analysis available for this workflow.", 30, yOffset);
    }

    // Add page number
    pdf.setFontSize(10);
    pdf.text(`Page 2 of ${submission.costAnalysis ? '5' : '4'}`, 105, 280, { align: "center" });

    // Add steps page
    pdf.addPage();
    yOffset = 20;

    // Section title
    pdf.setFontSize(20);
    pdf.setTextColor(83, 0, 200);
    pdf.text("2. Workflow Steps", 105, yOffset, { align: "center" });
    yOffset += 15;

    // Add a separator line
    pdf.setDrawColor(83, 0, 200);
    pdf.setLineWidth(0.5);
    pdf.line(40, yOffset, 170, yOffset);
    yOffset += 15;

    // Add steps
    if (submission.steps && submission.steps.length > 0) {
      for (let i = 0; i < submission.steps.length; i++) {
        const step = submission.steps[i];

        // Check if we need a new page
        if (yOffset > 240) {
          pdf.addPage();
          yOffset = 20;

          // Add continuation header
          pdf.setFontSize(16);
          pdf.setTextColor(83, 0, 200);
          pdf.text("2. Workflow Steps (continued)", 105, yOffset, { align: "center" });
          yOffset += 15;
        }

        // Step number and name
        pdf.setFontSize(14);
        pdf.setTextColor(83, 0, 200);
        pdf.text(`Step ${i + 1}: ${step.name}`, 30, yOffset);
        yOffset += 8;

        // Step description
        if (step.description) {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          const splitDesc = pdf.splitTextToSize(`Description: ${step.description}`, 150);
          pdf.text(splitDesc, 35, yOffset);
          yOffset += splitDesc.length * 5 + 2;
        }

        // Step tools
        if (step.tools && step.tools.length > 0) {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          const toolsText = `Tools: ${step.tools.join(", ")}`;
          const splitTools = pdf.splitTextToSize(toolsText, 150);
          pdf.text(splitTools, 35, yOffset);
          yOffset += splitTools.length * 5 + 2;
        }

        // Step instructions
        if (step.instructions) {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          const splitInstr = pdf.splitTextToSize(`Instructions: ${step.instructions}`, 150);
          pdf.text(splitInstr, 35, yOffset);
          yOffset += splitInstr.length * 5 + 2;
        }

        // Add spacer between steps
        yOffset += 5;
      }
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("No workflow steps available.", 30, yOffset);
    }

    // Add page number
    pdf.setFontSize(10);
    pdf.text(`Page 3 of ${submission.costAnalysis ? '5' : '4'}`, 105, 280, { align: "center" });
  }
  catch (error) {
    console.error("Error exporting workflow with flow chart:", error);
    throw new Error("Failed to export workflow with flow chart");
  }
}




// Helper function to add flow chart diagram
function addFlowChartSection(pdf: jsPDF, submission: WorkflowSubmission) {
  let yOffset = 20;

  // Section title
  pdf.setFontSize(20);
  pdf.setTextColor(83, 0, 200);
  pdf.text("3. Flow Chart Diagram", 105, yOffset, { align: "center" });
  yOffset += 15;

  // Add a separator line
  pdf.setDrawColor(83, 0, 200);
  pdf.setLineWidth(0.5);
  pdf.line(40, yOffset, 170, yOffset);
  yOffset += 15;

  // Create visual flow chart
  if (submission.steps && submission.steps.length > 0) {
    const startY = yOffset;
    const centerX = 105;
    const boxWidth = 120;
    const boxHeight = 12;
    const verticalGap = 20;

    // Draw Start box
    drawBox(pdf, centerX - boxWidth / 2, startY, boxWidth, boxHeight, "Start");
    yOffset += boxHeight + 5;

    // Draw arrow
    drawArrow(pdf, centerX, yOffset, centerX, yOffset + 10);
    yOffset += 15;

    // Draw step boxes
    for (let i = 0; i < submission.steps.length; i++) {
      const step = submission.steps[i];

      // Check if we need a new page
      if (yOffset > 240) {
        pdf.addPage();
        yOffset = 30;

        // Add continuation header
        pdf.setFontSize(16);
        pdf.setTextColor(83, 0, 200);
        pdf.text("3. Flow Chart Diagram (continued)", 105, 20, { align: "center" });
      }

      // Draw step box
      drawBox(pdf, centerX - boxWidth / 2, yOffset, boxWidth, boxHeight, `${i + 1}. ${step.name}`);
      yOffset += boxHeight + 5;

      // Draw arrow if not the last step
      if (i < submission.steps.length - 1) {
        drawArrow(pdf, centerX, yOffset, centerX, yOffset + 10);
        yOffset += 15;
      }
    }

    // Draw End arrow and box
    drawArrow(pdf, centerX, yOffset, centerX, yOffset + 10);
    yOffset += 15;

    drawBox(pdf, centerX - boxWidth / 2, yOffset, boxWidth, boxHeight, "End");
  } else {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("No workflow steps available to display as flow chart.", 30, yOffset);
  }

  // Add page number
  pdf.setFontSize(10);
  pdf.text(`Page 4 of ${submission.costAnalysis ? '5' : '4'}`, 105, 280, { align: "center" });
}

// Helper function to add cost analysis section
function addCostAnalysisSection(pdf: jsPDF, submission: WorkflowSubmission) {
  let yOffset = 20;

  // Section title
  pdf.setFontSize(20);
  pdf.setTextColor(83, 0, 200);
  pdf.text("4. Cost Analysis", 105, yOffset, { align: "center" });
  yOffset += 15;

  // Add a separator line
  pdf.setDrawColor(83, 0, 200);
  pdf.setLineWidth(0.5);
  pdf.line(40, yOffset, 170, yOffset);
  yOffset += 15;

  // Add cost analysis content
  if (submission.costAnalysis) {
    const ca = submission.costAnalysis;

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Cost Comparison", 30, yOffset);
    yOffset += 10;

    // Create cost comparison table
    const tableStart = yOffset;
    const colWidth = 80;
    const rowHeight = 10;

    // Draw table headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(30, tableStart, colWidth, rowHeight, 'F');
    pdf.rect(30 + colWidth, tableStart, colWidth, rowHeight, 'F');

    pdf.setFontSize(11);
    pdf.text("Cost Category", 35, tableStart + 7);
    pdf.text("Amount", 35 + colWidth, tableStart + 7);
    yOffset += rowHeight;

    // Draw table rows
    const addTableRow = (label: string, value: string) => {
      pdf.rect(30, yOffset, colWidth, rowHeight);
      pdf.rect(30 + colWidth, yOffset, colWidth, rowHeight);
      pdf.text(label, 35, yOffset + 7);
      pdf.text(value, 35 + colWidth, yOffset + 7);
      yOffset += rowHeight;
    };

    addTableRow("Manual Workflow Cost", `$${ca.manualWorkflowCost.toFixed(2)} per task`);
    addTableRow("AI-Assisted Cost", `$${ca.aiAssistedWorkflowCost.toFixed(2)} per task`);
    addTableRow("Net Savings per Task", `$${ca.netSavingsPerTask.toFixed(2)}`);

    // Highlight the savings section
    pdf.setFillColor(230, 245, 230);
    pdf.rect(30, yOffset, colWidth, rowHeight, 'F');
    pdf.rect(30 + colWidth, yOffset, colWidth, rowHeight, 'F');

    addTableRow("Weekly Savings (40 tasks)", `$${ca.weeklySavings.toFixed(2)}`);

    pdf.setFillColor(220, 240, 220);
    pdf.rect(30, yOffset, colWidth, rowHeight, 'F');
    pdf.rect(30 + colWidth, yOffset, colWidth, rowHeight, 'F');

    addTableRow("Monthly Savings (160 tasks)", `$${ca.monthlySavings.toFixed(2)}`);

    pdf.setFillColor(200, 230, 200);
    pdf.rect(30, yOffset, colWidth, rowHeight, 'F');
    pdf.rect(30 + colWidth, yOffset, colWidth, rowHeight, 'F');

    addTableRow("Yearly Savings (1,920 tasks)", `$${ca.yearlySavings.toFixed(2)}`);

    yOffset += 15;

    // Savings visualization - simple bar chart
    if (yOffset < 180) {
      pdf.setFontSize(14);
      pdf.text("Savings Visualization", 30, yOffset);
      yOffset += 15;

      const barHeight = 12;
      const maxBarWidth = 130;
      const maxValue = Math.max(ca.weeklySavings, ca.monthlySavings / 4, ca.yearlySavings / 52);

      // Weekly bar
      pdf.setFontSize(10);
      pdf.text("Weekly:", 30, yOffset + 8);
      pdf.setFillColor(83, 100, 240);
      const weeklyWidth = (ca.weeklySavings / maxValue) * maxBarWidth;
      pdf.rect(60, yOffset, weeklyWidth, barHeight, 'F');
      pdf.text(`$${ca.weeklySavings.toFixed(2)}`, 60 + weeklyWidth + 5, yOffset + 8);
      yOffset += barHeight + 10;

      // Monthly bar
      pdf.text("Monthly:", 30, yOffset + 8);
      pdf.setFillColor(83, 0, 200);
      const monthlyWidth = (ca.monthlySavings / 4 / maxValue) * maxBarWidth;
      pdf.rect(60, yOffset, monthlyWidth, barHeight, 'F');
      pdf.text(`$${ca.monthlySavings.toFixed(2)}`, 60 + monthlyWidth + 5, yOffset + 8);
      yOffset += barHeight + 10;

      // Yearly bar
      pdf.text("Yearly:", 30, yOffset + 8);
      pdf.setFillColor(200, 0, 83);
      const yearlyWidth = (ca.yearlySavings / 52 / maxValue) * maxBarWidth;
      pdf.rect(60, yOffset, yearlyWidth, barHeight, 'F');
      pdf.text(`$${ca.yearlySavings.toFixed(2)}`, 60 + yearlyWidth + 5, yOffset + 8);
    }
  } else {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("No cost analysis data available for this workflow.", 30, yOffset);
  }

  // Add page number
  pdf.setFontSize(10);
  pdf.text("Page 5 of 5", 105, 280, { align: "center" });
}

// Helper function to draw a box with text
function drawBox(pdf: jsPDF, x: number, y: number, width: number, height: number, text: string) {
  // Draw filled box with darker border
  pdf.setFillColor(240, 240, 255);
  pdf.setDrawColor(83, 0, 200);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');

  // Add text
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.text(text, x + width / 2, y + height / 2 + 1, { align: 'center', baseline: 'middle' });
}

// Helper function to draw an arrow
function drawArrow(pdf: jsPDF, startX: number, startY: number, endX: number, endY: number) {
  // Set arrow color
  pdf.setDrawColor(83, 0, 200);
  pdf.setLineWidth(0.5);

  // Draw line
  pdf.line(startX, startY, endX, endY);

  // Draw arrowhead
  const arrowSize = 2;
  pdf.line(endX - arrowSize, endY - arrowSize, endX, endY);
  pdf.line(endX + arrowSize, endY - arrowSize, endX, endY);
}