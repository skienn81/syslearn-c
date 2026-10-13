import React from 'react'

export function renderHighlightedCCode(code: string): React.ReactNode[] {
  const lines = code.split('\n')

  return lines.map((line, lineIdx) => {
    return (
      <div key={lineIdx} className="leading-6 min-h-[1.5rem] whitespace-pre">
        {tokenizeCLine(line)}
      </div>
    )
  })
}

function tokenizeCLine(line: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  let remaining = line
  let keyIdx = 0

  // Regex patterns
  const commentRegex = /^(\/\/.*|\/\*.*?\*\/)/
  const preprocessorRegex = /^(#include\s*<[^>]+>|#define\s+[^\s]+|#[a-zA-Z]+)/
  const stringRegex = /^("(\\.|[^"\\])*")/
  const keywordRegex = /^(int|char|float|double|void|short|long|unsigned|signed|struct|return|if|else|while|for|switch|case|break|continue|default|sizeof)\b/
  const functionRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/
  const numberRegex = /^(0x[0-9a-fA-F]+|[0-9]+\.[0-9]+f?|[0-9]+f?)\b/
  const operatorRegex = /^([+\-*/%&|^~!=<>]=?|<<|>>|&&|\|\|)/
  const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)/

  while (remaining.length > 0) {
    // 1. Whitespace
    const wsMatch = remaining.match(/^(\s+)/)
    if (wsMatch) {
      elements.push(<span key={keyIdx++}>{wsMatch[1]}</span>)
      remaining = remaining.slice(wsMatch[1].length)
      continue
    }

    // 2. Comments
    const commentMatch = remaining.match(commentRegex)
    if (commentMatch) {
      elements.push(
        <span key={keyIdx++} className="text-slate-500 italic">
          {commentMatch[1]}
        </span>
      )
      remaining = remaining.slice(commentMatch[1].length)
      continue
    }

    // 3. Preprocessor #include
    const prepMatch = remaining.match(preprocessorRegex)
    if (prepMatch) {
      elements.push(
        <span key={keyIdx++} className="text-amber-400 font-medium">
          {prepMatch[1]}
        </span>
      )
      remaining = remaining.slice(prepMatch[1].length)
      continue
    }

    // 4. Strings
    const strMatch = remaining.match(stringRegex)
    if (strMatch) {
      elements.push(
        <span key={keyIdx++} className="text-emerald-400 font-normal">
          {strMatch[1]}
        </span>
      )
      remaining = remaining.slice(strMatch[1].length)
      continue
    }

    // 5. C Keywords & Types
    const kwMatch = remaining.match(keywordRegex)
    if (kwMatch) {
      elements.push(
        <span key={keyIdx++} className="text-purple-400 font-semibold">
          {kwMatch[1]}
        </span>
      )
      remaining = remaining.slice(kwMatch[1].length)
      continue
    }

    // 6. Function calls (printf, scanf, main, swap...)
    const fnMatch = remaining.match(functionRegex)
    if (fnMatch) {
      elements.push(
        <span key={keyIdx++} className="text-sky-400 font-medium">
          {fnMatch[1]}
        </span>
      )
      remaining = remaining.slice(fnMatch[1].length)
      continue
    }

    // 7. Numbers (0x05, 100.0f, 42...)
    const numMatch = remaining.match(numberRegex)
    if (numMatch) {
      elements.push(
        <span key={keyIdx++} className="text-orange-400 font-mono">
          {numMatch[1]}
        </span>
      )
      remaining = remaining.slice(numMatch[1].length)
      continue
    }

    // 8. Operators (&, |, ^, ~, <<, >>...)
    const opMatch = remaining.match(operatorRegex)
    if (opMatch) {
      elements.push(
        <span key={keyIdx++} className="text-cyan-300 font-bold">
          {opMatch[1]}
        </span>
      )
      remaining = remaining.slice(opMatch[1].length)
      continue
    }

    // 9. Standard variables/identifiers
    const varMatch = remaining.match(variableRegex)
    if (varMatch) {
      elements.push(
        <span key={keyIdx++} className="text-slate-200">
          {varMatch[1]}
        </span>
      )
      remaining = remaining.slice(varMatch[1].length)
      continue
    }

    // 10. Fallback single char (semicolon, parens, brackets...)
    const char = remaining[0]
    elements.push(
      <span key={keyIdx++} className="text-slate-400">
        {char}
      </span>
    )
    remaining = remaining.slice(1)
  }

  return elements
}
