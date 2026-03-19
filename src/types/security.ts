export interface SecurityCheck {
  id: string
  name: string
  description: string
  category: 'api-keys' | 'rate-limiting' | 'input-sanitization' | 'rls'
  status: 'pending' | 'scanning' | 'passed' | 'failed'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  issues: SecurityIssue[]
}

export interface SecurityIssue {
  id: string
  title: string
  description: string
  file: string
  line: number
  column?: number
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  code?: string
  fix?: AIFix
}

export interface AIFix {
  description: string
  code: string
  explanation: string
}

export interface ScanResult {
  id: string
  timestamp: Date
  source: string
  sourceType: 'github' | 'zip' | 'paste'
  score: number
  status: 'pending' | 'scanning' | 'completed' | 'failed'
  checks: SecurityCheck[]
  summary: {
    totalIssues: number
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
}

export interface ScanRequest {
  sourceType: 'github' | 'zip' | 'paste'
  source: string
  code?: string
}
