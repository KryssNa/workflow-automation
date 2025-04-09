import type { WorkflowQuestion, DeepseekResponse, WorkflowStep } from "../types"
import { getRecommendedToolsForWorkflow } from "./tools-service"

const API_KEY = "sk-6796ea0f38c7499dbf47c7ff2a026966"
const API_URL = "https://api.deepseek.com/v1/chat/completions"

export async function generateWorkflowAnalysis(questions: WorkflowQuestion[]): Promise<DeepseekResponse> {
  try {
    // Format the questions and answers for the API
    const formattedQuestions = questions.map((q) => `${q.question}\nAnswer: ${q.answer}`).join("\n\n")

    // Extract workflow description from the first question
    const workflowDescription = questions[0]?.answer || ""

    // Extract workflow steps from the second question
    const workflowStepsText = questions[1]?.answer || ""
    const workflowSteps = workflowStepsText.split(/\n|,/).filter((step) => step.trim().length > 0)

    // Get hourly rate if provided
    const hourlyRateQuestion = questions.find(q => 
      q.question.toLowerCase().includes("salary") || 
      q.question.toLowerCase().includes("cost") ||
      q.question.toLowerCase().includes("hourly") ||
      q.question.toLowerCase().includes("rate")
    )
    const hourlyRate = extractHourlyRate(hourlyRateQuestion?.answer || "")

    // Improved prompt that specifically requests a PlantUML diagram with proper formatting
    const prompt = `
      Analyze the following workflow information and provide recommendations for automation and AI integration:
      
      ${formattedQuestions}
      
      Please provide your response in the following JSON format:
      {
        "analysis": "A detailed analysis of the workflow",
        "recommendations": ["Recommendation 1", "Recommendation 2", ...],
        "steps": [
          {
            "id": "step1",
            "name": "Step Name",
            "description": "Step Description",
            "timeEstimate": 15,
            "manualCost": 25,
            "aiAssistedCost": 0.52,
            "tools": ["Tool1", "Tool2"],
            "instructions": "Instructions for this step"
          },
          ...
        ],
        "costAnalysis": {
          "manualWorkflowCost": 25,
          "aiAssistedWorkflowCost": 0.52,
          "netSavingsPerTask": 24.48,
          "weeklySavings": 979.2,
          "monthlySavings": 3916.8,
          "quarterlySavings": 11750.4,
          "yearlySavings": 47001.6
        }
      }
    `

    try {
      // Make the actual API call to Deepseek
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: "You are an AI workflow optimization expert."
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Deepseek API error:", errorText)
        throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      try {
        // Parse the JSON response
        const parsedResponse = JSON.parse(content)

        // Get recommended tools based on workflow description and steps
        const recommendedTools = await getRecommendedToolsForWorkflow(workflowDescription, workflowSteps)

        // Note: We no longer store the PlantUML code in the response to ensure fresh generation each time
        // Instead, we'll dynamically generate it in the component

        // Enhance the response with real tool recommendations and hourly rate
        const enhancedResponse: DeepseekResponse = {
          ...parsedResponse,
          tools: recommendedTools.map((tool) => ({
            name: tool.company_name,
            description: tool.company_description || tool.main_features,
            cost: tool.pricing || "Custom pricing available",
          })),
          hourlyRate: hourlyRate || 50, // Store the hourly rate in the response
        }

        return enhancedResponse
      } catch (parseError) {
        console.error("Error parsing Deepseek response:", parseError)
        throw new Error("Failed to parse Deepseek response")
      }
    } catch (apiError) {
      console.error("Error calling Deepseek API:", apiError)
      // Fall back to simulated response if API call fails
      return simulateDeepseekResponse(questions, workflowDescription, workflowSteps, hourlyRate)
    }
  } catch (error) {
    console.error("Error generating workflow analysis:", error)
    throw new Error("Failed to generate workflow analysis")
  }
}

// Helper function to extract hourly rate from text
function extractHourlyRate(text: string): number | null {
  if (!text) return null
  
  // Look for numbers after currency symbols or with keywords like "hourly", "rate", "salary"
  const currencyRegex = /\$\s*(\d+(\.\d+)?)|(\d+(\.\d+)?)\s*\/\s*h(ou)?r|\$(\d+)k|\$(\d+),(\d+)/i
  const match = text.match(currencyRegex)
  
  if (match) {
    // Extract the number part
    const rateStr = match[1] || match[3] || match[6] || (match[7] + match[8])
    let rate = parseFloat(rateStr)
    
    // If it's an annual salary (likely if over 100), convert to hourly
    // Assuming 2080 work hours per year (40 hours/week * 52 weeks)
    if (rate > 100 || match[6]) {
      // If it's in thousands (e.g., $120k)
      if (match[6]) {
        rate = rate * 1000
      }
      rate = rate / 2080
    }
    
    return rate
  }
  
  return null
}

async function simulateDeepseekResponse(
  questions: WorkflowQuestion[],
  workflowDescription: string,
  workflowSteps: string[],
  hourlyRate?: number | null,
): Promise<DeepseekResponse> {
  // Extract the workflow name from the first question if available
  const workflowName = workflowDescription || "workflow"

  // Get recommended tools based on workflow description and steps
  const recommendedTools = await getRecommendedToolsForWorkflow(workflowDescription, workflowSteps)

  const defaultSteps: WorkflowStep[] = [
    {
      id: "step1",
      name: "Task Identification and Initiation",
      description: "Identify tasks and initiate the workflow",
      timeEstimate: 15,
      manualCost: 25,
      aiAssistedCost: 0.52,
      tools: ["Zapier", "Make"],
      instructions:
        "Use Zapier's visual interface to connect different apps and services, ensuring seamless initiation of tasks.",
    },
    {
      id: "step2",
      name: "Data Collection",
      description: "Collect data from various sources",
      timeEstimate: 30,
      manualCost: 25,
      aiAssistedCost: 0.52,
      tools: ["Otter.ai", "Pipefy"],
      instructions:
        "Use Otter.ai to record meetings and convert them into searchable text. For data entry, create customizable forms in Pipefy to standardize processes.",
    },
    {
      id: "step3",
      name: "Data Processing",
      description: "Process collected data",
      timeEstimate: 45,
      manualCost: 25,
      aiAssistedCost: 0.52,
      tools: ["Workato", "Appy Pie Automate"],
      instructions:
        "Use Workato's easy data mapping feature to organize API data. For more complex workflows, use Appy Pie Automate's dynamic automation paths with conditional logic.",
    },
    {
      id: "step4",
      name: "Task Assignment",
      description: "Assign tasks to team members",
      timeEstimate: 20,
      manualCost: 25,
      aiAssistedCost: 0.52,
      tools: ["Artwork Flow", "Pulpstream"],
      instructions:
        "Use Artwork Flow's visual workflow builder to set up automated task assignments. For more complex HR tasks, use Pulpstream's custom rule engine for leave of absence management.",
    },
    {
      id: "step5",
      name: "Task Completion and Review",
      description: "Monitor task completion and review",
      timeEstimate: 25,
      manualCost: 25,
      aiAssistedCost: 0.52,
      tools: ["Zapier", "Appy Pie Automate"],
      instructions:
        "Use Zapier to set up triggers for task completion notifications. For more advanced workflows, use Appy Pie Automate's seamless integration with Salesforce for real-time updates.",
    },
  ]

  return {
    analysis: `To address the query effectively, let's break down the process into steps and identify the best tools and AI solutions for each step. Here's a structured approach to automating and improving the ${workflowName}:

1. Understand the Manual Workflow
Key Steps:
   - Task Identification: Identify all tasks involved in the workflow.
   - Bottlenecks and Inefficiencies: Determine which steps are time-consuming, repetitive, or prone to errors.
   - Constraints: Note any budget, privacy, or technical limitations.

2. Design the Step-by-Step AI & Automation Workflow`,
    recommendations: [
      `Consider using AI to automate the repetitive tasks in ${workflowName}`,
      "Implement a centralized data storage solution to reduce manual data entry",
      "Use workflow automation tools to streamline approval processes",
      "Integrate AI-powered analytics to identify further optimization opportunities",
      "Establish clear metrics to measure the success of your automation efforts",
    ],
    tools: recommendedTools.map((tool) => ({
      name: tool.company_name,
      description: tool.company_description || tool.main_features,
      cost: tool.pricing || "Custom pricing available",
    })),
    steps: defaultSteps,
    costAnalysis: {
      manualWorkflowCost: 25,
      aiAssistedWorkflowCost: 0.52,
      netSavingsPerTask: 24.48,
      weeklySavings: 24.48 * 40,
      monthlySavings: 24.48 * 160,
      quarterlySavings: 24.48 * 480,
      yearlySavings: 24.48 * 1920,
    },
    hourlyRate: hourlyRate || 50,
  }
}