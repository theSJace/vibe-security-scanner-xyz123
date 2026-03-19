# Security Scan Skill

Scan codebases for common security vulnerabilities in vibe-coded applications.

## Overview

This skill provides security scanning capabilities based on the 4-point checklist from tobi.the.og's vibe coding security guide:

1. **Exposed API Keys** - Detect hardcoded credentials and tokens
2. **Rate Limiting** - Check for missing rate limiting on API endpoints
3. **Input Sanitization** - Find SQL injection, XSS, and NoSQL injection risks
4. **Row Level Security (RLS)** - Verify database RLS policies

## Usage

```typescript
import { mockScan } from '@/lib/scanner/mockScanner'
import type { ScanRequest } from '@/types/security'

const request: ScanRequest = {
  sourceType: 'github', // or 'zip' | 'paste'
  source: 'https://github.com/user/repo'
}

const result = await mockScan(request)
```

## Scan Result

Returns a `ScanResult` with:
- **score**: 0-100 security score
- **checks**: Array of 4 security checks with status and issues
- **summary**: Count of issues by severity
- **issues**: Detailed findings with line numbers and code snippets

## Issue Format

Each issue includes:
- `title`: Human-readable issue name
- `description`: Explanation of the vulnerability
- `file`: File path where issue was found
- `line`: Line number
- `severity`: critical | high | medium | low | info
- `code`: Problematic code snippet
- `fix`: AI-generated fix with description and explanation

## Mock Data

Currently uses mock data for demonstration. To implement real scanning:

1. Replace `mockScanner.ts` with actual AST parsing
2. Add pattern matching for each vulnerability type
3. Integrate with GitHub API for repo scanning
4. Add ZIP file extraction and analysis

## Categories

### API Keys
- Searches for: `api_key`, `apikey`, `token`, `password`, `secret`
- File patterns: `.env`, `config.*`, `*.json`
- Checks for committed `.env` files

### Rate Limiting
- Detects Express.js routes without rate limiting
- Checks for `express-rate-limit` imports
- Flags auth endpoints specifically

### Input Sanitization
- SQL injection: Template literals in queries
- NoSQL injection: Unvalidated MongoDB queries
- XSS: `dangerouslySetInnerHTML` usage
- Missing validation: Request body handling

### RLS
- Checks Supabase schema files
- Detects missing `ENABLE ROW LEVEL SECURITY`
- Flags overly permissive policies (`USING (true)`)

## Integration

Use with the report-gen skill to generate formatted security reports.
