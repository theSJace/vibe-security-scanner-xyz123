import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChevronDown, ChevronUp, FileCode, AlertCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import type { SecurityCheck, SecurityIssue } from '@/types/security'

interface ScanResultsProps {
  checks: SecurityCheck[]
}

export function ScanResults({ checks }: ScanResultsProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues)
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId)
    } else {
      newExpanded.add(issueId)
    }
    setExpandedIssues(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-yellow-950">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  const categoryLabels: Record<string, string> = {
    'api-keys': 'API Keys',
    'rate-limiting': 'Rate Limiting',
    'input-sanitization': 'Input Sanitization',
    'rls': 'Row Level Security'
  }

  const categoryLabelsShort: Record<string, string> = {
    'api-keys': 'API',
    'rate-limiting': 'Rate',
    'input-sanitization': 'Input',
    'rls': 'RLS'
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={checks.find(c => c.issues.length > 0)?.id || checks[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          {checks.map((check) => (
            <TabsTrigger key={check.id} value={check.id} className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
              {getStatusIcon(check.status)}
              <span className="sm:hidden text-xs">{categoryLabelsShort[check.category]}</span>
              <span className="hidden sm:inline text-sm">{categoryLabels[check.category]}</span>
              {check.issues.length > 0 && (
                <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-xs">
                  {check.issues.length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {checks.map((check) => (
          <TabsContent key={check.id} value={check.id} className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {check.name}
                      {check.status === 'passed' ? (
                        <Badge variant="success" className="bg-green-500">Passed</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {check.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {check.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No issues found!</h3>
                    <p className="text-muted-foreground">
                      This check passed with no security concerns.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {check.issues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        isExpanded={expandedIssues.has(issue.id)}
                        onToggle={() => toggleIssue(issue.id)}
                        getSeverityBadge={getSeverityBadge}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface IssueCardProps {
  issue: SecurityIssue
  isExpanded: boolean
  onToggle: () => void
  getSeverityBadge: (severity: string) => React.ReactNode
}

function IssueCard({ issue, isExpanded, onToggle, getSeverityBadge }: IssueCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start justify-between hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getSeverityBadge(issue.severity)}
            <h4 className="font-semibold">{issue.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <FileCode className="h-4 w-4" />
            <span>{issue.file}:{issue.line}</span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t bg-muted/30 p-4 space-y-4">
          {/* Code Snippet */}
          {issue.code && (
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Problematic Code
              </h5>
              <pre className="bg-red-950 text-red-100 p-3 rounded-md text-sm overflow-x-auto font-mono">
                {issue.code}
              </pre>
            </div>
          )}

          {/* AI Fix */}
          {issue.fix && (
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                AI-Generated Fix
              </h5>
              <p className="text-sm text-muted-foreground mb-2">{issue.fix.description}</p>
              <pre className="bg-green-950 text-green-100 p-3 rounded-md text-sm overflow-x-auto font-mono">
                {issue.fix.code}
              </pre>
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Why:</strong> {issue.fix.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
