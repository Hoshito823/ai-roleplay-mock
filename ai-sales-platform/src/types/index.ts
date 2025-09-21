export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Scenario {
  id: string
  title: string
  description?: string
  industry: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  scenarioId: string
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
  startedAt: Date
  endedAt?: Date
  duration?: number
  score?: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  sessionId: string
  content: string
  sender: 'USER' | 'AI'
  timestamp: Date
}

export interface EmotionAnalysis {
  id: string
  sessionId: string
  messageId?: string
  timestamp: Date
  joy: number
  sadness: number
  anger: number
  fear: number
  surprise: number
  disgust: number
  confidence: number
}

export interface Analytics {
  id: string
  sessionId: string
  userId: string
  totalMessages: number
  userMessages: number
  aiMessages: number
  averageResponseTime?: number
  keywordsUsed: string[]
  sentimentTrend?: string
  improvementSuggestions?: string
  createdAt: Date
  updatedAt: Date
}

export interface KPIData {
  successRate: number
  averageSessionTime: number
  emotionScore: number
  totalSessions: number
  completedSessions: number
}

export interface ChatMessage extends Message {
  emotions?: EmotionAnalysis
}