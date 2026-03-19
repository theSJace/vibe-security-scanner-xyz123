import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Github, FileArchive, Code, Loader2 } from 'lucide-react'
import type { ScanRequest } from '@/types/security'

interface ScanFormProps {
  onScan: (request: ScanRequest) => void
  isScanning: boolean
}

export function ScanForm({ onScan, isScanning }: ScanFormProps) {
  const [activeTab, setActiveTab] = useState('github')
  const [githubUrl, setGithubUrl] = useState('')
  const [codeInput, setCodeInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === 'github') {
      onScan({ sourceType: 'github', source: githubUrl })
    } else if (activeTab === 'paste') {
      onScan({ sourceType: 'paste', source: 'pasted-code', code: codeInput })
    } else {
      // Mock ZIP upload
      onScan({ sourceType: 'zip', source: 'uploaded-project.zip' })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Scan Your Vibe-Coded App</CardTitle>
        <CardDescription>
          Check your app against the 4 critical security checks before shipping
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="github" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
                <Github className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">GitHub</span>
              </TabsTrigger>
              <TabsTrigger value="zip" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
                <FileArchive className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">ZIP</span>
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3">
                <Code className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">Paste</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Repository URL</label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isScanning}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL to your public GitHub repository
                </p>
              </div>
            </TabsContent>

            <TabsContent value="zip" className="mt-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileArchive className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your project ZIP file here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse (mock - any file will work for demo)
                </p>
                <Input
                  type="file"
                  accept=".zip"
                  className="mt-4"
                  disabled={isScanning}
                  onChange={() => {}}
                />
              </div>
            </TabsContent>

            <TabsContent value="paste" className="mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paste Your Code</label>
                <Textarea
                  placeholder="Paste your code here to scan for security issues..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  disabled={isScanning}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={isScanning || (activeTab === 'github' && !githubUrl) || (activeTab === 'paste' && !codeInput)}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              'Start Security Scan'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
