# Report Generation Skill

Generate formatted security reports from scan results.

## Overview

Transforms raw scan results into human-readable reports with:
- Security score visualization
- Issue categorization
- AI-generated fix suggestions
- Export capabilities (Markdown, JSON, PDF)

## Usage

```typescript
import { generateReport } from '@/lib/reports/generator'
import type { ScanResult } from '@/types/security'

const report = generateReport(scanResult, {
  format: 'markdown',
  includeFixes: true,
  severityFilter: ['critical', 'high']
})
```

## Report Formats

### Markdown
```markdown
# Security Scan Report

**Score:** 45/100
**Date:** 2026-03-19

## Summary
- Critical: 3
- High: 2
- Medium: 1

## Findings

### API Keys (Failed)
- [CRITICAL] Hardcoded API Key in src/config/api.ts:12
- [CRITICAL] Exposed .env file
...
```

### JSON
```json
{
  "score": 45,
  "summary": { "critical": 3, "high": 2, "medium": 1 },
  "checks": [...],
  "generatedAt": "2026-03-19T04:30:00Z"
}
```

## Components

### SecurityScore
Visual score display with:
- Circular progress indicator
- Color-coded score (red/orange/yellow/green)
- Issue count badges
- Score message

### ScanResults
Tabbed interface showing:
- 4 security categories
- Expandable issue cards
- Code snippets with syntax highlighting
- AI fix suggestions

### IssueCard
Individual issue display:
- Severity badge
- File location
- Problematic code (red)
- Fixed code (green)
- Explanation

## Export Options

| Format | Command | Use Case |
|--------|---------|----------|
| Markdown | `exportReport('md')` | GitHub issues, docs |
| JSON | `exportReport('json')` | CI/CD integration |
| HTML | `exportReport('html')` | Email reports |
| PDF | `exportReport('pdf')` | Compliance docs |

## Customization

Filter issues by severity:
```typescript
generateReport(result, {
  severityFilter: ['critical', 'high'] // Only show critical & high
})
```

Include/exclude fixes:
```typescript
generateReport(result, {
  includeFixes: false // Hide AI suggestions
})
```

## Integration

Works with security-scan skill:
```typescript
const scanResult = await mockScan(request)
const report = generateReport(scanResult)
await downloadReport(report, 'security-report.md')
```
