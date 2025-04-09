import Papa from "papaparse"

export interface Tool {
  image: string
  user_email: string
  main_features: string
  message: string
  result: string
  company_description: string
  company_name: string
  name: string
  main_category: string
  company_URL: string
  linkedin_URL: string
  category: string
  twitter_URL: string
  pricing: string
  affilate_signup_url: string
  company_url: string
  MainSubCategory: string
  created_time: string
}

const TOOLS_CSV_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tools-Xf4zNLRzFv11eQVc4TKnbQMSEIuSRB.csv"

let cachedTools: Tool[] | null = null

export async function fetchTools(): Promise<Tool[]> {
  if (cachedTools) return cachedTools

  try {
    const response = await fetch(TOOLS_CSV_URL)
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const tools = results.data as Tool[]
          // Filter out invalid tools
          const validTools = tools.filter(
            (tool) => tool.company_name && tool.main_category && tool.result === "Accepted",
          )
          cachedTools = validTools
          resolve(validTools)
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error("Error fetching tools:", error)
    throw new Error("Failed to fetch tools data")
  }
}

export function getToolsByCategory(category: string): Promise<Tool[]> {
  return fetchTools().then((tools) =>
    tools.filter(
      (tool) =>
        tool.main_category.toLowerCase().includes(category.toLowerCase()) ||
        tool.category.toLowerCase().includes(category.toLowerCase()) ||
        tool.MainSubCategory?.toLowerCase().includes(category.toLowerCase()),
    ),
  )
}

export function getToolsByKeywords(keywords: string[]): Promise<Tool[]> {
  return fetchTools().then((tools) =>
    tools.filter((tool) => {
      const toolText =
        `${tool.company_name} ${tool.company_description} ${tool.main_features} ${tool.category} ${tool.MainSubCategory}`.toLowerCase()
      return keywords.some((keyword) => toolText.includes(keyword.toLowerCase()))
    }),
  )
}

export function getRecommendedToolsForWorkflow(workflowDescription: string, steps: string[]): Promise<Tool[]> {
  // Extract keywords from workflow description and steps
  const text = `${workflowDescription} ${steps.join(" ")}`.toLowerCase()

  // Define common workflow-related keywords
  const automationKeywords = ["automation", "automate", "workflow", "process"]
  const dataKeywords = ["data", "analytics", "analysis", "reporting", "dashboard"]
  const communicationKeywords = ["communication", "collaboration", "team", "chat"]
  const documentKeywords = ["document", "pdf", "file", "storage"]
  const imageKeywords = ["image", "photo", "design", "graphic"]
  const videoKeywords = ["video", "recording", "streaming"]
  const aiKeywords = ["ai", "artificial intelligence", "machine learning", "ml"]

  // Determine which categories are relevant to this workflow
  const relevantCategories: string[] = []

  if (automationKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("automation")
  }

  if (dataKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("data")
  }

  if (communicationKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("communication")
  }

  if (documentKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("document")
  }

  if (imageKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("image")
  }

  if (videoKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("video")
  }

  if (aiKeywords.some((keyword) => text.includes(keyword))) {
    relevantCategories.push("ai")
  }

  // If no categories were identified, default to general automation tools
  if (relevantCategories.length === 0) {
    relevantCategories.push("automation")
  }

  // Get tools for all relevant categories and combine them
  return Promise.all(relevantCategories.map((category) => getToolsByCategory(category))).then((toolArrays) => {
    // Flatten the array of arrays and remove duplicates
    const allTools = toolArrays.flat()
    const uniqueTools = Array.from(new Map(allTools.map((tool) => [tool.company_name, tool])).values())

    // Sort by relevance (for now, just return in original order)
    return uniqueTools.slice(0, 10) // Limit to 10 tools
  })
}
