import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, RotateCcw } from 'lucide-react'

interface SecurityScoreProps {
  score: number
  summary: {
    totalIssues: number
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
  onReset: () => void
}

export function SecurityScore({ score, summary, onReset }: SecurityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Good security posture'
    if (score >= 60) return 'Needs improvement'
    if (score >= 40) return 'Security risks detected'
    return 'Critical issues found'
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Score Circle */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${getScoreBg(score)} bg-opacity-10 border-current ${getScoreColor(score)}`}>
              <div className="text-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-sm text-muted-foreground block">/100</span>
              </div>
            </div>
            {score < 60 && (
              <AlertTriangle className="absolute -top-2 -right-2 h-6 w-6 text-red-500" />
            )}
            {score >= 80 && (
              <Shield className="absolute -top-2 -right-2 h-6 w-6 text-green-500" />
            )}
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className={`text-xl font-semibold ${getScoreColor(score)}`}>
                {getScoreMessage(score)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Found {summary.totalIssues} issues across 4 security categories
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Security Score</span>
                <span className={getScoreColor(score)}>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            {/* Issue Counts */}
            <div className="flex flex-wrap gap-2">
              {summary.critical > 0 && (
                <Badge variant="destructive">{summary.critical} Critical</Badge>
              )}
              {summary.high > 0 && (
                <Badge variant="destructive" className="bg-orange-500">{summary.high} High</Badge>
              )}
              {summary.medium > 0 && (
                <Badge variant="secondary" className="bg-yellow-500 text-yellow-950">{summary.medium} Medium</Badge>
              )}
              {summary.low > 0 && (
                <Badge variant="secondary">{summary.low} Low</Badge>
              )}
              {summary.info > 0 && (
                <Badge variant="outline">{summary.info} Info</Badge>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Scan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
