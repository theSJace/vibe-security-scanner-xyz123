import { useState } from 'react'
import { ScanForm } from '@/components/ScanForm'
import { ScanResults } from '@/components/ScanResults'
import { SecurityScore } from '@/components/SecurityScore'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { mockScan } from '@/lib/scanner/mockScanner'
import type { ScanResult, ScanRequest } from '@/types/security'

function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async (request: ScanRequest) => {
    setIsScanning(true)
    try {
      const result = await mockScan(request)
      setScanResult(result)
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const resetScan = () => {
    setScanResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">VibeGuard</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              4 Critical Checks
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              AI-Powered Fixes
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!scanResult && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Secure Your Vibe-Coded App
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI helps you ship faster, but it won't tell you when your app is a security disaster waiting to happen. 
              Run through the 4 critical checks before you go live.
            </p>
          </div>
        )}

        {/* Scan Form or Results */}
        {!scanResult ? (
          <ScanForm onScan={handleScan} isScanning={isScanning} />
        ) : (
          <div className="space-y-6">
            <SecurityScore 
              score={scanResult.score} 
              summary={scanResult.summary}
              onReset={resetScan}
            />
            <ScanResults checks={scanResult.checks} />
          </div>
        )}

        {/* Info Cards */}
        {!scanResult && !isScanning && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {[
              {
                title: '1. Exposed API Keys',
                description: 'Detect hardcoded API keys, tokens, and credentials in your source code.',
                icon: '🔑'
              },
              {
                title: '2. Rate Limiting',
                description: 'Check if your API endpoints are protected against brute force attacks.',
                icon: '⏱️'
              },
              {
                title: '3. Input Sanitization',
                description: 'Find SQL injection, XSS, and NoSQL injection vulnerabilities.',
                icon: '🛡️'
              },
              {
                title: '4. Row Level Security',
                description: 'Verify RLS policies are configured for your database tables.',
                icon: '🔒'
              }
            ].map((check, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="text-2xl mb-2">{check.icon}</div>
                <h3 className="font-semibold mb-1">{check.title}</h3>
                <p className="text-sm text-muted-foreground">{check.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Based on the{' '}
            <a 
              href="https://instagram.com/tobi.the.og" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              vibe coding security checklist
            </a>
            {' '}by tobi.the.og
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
