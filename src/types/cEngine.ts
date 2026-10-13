export interface DiagnosticIssue {
  id: string
  line: number
  column?: number
  type: 'error' | 'warning' | 'tip'
  title: string
  problematicCodeSnippet: string
  systemExplanation: string // Giải thích bản chất cấp thấp
  suggestedFix: string     // Hướng dẫn khắc phục
  correctedCodeSnippet?: string
}

export interface CExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  memoryState?: {
    stackFrames: any[]
    variables: Record<string, any>
  }
  diagnostics: DiagnosticIssue[]
  durationMs: number
}
