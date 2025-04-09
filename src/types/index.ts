// src/types/index.ts - with additional UI state types
// import { WorkflowState } from '../store/workflow-store';

import { WorkflowState } from "../store/workflow-store";

export interface WorkflowQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  timeEstimate?: number;
  manualCost?: number;
  aiAssistedCost?: number;
  tools?: string[];
  instructions?: string;
  dependencies?: string[]; // IDs of steps that must be completed before this one
  assignee?: string;
  status?: "not-started" | "in-progress" | "completed" | "blocked";
  comments?: Comment[];
}

export interface WorkflowNode {
  id: string;
  type: "step" | "decision" | "start" | "end";
  data: WorkflowStep | DecisionNode;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface DecisionNode {
  question: string;
  conditions: {
    value: string;
    targetId: string;
  }[];
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    color: string;
  };
  text: string;
  timestamp: Date;
  stepId?: string;
  replyTo?: string;
}

export interface WorkflowSubmission {
  id: string;
  name: string;
  businessName: string;
  departmentName: string;
  questions: WorkflowQuestion[];
  steps: WorkflowStep[];
  graph?: WorkflowGraph;
  createdAt: Date;
  updatedAt?: Date;
  analysis?: string;
  comments?: Comment[];
  collaborators?: string[];
  version?: number;
  isLinear?: boolean;
  costAnalysis?: CostAnalysis;
  exportFormat?: ExportFormat;
  exportStatus?: "pending" | "completed" | "failed";
  exportUrl?: string;
  exportError?: string;
  exportTimestamp?: Date;
  integrationConfig?: IntegrationConfig;
  notificationMessages?: NotificationMessage[];
  userProfile?: UserProfile;
  isOffline?: boolean;
  isEditing?: boolean;
  isExporting?: boolean;
  hourlyRate?: number; 
  plantumlCode?: string; // Optional PlantUML code for visual representation
}

export interface BusinessInfo {
  name: string;
  departments: string[];
}

export interface CostAnalysis {
  manualWorkflowCost: number;
  aiAssistedWorkflowCost: number;
  netSavingsPerTask: number;
  weeklySavings: number;
  monthlySavings: number;
  quarterlySavings: number;
  yearlySavings: number;
}

export interface ModalState {
  isOpen: boolean;
  type: "business" | "department" | "workflow" | "export" | "comment" | "integration" | "notification" | "confirmation" | null;
  data?: any;
}

export type ExportFormat = "pdf" | "text" | "png";

export interface DeepseekResponse {
  analysis: string;
  recommendations: string[];
  tools: {
    name: string;
    description: string;
    cost?: string;
  }[];
  steps: WorkflowStep[];
  costAnalysis?: CostAnalysis;
  plantumlCode?: string;
  hourlyRate?: number; // Optional hourly rate for cost calculations
}

export interface NotificationMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  enabled: boolean;
  lastSynced?: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    collaborationMode: "realtime" | "async";
  };
}

// UI State Types for Enhanced Application
export interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: "date" | "name" | "business";
  sortDirection: "asc" | "desc";
}

export interface PageState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  params: Record<string, string>;
}

export interface MobileState {
  isMobileView: boolean;
  isSidebarOpen: boolean;
  isModalOpen: boolean;
}

export interface ThemeState {
  currentTheme: "light" | "dark" | "system";
  accentColor: string;
}

// Enhanced store interface with additional UI state
export interface EnhancedWorkflowState extends WorkflowState {
  ui: {
    filter: FilterState;
    pagination: PageState;
    navigation: NavigationState;
    mobile: MobileState;
    theme: ThemeState;
  };
}