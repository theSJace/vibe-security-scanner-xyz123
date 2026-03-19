import type { ScanResult, SecurityCheck, SecurityIssue, ScanRequest } from '@/types/security'

const mockIssues: Record<string, SecurityIssue[]> = {
  'api-keys': [
    {
      id: 'api-1',
      title: 'Hardcoded API Key Detected',
      description: 'Found hardcoded API key in source code. This is a critical security risk.',
      file: 'src/config/api.ts',
      line: 12,
      severity: 'critical',
      code: 'const API_KEY = "sk_live_51H7xYZ1234567890abcdef"',
      fix: {
        description: 'Move API key to environment variables',
        code: `const API_KEY = process.env.API_KEY || '';
if (!API_KEY) {
  throw new Error('API_KEY is required');
}`,
        explanation: 'Never hardcode API keys. Use environment variables and validate their presence at runtime.'
      }
    },
    {
      id: 'api-2',
      title: 'Exposed .env File',
      description: '.env file is committed to repository',
      file: '.env',
      line: 1,
      severity: 'critical',
      code: 'DATABASE_URL=postgres://user:password@localhost:5432/db',
      fix: {
        description: 'Remove .env from git and add to .gitignore',
        code: '# Add to .gitignore\n.env\n.env.local\n.env.*.local',
        explanation: 'Environment files should never be committed. Add them to .gitignore immediately.'
      }
    }
  ],
  'rate-limiting': [
    {
      id: 'rate-1',
      title: 'Missing Rate Limiting on API Routes',
      description: 'No rate limiting middleware detected on sensitive endpoints',
      file: 'src/routes/auth.ts',
      line: 45,
      severity: 'high',
      code: "app.post('/api/login', async (req, res) => {",
      fix: {
        description: 'Add rate limiting middleware',
        code: `import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

app.post('/api/login', loginLimiter, async (req, res) => {`,
        explanation: 'Rate limiting prevents brute force attacks. Always protect authentication endpoints.'
      }
    }
  ],
  'input-sanitization': [
    {
      id: 'input-1',
      title: 'SQL Injection Vulnerability',
      description: 'Unsanitized user input used in SQL query',
      file: 'src/db/queries.ts',
      line: 23,
      severity: 'critical',
      code: "const query = `SELECT * FROM users WHERE email = '${email}'`;",
      fix: {
        description: 'Use parameterized queries',
        code: "const query = 'SELECT * FROM users WHERE email = $1';\nconst result = await db.query(query, [email]);",
        explanation: 'Parameterized queries prevent SQL injection attacks. Never concatenate user input into SQL.'
      }
    }
  ],
  'rls': [
    {
      id: 'rls-1',
      title: 'Row Level Security Not Enabled',
      description: 'PostgreSQL tables lack RLS policies',
      file: 'database/schema.sql',
      line: 1,
      severity: 'high',
      code: 'CREATE TABLE user_data (\n  id UUID PRIMARY KEY,\n  user_id UUID,\n  sensitive_data TEXT\n);',
      fix: {
        description: 'Enable RLS and create policies',
        code: `ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_data_isolation ON user_data
  USING (user_id = auth.uid());`,
        explanation: 'RLS ensures users can only access their own data. Essential for multi-tenant applications.'
      }
    }
  ]
}

export async function mockScan(request: ScanRequest): Promise<ScanResult> {
  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const checks: SecurityCheck[] = [
    {
      id: 'check-api-keys',
      name: 'Exposed API Keys',
      description: 'Scan for hardcoded API keys, tokens, and credentials',
      category: 'api-keys',
      status: 'failed',
      severity: 'critical',
      issues: mockIssues['api-keys']
    },
    {
      id: 'check-rate-limiting',
      name: 'Rate Limiting',
      description: 'Check for rate limiting middleware on API routes',
      category: 'rate-limiting',
      status: 'failed',
      severity: 'high',
      issues: mockIssues['rate-limiting']
    },
    {
      id: 'check-input-sanitization',
      name: 'Input Sanitization',
      description: 'Detect unsafe query patterns and input validation issues',
      category: 'input-sanitization',
      status: 'failed',
      severity: 'critical',
      issues: mockIssues['input-sanitization']
    },
    {
      id: 'check-rls',
      name: 'Row Level Security',
      description: 'Verify RLS policies are properly configured',
      category: 'rls',
      status: 'failed',
      severity: 'critical',
      issues: mockIssues['rls']
    }
  ]

  const totalIssues = checks.reduce((acc, check) => acc + check.issues.length, 0)
  const critical = checks.reduce((acc, check) => acc + check.issues.filter(i => i.severity === 'critical').length, 0)
  const high = checks.reduce((acc, check) => acc + check.issues.filter(i => i.severity === 'high').length, 0)

  // Calculate score (100 - penalties)
  const score = Math.max(0, 100 - (critical * 15) - (high * 10) - (totalIssues * 5))

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date(),
    source: request.source,
    sourceType: request.sourceType,
    score,
    status: 'completed',
    checks,
    summary: {
      totalIssues,
      critical,
      high,
      medium: checks.reduce((acc, check) => acc + check.issues.filter(i => i.severity === 'medium').length, 0),
      low: checks.reduce((acc, check) => acc + check.issues.filter(i => i.severity === 'low').length, 0),
      info: checks.reduce((acc, check) => acc + check.issues.filter(i => i.severity === 'info').length, 0)
    }
  }
}
