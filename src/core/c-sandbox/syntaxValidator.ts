export interface SyntaxValidationError {
  line: number
  column: number
  message: string
  lineContent: string
  token?: string
  gccError: string
}

const C_TYPES = new Set([
  'void',
  'int',
  'char',
  'short',
  'long',
  'float',
  'double',
  'signed',
  'unsigned',
  'size_t',
  'ssize_t',
  'uint8_t',
  'uint16_t',
  'uint32_t',
  'uint64_t',
  'int8_t',
  'int16_t',
  'int32_t',
  'int64_t',
  'bool',
  'struct',
  'union',
  'enum',
])

const C_KEYWORDS = new Set([
  'if',
  'else',
  'while',
  'for',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'return',
  'goto',
  'typedef',
  'const',
  'static',
  'volatile',
  'extern',
  'inline',
  'sizeof',
  'NULL',
])

const STANDARD_FUNCTIONS = new Set([
  'printf',
  'scanf',
  'malloc',
  'free',
  'calloc',
  'realloc',
  'exit',
  'puts',
  'gets',
  'putchar',
  'getchar',
  'strlen',
  'strcpy',
  'strncpy',
  'strcmp',
  'strncmp',
  'strcat',
  'memset',
  'memcpy',
  'memmove',
  'memcmp',
  'atoi',
  'atof',
  'atol',
  'abs',
  'sqrt',
  'pow',
  'fork',
  'getpid',
  'getppid',
  'wait',
  'waitpid',
  'execvp',
  'execlp',
  'pipe',
  'close',
  'read',
  'write',
])

export function validateCSyntax(rawCode: string, fileName: string = 'solution.c'): SyntaxValidationError | null {
  // If it's a shell script, skip C syntax validation
  if (
    rawCode.includes('mkdir') ||
    rawCode.includes('ls -la') ||
    rawCode.includes('pwd') ||
    rawCode.startsWith('#!/bin') ||
    (!rawCode.includes('main') && rawCode.includes('my_project'))
  ) {
    return null
  }

  const rawLines = rawCode.split('\n')

  // 1. Check for unclosed string literals
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    let inStr = false
    let strCol = 0
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"' && (c === 0 || line[c - 1] !== '\\')) {
        inStr = !inStr
        if (inStr) strCol = c + 1
      }
    }
    if (inStr) {
      return formatGccError(
        fileName,
        i + 1,
        strCol,
        line,
        'missing terminating " character',
        line.trim()
      )
    }
  }

  // 1b. Check for #include malformations:
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim()
    if (line.startsWith('#include')) {
      if (line.includes('<') && !line.includes('>')) {
        return formatGccError(
          fileName,
          i + 1,
          line.indexOf('<') + 1,
          rawLines[i],
          'missing terminating > character',
          '>'
        )
      }
      if (!line.includes('<') && !line.includes('"') && line.length > 8) {
        return formatGccError(
          fileName,
          i + 1,
          9,
          rawLines[i],
          '#include expects "FILENAME" or <FILENAME>',
          line
        )
      }
    } else if (line.startsWith('include ') || line.startsWith('include<') || line.startsWith('include"')) {
      return formatGccError(
        fileName,
        i + 1,
        1,
        rawLines[i],
        'unknown type name ‘include’',
        'include'
      )
    }

    // Check for missing comma between string literal and argument in function calls
    // e.g. printf("%d" age) or scanf("%d" &age)
    const missingCommaMatch = line.match(/"\s+(&?[a-zA-Z_]\w*)/)
    if (missingCommaMatch && line.includes('(') && line.includes(')')) {
      const col = (missingCommaMatch.index || 0) + missingCommaMatch[0].length
      const token = missingCommaMatch[1]
      return formatGccError(
        fileName,
        i + 1,
        col,
        rawLines[i],
        `expected ‘)’ before ‘${token}’`,
        token
      )
    }
  }

  // 2. Remove comments while preserving line breaks
  let cleanCode = ''
  let inBlockComment = false

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i]
    let cleanLine = ''
    let j = 0

    while (j < line.length) {
      if (inBlockComment) {
        if (line[j] === '*' && line[j + 1] === '/') {
          inBlockComment = false
          cleanLine += '  '
          j += 2
        } else {
          cleanLine += ' '
          j++
        }
      } else {
        if (line[j] === '/' && line[j + 1] === '*') {
          inBlockComment = true
          cleanLine += '  '
          j += 2
        } else if (line[j] === '/' && line[j + 1] === '/') {
          // Single line comment
          cleanLine += ' '.repeat(line.length - j)
          break
        } else {
          cleanLine += line[j]
          j++
        }
      }
    }
    cleanCode += cleanLine + '\n'
  }

  const lines = cleanCode.split('\n')

  // 3. Check Bracket / Parentheses Balance & Matching
  const bracketStack: { char: string; line: number; col: number }[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let inString = false

    for (let j = 0; j < line.length; j++) {
      const ch = line[j]
      if (ch === '"' && (j === 0 || line[j - 1] !== '\\')) {
        inString = !inString
        continue
      }
      if (inString) continue

      if (ch === '{' || ch === '(' || ch === '[') {
        bracketStack.push({ char: ch, line: i + 1, col: j + 1 })
      } else if (ch === '}' || ch === ')' || ch === ']') {
        if (bracketStack.length === 0) {
          const expected = ch === '}' ? '{' : ch === ')' ? '(' : '['
          return formatGccError(
            fileName,
            i + 1,
            j + 1,
            rawLines[i],
            `expected '${expected}' before '${ch}' token`,
            ch
          )
        }
        const top = bracketStack.pop()!
        const matches =
          (top.char === '{' && ch === '}') ||
          (top.char === '(' && ch === ')') ||
          (top.char === '[' && ch === ']')

        if (!matches) {
          const expected = top.char === '{' ? '}' : top.char === '(' ? ')' : ']'
          return formatGccError(
            fileName,
            i + 1,
            j + 1,
            rawLines[i],
            `expected '${expected}' before '${ch}' token`,
            ch
          )
        }
      }
    }
  }

  if (bracketStack.length > 0) {
    const unclosed = bracketStack[bracketStack.length - 1]
    const expected = unclosed.char === '{' ? '}' : unclosed.char === '(' ? ')' : ']'
    return formatGccError(
      fileName,
      lines.length,
      1,
      rawLines[rawLines.length - 1] || '',
      `expected ‘${expected}’ at end of input`,
      ''
    )
  }

  // 4. Check for Empty argument expressions: e.g. `( , )` or `(, a)` or `(a, )`
  // Critical: catches `scanf("%d", );`
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Check empty comma before closing paren: `,\s*\)`
    const danglingCommaMatch = line.match(/,\s*\)/)
    if (danglingCommaMatch) {
      const col = (danglingCommaMatch.index || 0) + 1
      return formatGccError(
        fileName,
        i + 1,
        col + 1,
        rawLines[i],
        `expected expression before ‘)’ token`,
        ')'
      )
    }

    // Check comma right after opening paren: `\(\s*,`
    const leadingCommaMatch = line.match(/\(\s*,/)
    if (leadingCommaMatch) {
      const col = (leadingCommaMatch.index || 0) + 1
      return formatGccError(
        fileName,
        i + 1,
        col + 1,
        rawLines[i],
        `expected expression before ‘,’ token`,
        ','
      )
    }

    // Check double commas: `,\s*,`
    const doubleCommaMatch = line.match(/,\s*,/)
    if (doubleCommaMatch) {
      const col = (doubleCommaMatch.index || 0) + 1
      return formatGccError(
        fileName,
        i + 1,
        col + 1,
        rawLines[i],
        `expected expression before ‘,’ token`,
        ','
      )
    }
  }

  // 5. Check for incomplete expressions before semicolon: `= ;`, `+ ;`, `- ;`, `* ;`, `/ ;`
  // Do NOT match ++ or -- (e.g., count++; i++;)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const incompleteMatch = line.match(/(=|(?<!\+)\+|(?<!\-)\-|\*|\/|%|&&|\|\||&|\||\^)\s*;/)
    if (incompleteMatch) {
      const col = (incompleteMatch.index || 0) + 1
      return formatGccError(
        fileName,
        i + 1,
        col + incompleteMatch[1].length,
        rawLines[i],
        `expected expression before ‘;’ token`,
        ';'
      )
    }
  }

  // 6. Gather all declared functions and variables
  const declaredIdentifiers = new Set<string>([
    ...STANDARD_FUNCTIONS,
    'argc',
    'argv',
    'main',
  ])

  // Extract function definitions: type func_name(params)
  const funcDefRegex = /\b([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g
  let fMatch: RegExpExecArray | null
  while ((fMatch = funcDefRegex.exec(cleanCode)) !== null) {
    declaredIdentifiers.add(fMatch[1])
    // Add parameters
    const paramStr = fMatch[2]
    if (paramStr.trim() && paramStr.trim() !== 'void') {
      const params = paramStr.split(',')
      for (const p of params) {
        const pMatch = p.trim().match(/([a-zA-Z_]\w*)\s*(?:\[\s*\])?$/)
        if (pMatch) {
          declaredIdentifiers.add(pMatch[1])
        }
      }
    }
  }

  // Extract variables declared with types
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) continue

    // Check variable declaration: [unsigned] int/char/... [*] var1, var2;
    const typeMatch = line.match(
      /^(?:const\s+|static\s+)?(?:unsigned\s+|signed\s+)?(char|short|int|long|float|double|size_t|struct\s+\w+)\s+(.+);?$/
    )
    if (typeMatch) {
      const rest = typeMatch[2]
      const decls = rest.split(',')
      for (const d of decls) {
        const varMatch = d.trim().match(/(?:\*+\s*)?([a-zA-Z_]\w*)(?:\s*\[[^\]]*\])?(?:\s*=.*)?$/)
        if (varMatch && !C_KEYWORDS.has(varMatch[1])) {
          declaredIdentifiers.add(varMatch[1])
        }
      }
    }

    // for (int i = 0; ... )
    const forMatch = line.match(/\bfor\s*\(\s*(?:int|size_t)\s+([a-zA-Z_]\w*)/)
    if (forMatch) {
      declaredIdentifiers.add(forMatch[1])
    }
  }

  // 7. Check for Missing Semicolons and Undeclared Variables line by line
  let inFunction = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const lineNum = i + 1

    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue // preprocessor

    if (trimmed.includes('{')) {
      inFunction = true
    }
    if (trimmed.includes('}')) {
      // end block
    }

    if (!inFunction) continue

    // Ignore block delimiters and control flow lines
    if (
      trimmed === '{' ||
      trimmed === '}' ||
      trimmed.startsWith('if ') ||
      trimmed.startsWith('if(') ||
      trimmed.startsWith('else') ||
      trimmed.startsWith('while ') ||
      trimmed.startsWith('while(') ||
      trimmed.startsWith('for ') ||
      trimmed.startsWith('for(') ||
      trimmed.startsWith('switch ') ||
      trimmed.startsWith('switch(') ||
      trimmed.startsWith('case ') ||
      trimmed.startsWith('default:') ||
      trimmed.endsWith('{')
    ) {
      continue
    }

    // Line should end with ; or be part of a multi-line statement
    // If line does NOT end with ';' or '{' or '}' or ','
    const lastChar = trimmed[trimmed.length - 1]
    if (lastChar !== ';' && lastChar !== '{' && lastChar !== '}' && lastChar !== ',') {
      // Check if the NEXT non-empty line starts a new statement
      let nextStartsNewStatement = false
      for (let k = i + 1; k < lines.length; k++) {
        const nextTrimmed = lines[k].trim()
        if (!nextTrimmed) continue
        // If next line starts with a keyword, type, function call, return, etc.
        if (
          /^(int|char|float|double|short|long|unsigned|void|return|printf|scanf|if|while|for|\w+\s*=|\w+\s*\()/.test(
            nextTrimmed
          ) ||
          nextTrimmed === '}'
        ) {
          nextStartsNewStatement = true
        }
        break
      }

      if (nextStartsNewStatement) {
        const col = line.length
        const nextLineText = rawLines[i + 1] ? rawLines[i + 1].trim().split(/\s+/)[0] : 'end of statement'
        return formatGccError(
          fileName,
          lineNum,
          col,
          rawLines[i],
          `expected ‘;’ before ‘${nextLineText}’`,
          ';'
        )
      }
    }

    // 8. Check for Undeclared Variables in assignments or statements:
    // e.g. `age = 20;` or `total = total + 1;` where identifier is not declared
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=/);
    if (assignMatch) {
      const ident = assignMatch[1]
      if (!declaredIdentifiers.has(ident) && !C_KEYWORDS.has(ident) && !C_TYPES.has(ident)) {
        const col = line.indexOf(ident) + 1
        return formatGccError(
          fileName,
          lineNum,
          col,
          rawLines[i],
          `‘${ident}’ undeclared (first use in this function)`,
          ident
        )
      }
    }

    // Check for random standalone word: `asdfasdf;`
    const singleWordMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*;$/)
    if (singleWordMatch) {
      const ident = singleWordMatch[1]
      if (!declaredIdentifiers.has(ident) && !C_KEYWORDS.has(ident)) {
        const col = line.indexOf(ident) + 1
        return formatGccError(
          fileName,
          lineNum,
          col,
          rawLines[i],
          `‘${ident}’ undeclared (first use in this function)`,
          ident
        )
      }
    }

    // Check for unknown type: `abc xyz;`
    const unknownTypeMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*)\s*;$/)
    if (unknownTypeMatch) {
      const maybeType = unknownTypeMatch[1]
      if (!C_TYPES.has(maybeType) && !C_KEYWORDS.has(maybeType) && !declaredIdentifiers.has(maybeType)) {
        const col = line.indexOf(maybeType) + 1
        return formatGccError(
          fileName,
          lineNum,
          col,
          rawLines[i],
          `unknown type name ‘${maybeType}’`,
          maybeType
        )
      }
    }

    // Check for unknown function call: `prntf("...");`
    const funcCallMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*\(/)
    if (funcCallMatch) {
      const fnName = funcCallMatch[1]
      if (
        !declaredIdentifiers.has(fnName) &&
        !C_KEYWORDS.has(fnName) &&
        !C_TYPES.has(fnName) &&
        fnName !== 'sizeof'
      ) {
        const col = line.indexOf(fnName) + 1
        return formatGccError(
          fileName,
          lineNum,
          col,
          rawLines[i],
          `implicit declaration of function ‘${fnName}’ [-Wimplicit-function-declaration]`,
          fnName
        )
      }
    }
  }

  return null
}

function formatGccError(
  fileName: string,
  line: number,
  col: number,
  lineContent: string,
  message: string,
  token?: string
): SyntaxValidationError {
  const paddedLine = String(line).padStart(5, ' ')
  const underlineCol = Math.max(1, col)
  const caretPadding = ' '.repeat(underlineCol - 1)

  const gccError =
`${fileName}: In function ‘main’:
${fileName}:${line}:${underlineCol}: error: ${message}
${paddedLine} | ${lineContent}
      | ${caretPadding}^`

  return {
    line,
    column: underlineCol,
    message,
    lineContent,
    token,
    gccError,
  }
}
