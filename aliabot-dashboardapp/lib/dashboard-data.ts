/**
 * Aliabot dashboard mock data.
 * Centralized here so it is easy to swap for a real API later.
 */

export type AgentStatus = "live" | "training" | "draft"

export type Agent = {
  id: string
  name: string
  status: AgentStatus
  model: string
  messagesToday: number
  description: string
  color: string // avatar accent
}

export const agents: Agent[] = [
  {
    id: "support-ai",
    name: "Support AI",
    status: "live",
    model: "GPT-4.1",
    messagesToday: 312,
    description: "Your AI support agent trained to help your customers.",
    color: "#2563eb",
  },
  {
    id: "sales-ai",
    name: "Sales AI",
    status: "training",
    model: "GPT-4.1",
    messagesToday: 128,
    description: "Qualifies leads and books demos around the clock.",
    color: "#06b6d4",
  },
  {
    id: "hr-assistant",
    name: "HR Assistant",
    status: "live",
    model: "Claude 3.5",
    messagesToday: 96,
    description: "Answers policy and benefits questions for your team.",
    color: "#7c3aed",
  },
  {
    id: "marketing-bot",
    name: "Marketing Bot",
    status: "draft",
    model: "GPT-4.1",
    messagesToday: 0,
    description: "Drafts campaigns and on-brand copy on demand.",
    color: "#f59e0b",
  },
]

export const statusMeta: Record<
  AgentStatus,
  { label: string; dot: string; text: string }
> = {
  live: { label: "Live", dot: "#22c55e", text: "#4ade80" },
  training: { label: "Training", dot: "#a78bfa", text: "#c4b5fd" },
  draft: { label: "Draft", dot: "#f59e0b", text: "#fbbf24" },
}

export type Metric = {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
  icon: "message" | "sources" | "satisfaction" | "latency"
}

export const metrics: Metric[] = [
  {
    label: "Messages Today",
    value: "312",
    delta: "18% vs yesterday",
    trend: "up",
    icon: "message",
  },
  {
    label: "Knowledge Sources",
    value: "1,247",
    delta: "+32 this week",
    trend: "up",
    icon: "sources",
  },
  {
    label: "Satisfaction",
    value: "96%",
    delta: "4% vs last week",
    trend: "up",
    icon: "satisfaction",
  },
  {
    label: "Avg. Response Time",
    value: "1.2s",
    delta: "0.3s vs last week",
    trend: "down",
    icon: "latency",
  },
]

export const messagesChart = [
  { label: "May 17", value: 360 },
  { label: "May 18", value: 470 },
  { label: "May 19", value: 460 },
  { label: "May 20", value: 380 },
  { label: "May 21", value: 490 },
  { label: "May 22", value: 410 },
  { label: "May 23", value: 500 },
]

export const knowledgeGrowth = [
  200, 260, 300, 420, 480, 560, 620, 700, 820, 900, 980, 1120, 1240, 1360, 1500,
]

export const knowledgeGrowthLabels = ["Apr 24", "May 1", "May 8", "May 15", "May 23"]

export const topQuestions = [
  { q: "How do I reset my password?", count: 423 },
  { q: "Where can I view my invoices?", count: 312 },
  { q: "How does the pricing work?", count: 289 },
  { q: "How can I contact support?", count: 184 },
  { q: "Can I upgrade my plan?", count: 142 },
]

export const agentHealth = {
  knowledge: 87,
  responseQuality: 94,
  hallucinationRisk: "Low",
  latency: "1.4s",
  overall: 94,
}

export const recentActivity = [
  { type: "website", title: "Website", detail: "docs.aliabot.com", meta: "Synced", time: "2h ago" },
  { type: "files", title: "Files", detail: "15 PDFs added", meta: "", time: "3h ago" },
  { type: "qa", title: "Q&A", detail: "182 entries", meta: "", time: "5h ago" },
  {
    type: "deploy",
    title: "Last Deployment",
    detail: "Version 1.3.2",
    meta: "",
    time: "Today, 10:30 AM",
  },
]

export const topIntents = [
  { label: "Password reset", value: 32 },
  { label: "Account login", value: 21 },
  { label: "Billing question", value: 17 },
  { label: "Refund request", value: 11 },
  { label: "Other", value: 19 },
]

export type ChatMessage = {
  id: string
  role: "user" | "bot"
  text: string
  time: string
}

export const initialChat: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    text: "How do I reset my password?",
    time: "11:41 AM",
  },
  {
    id: "2",
    role: "bot",
    text: "You can reset your password by clicking on “Forgot Password” on the login page. We'll send you an email with a link to create a new one.",
    time: "11:41 AM",
  },
]
