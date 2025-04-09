import type { IntegrationConfig, WorkflowSubmission } from "../types"
import { v4 as uuidv4 } from "uuid"

// Define integration types
export const INTEGRATION_TYPES = {
  ZAPIER: "zapier",
  MAKE: "make",
  IFTTT: "ifttt",
  SLACK: "slack",
  TRELLO: "trello",
  ASANA: "asana",
  GITHUB: "github",
  GOOGLE_WORKSPACE: "google_workspace",
  MICROSOFT_365: "microsoft_365",
  AIRTABLE: "airtable",
  NOTION: "notion",
  JIRA: "jira",
}

// Define integration templates
const INTEGRATION_TEMPLATES: Record<string, Partial<IntegrationConfig>> = {
  [INTEGRATION_TYPES.ZAPIER]: {
    name: "Zapier",
    type: INTEGRATION_TYPES.ZAPIER,
    config: {
      apiKey: "",
      webhookUrl: "",
    },
  },
  [INTEGRATION_TYPES.MAKE]: {
    name: "Make (Integromat)",
    type: INTEGRATION_TYPES.MAKE,
    config: {
      apiKey: "",
      webhookUrl: "",
    },
  },
  [INTEGRATION_TYPES.IFTTT]: {
    name: "IFTTT",
    type: INTEGRATION_TYPES.IFTTT,
    config: {
      webhookKey: "",
    },
  },
  [INTEGRATION_TYPES.SLACK]: {
    name: "Slack",
    type: INTEGRATION_TYPES.SLACK,
    config: {
      apiToken: "",
      channel: "",
    },
  },
  [INTEGRATION_TYPES.TRELLO]: {
    name: "Trello",
    type: INTEGRATION_TYPES.TRELLO,
    config: {
      apiKey: "",
      token: "",
      boardId: "",
    },
  },
  [INTEGRATION_TYPES.ASANA]: {
    name: "Asana",
    type: INTEGRATION_TYPES.ASANA,
    config: {
      accessToken: "",
      workspaceId: "",
      projectId: "",
    },
  },
  [INTEGRATION_TYPES.GITHUB]: {
    name: "GitHub",
    type: INTEGRATION_TYPES.GITHUB,
    config: {
      accessToken: "",
      owner: "",
      repo: "",
    },
  },
  [INTEGRATION_TYPES.GOOGLE_WORKSPACE]: {
    name: "Google Workspace",
    type: INTEGRATION_TYPES.GOOGLE_WORKSPACE,
    config: {
      clientId: "",
      clientSecret: "",
      refreshToken: "",
    },
  },
  [INTEGRATION_TYPES.MICROSOFT_365]: {
    name: "Microsoft 365",
    type: INTEGRATION_TYPES.MICROSOFT_365,
    config: {
      clientId: "",
      clientSecret: "",
      tenantId: "",
    },
  },
  [INTEGRATION_TYPES.AIRTABLE]: {
    name: "Airtable",
    type: INTEGRATION_TYPES.AIRTABLE,
    config: {
      apiKey: "",
      baseId: "",
    },
  },
  [INTEGRATION_TYPES.NOTION]: {
    name: "Notion",
    type: INTEGRATION_TYPES.NOTION,
    config: {
      apiKey: "",
      databaseId: "",
    },
  },
  [INTEGRATION_TYPES.JIRA]: {
    name: "Jira",
    type: INTEGRATION_TYPES.JIRA,
    config: {
      apiToken: "",
      domain: "",
      email: "",
      projectKey: "",
    },
  },
}

class IntegrationService {
  private integrations: IntegrationConfig[] = []

  constructor() {
    // Load integrations from localStorage
    this.loadIntegrations()
  }

  private loadIntegrations() {
    try {
      const savedIntegrations = localStorage.getItem("integrations")
      if (savedIntegrations) {
        this.integrations = JSON.parse(savedIntegrations)
      }
    } catch (error) {
      console.error("Error loading integrations:", error)
      this.integrations = []
    }
  }

  private saveIntegrations() {
    try {
      localStorage.setItem("integrations", JSON.stringify(this.integrations))
    } catch (error) {
      console.error("Error saving integrations:", error)
    }
  }

  public getIntegrations(): IntegrationConfig[] {
    return [...this.integrations]
  }

  public getIntegration(id: string): IntegrationConfig | undefined {
    return this.integrations.find((integration) => integration.id === id)
  }

  public getIntegrationsByType(type: string): IntegrationConfig[] {
    return this.integrations.filter((integration) => integration.type === type)
  }

  public createIntegration(type: string, config: Record<string, any>): IntegrationConfig {
    const template = INTEGRATION_TEMPLATES[type]

    if (!template) {
      throw new Error(`Unknown integration type: ${type}`)
    }

    const newIntegration: IntegrationConfig = {
      id: uuidv4(),
      name: template.name || type,
      type,
      config: {
        ...template.config,
        ...config,
      },
      enabled: true,
    }

    this.integrations.push(newIntegration)
    this.saveIntegrations()

    return newIntegration
  }

  public updateIntegration(id: string, updates: Partial<IntegrationConfig>): IntegrationConfig {
    const index = this.integrations.findIndex((integration) => integration.id === id)

    if (index === -1) {
      throw new Error(`Integration not found: ${id}`)
    }

    const updatedIntegration = {
      ...this.integrations[index],
      ...updates,
      config: {
        ...this.integrations[index].config,
        ...(updates.config || {}),
      },
    }

    this.integrations[index] = updatedIntegration
    this.saveIntegrations()

    return updatedIntegration
  }

  public deleteIntegration(id: string): void {
    const index = this.integrations.findIndex((integration) => integration.id === id)

    if (index === -1) {
      throw new Error(`Integration not found: ${id}`)
    }

    this.integrations.splice(index, 1)
    this.saveIntegrations()
  }

  public async executeIntegration(
    integrationId: string,
    workflow: WorkflowSubmission,
    action: string,
    data?: any,
  ): Promise<any> {
    const integration = this.getIntegration(integrationId)

    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`)
    }

    if (!integration.enabled) {
      throw new Error(`Integration is disabled: ${integration.name}`)
    }

    // In a real implementation, this would make API calls to the integration
    // For now, we'll just simulate the integration

    console.log(`Executing integration: ${integration.name}`)
    console.log(`Action: ${action}`)
    console.log(`Data:`, data)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update last synced timestamp
    this.updateIntegration(integrationId, {
      lastSynced: new Date(),
    })

    // Return simulated response
    return {
      success: true,
      message: `Successfully executed ${action} on ${integration.name}`,
      data: {
        id: uuidv4(),
        timestamp: new Date(),
      },
    }
  }

  public getAvailableIntegrationTypes(): string[] {
    return Object.keys(INTEGRATION_TEMPLATES)
  }

  public getIntegrationTemplate(type: string): Partial<IntegrationConfig> | undefined {
    return INTEGRATION_TEMPLATES[type]
  }
}

// Singleton instance
export const integrationService = new IntegrationService()
