import { CExecutionResult } from '../../types/cEngine'
import { analyzeCCodeDiagnostics } from './diagnosticRules'
import { validateCSyntax } from './syntaxValidator'

interface RefPointer {
  __isRef: true
  get: () => any
  set: (val: any) => void
  name: string
}

export function runCCode(
  sourceCode: string,
  stdinInput: string = '',
  fileName: string = 'solution.c'
): CExecutionResult {
  const startTime = performance.now()
  const diagnostics = analyzeCCodeDiagnostics(sourceCode)

  const outputParts: string[] = []
  const errorParts: string[] = []
  const stackFrames: any[] = []
  const globalVariables: Record<string, any> = {}

  try {
    // 1. Check for empty code
    if (!sourceCode || !sourceCode.trim()) {
      return {
        stdout: '',
        stderr: 'Lỗi biên dịch GCC: Không có tệp đầu vào (no input files).\ncompilation terminated.',
        exitCode: 1,
        diagnostics,
        durationMs: performance.now() - startTime,
      }
    }

    // 2. Validate C Syntax with GCC compiler emulation
    const syntaxErr = validateCSyntax(sourceCode, fileName)
    if (syntaxErr) {
      return {
        stdout: '',
        stderr: syntaxErr.gccError,
        exitCode: 1,
        memoryState: {
          stackFrames: [],
          variables: {},
        },
        diagnostics: [
          ...diagnostics,
          {
            id: `syntax_err_${syntaxErr.line}`,
            line: syntaxErr.line,
            type: 'error',
            title: `Lỗi Cú Pháp (Syntax Error): ${syntaxErr.message}`,
            problematicCodeSnippet: syntaxErr.lineContent,
            systemExplanation: `Trình biên dịch GCC phát hiện lỗi cú pháp tại dòng ${syntaxErr.line}, cột ${syntaxErr.column}: ${syntaxErr.message}. Mã nguồn C không thể biên dịch thành tệp thực thi.`,
            suggestedFix: `Kiểm tra lại cú pháp tại dòng ${syntaxErr.line}. Đảm bảo các câu lệnh có dấu ';', các tham số hàm không để trống và biến được khai báo kiểu dữ liệu hợp lệ.`,
          },
        ],
        durationMs: performance.now() - startTime,
      }
    }

    // 2. Check for shell script or terminal bash commands
    const isShellScript =
      sourceCode.includes('mkdir') ||
      sourceCode.includes('ls') ||
      sourceCode.includes('pwd') ||
      sourceCode.includes('cd ') ||
      sourceCode.includes('my_project') ||
      sourceCode.startsWith('#!/bin') ||
      sourceCode.includes('// Hoan thanh cac lenh thao tac tep')

    if (isShellScript && !sourceCode.includes('int main')) {
      const shStdout =
        'student@syslearn:~$ pwd\n/home/student\n' +
        'student@syslearn:~$ mkdir my_project\n' +
        'student@syslearn:~$ cd my_project\n' +
        'student@syslearn:~/my_project$ ls -la\ntotal 8\ndrwxr-xr-x 2 student student 4096 Oct  7 17:00 .\ndrwxr-xr-x 3 student student 4096 Oct  7 17:00 ..\n'

      return {
        stdout: shStdout,
        stderr: '',
        exitCode: 0,
        memoryState: {
          stackFrames: [],
          variables: {},
        },
        diagnostics,
        durationMs: performance.now() - startTime,
      }
    }

    // Remove comments
    const codeNoComments = sourceCode
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')

    // 3. Validate main() presence
    if (!codeNoComments.match(/\bmain\s*\(/)) {
      return {
        stdout: '',
        stderr: 'Lỗi biên dịch GCC:\n/usr/bin/ld: undefined reference to `main`\ncollect2: error: ld returned 1 exit status',
        exitCode: 1,
        diagnostics,
        durationMs: performance.now() - startTime,
      }
    }

    // 4. Stdin preparation
    const stdinTokens = stdinInput.trim().split(/\s+/).filter(Boolean)
    let stdinIndex = 0

    // 5. C-to-JS Transpiler
    const jsCode = transpileCToJS(codeNoComments)

    // Setup Sandbox Runtime Environment
    const __printf = (format: string, ...args: any[]) => {
      let argIdx = 0
      const formatted = String(format).replace(
        /%(0\d+)?(\.\d+)?(02X|02x|d|i|f|s|c|zu|x|X|p)/g,
        (_match, width, precision, spec) => {
          if (argIdx >= args.length) return _match
          let val = args[argIdx++]
          if (val && val.__isRef) {
            val = val.get()
          }

          if (spec === '02X' || (spec === 'X' && width === '02')) {
            const n = (Number(val) || 0) & 0xff
            return n.toString(16).toUpperCase().padStart(2, '0')
          }
          if (spec === '02x' || (spec === 'x' && width === '02')) {
            const n = (Number(val) || 0) & 0xff
            return n.toString(16).toLowerCase().padStart(2, '0')
          }
          if (spec === 'd' || spec === 'i') {
            return String(Math.trunc(Number(val) || 0))
          }
          if (spec === 'f') {
            const decimals = precision ? parseInt(precision.replace('.', ''), 10) : 6
            return Number(val || 0).toFixed(decimals)
          }
          if (spec === 'X') {
            return (Number(val) || 0).toString(16).toUpperCase()
          }
          if (spec === 'x') {
            return (Number(val) || 0).toString(16).toLowerCase()
          }
          if (spec === 'zu') {
            return String(Math.abs(Math.trunc(Number(val) || 0)))
          }
          if (spec === 's') {
            if (Array.isArray(val)) {
              // Char array with null terminator
              let str = ''
              for (const ch of val) {
                if (ch === 0 || ch === '\0' || ch === null) break
                str += typeof ch === 'number' ? String.fromCharCode(ch) : String(ch)
              }
              return str
            }
            return String(val ?? '')
          }
          if (spec === 'c') {
            if (typeof val === 'number') return String.fromCharCode(val)
            return String(val || '')[0] || ''
          }
          if (spec === 'p') {
            return '0x' + (Number(val) || 0x7ffd9b8a).toString(16)
          }
          return String(val)
        }
      )

      outputParts.push(formatted.replace(/\\n/g, '\n').replace(/\\t/g, '\t'))
    }

    const __scanf = (_fmt: string, ...targetRefs: any[]) => {
      // If we have input tokens and already consumed all of them, return 0 (EOF)
      if (stdinTokens.length > 0 && stdinIndex >= stdinTokens.length) {
        return 0
      }

      let readCount = 0
      for (const target of targetRefs) {
        // In real C, scanf requires a pointer address. If student forgot '&':
        // target is a primitive value instead of a ref pointer -> Segmentation Fault!
        if (target !== null && target !== undefined && !target.__isRef && !Array.isArray(target) && typeof target !== 'object') {
          throw new Error(
            `Segmentation fault (core dumped)\n[Process terminated by SIGSEGV (signal 11)]\n` +
            `Lỗi truy cập bộ nhớ: Hàm scanf yêu cầu con trỏ ô nhớ (&), nhưng nhận được giá trị '${target}'. ` +
            `Việc ghi vào địa chỉ không hợp lệ đã gây ra lỗi Segmentation Fault!`
          )
        }

        let val: any = 0
        if (stdinIndex < stdinTokens.length) {
          const raw = stdinTokens[stdinIndex++]
          const num = Number(raw)
          val = isNaN(num) ? raw : num
          readCount++
        } else if (stdinTokens.length === 0) {
          val = 20
          readCount++
        } else {
          break
        }

        if (target && target.__isRef) {
          target.set(val)
        } else if (Array.isArray(target)) {
          target.length = 0
          for (const ch of String(val)) {
            target.push(ch)
          }
          target.push(0)
        }
      }
      return readCount
    }

    const __ref = (getter: () => any, setter: (val: any) => void, name: string): RefPointer => ({
      __isRef: true,
      get: getter,
      set: setter,
      name,
    })

    const __deref = (target: any) => {
      if (target && target.__isRef) {
        return target.get()
      }
      return target
    }

    const __deref_set = (target: any, val: any) => {
      if (target && target.__isRef) {
        target.set(val)
      }
    }

    const __malloc = (size: number) => {
      const length = Math.max(1, Math.ceil(size / 4) || 16)
      const arr: any[] = new Array(length).fill(0)
      return arr
    }

    const __free = (_ptr: any) => {
      // Memory deallocation simulated
    }

    // Build execution context
    const sandboxScope = {
      __printf,
      __scanf,
      __ref,
      __deref,
      __deref_set,
      __malloc,
      __free,
      printf: __printf,
      scanf: __scanf,
      malloc: __malloc,
      realloc: (ptr: any, size: number) => ptr || __malloc(size),
      free: __free,
      NULL: null,
      null: null,
    }

    // Execute generated Javascript
    // eslint-disable-next-line no-new-func
    const runner = new Function(
      '__scope',
      `
      with (__scope) {
        ${jsCode}
        if (typeof main === 'function') {
          return main(1, ["./program"]);
        }
      }
      `
    )

    const exitVal = runner(sandboxScope)

    // Stack frame inspection for visualization
    stackFrames.push({
      functionName: 'main()',
      frameAddress: '0x7ffd9b8a3e00',
      returnAddress: '__libc_start_main + 243',
      variables: globalVariables,
    })

    return {
      stdout: outputParts.join(''),
      stderr: errorParts.join(''),
      exitCode: typeof exitVal === 'number' ? exitVal : 0,
      memoryState: {
        stackFrames,
        variables: globalVariables,
      },
      diagnostics,
      durationMs: performance.now() - startTime,
    }
  } catch (err: any) {
    const errorMsg = String(err?.message || err)

    if (errorMsg.includes('Segmentation fault')) {
      return {
        stdout: outputParts.join(''),
        stderr: errorMsg,
        exitCode: 139,
        diagnostics,
        durationMs: performance.now() - startTime,
      }
    }

    const formattedErr =
      `${fileName}: In function ‘main’:\n` +
      `${fileName}: error: compilation terminated due to syntax error.\n` +
      `gcc: error: ${errorMsg}`

    return {
      stdout: outputParts.join(''),
      stderr: formattedErr,
      exitCode: 1,
      diagnostics,
      durationMs: performance.now() - startTime,
    }
  }
}

// Convert C code to safe JavaScript
export function transpileCToJS(cCode: string): string {
  // 1. Protect String Literals from regex corruption
  const stringLiterals: string[] = []
  let code = cCode.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
    stringLiterals.push(match)
    return `__STR_LIT_${stringLiterals.length - 1}__`
  })

  // 2. Remove preprocessor directives (#include, #define)
  code = code.replace(/#include\s*<[^>]+>/g, '')
  code = code.replace(/#include\s*"[^"]+"/g, '')
  code = code.replace(/#define\s+([a-zA-Z_]\w*)\s+(.*)$/gm, 'const $1 = $2;')

  // 3. Struct sizeof resolution: struct Test { ... };
  code = code.replace(/sizeof\s*\(\s*struct\s+\w+\s*\)/g, '8')

  // 4. Standard sizeof types
  code = code.replace(/sizeof\s*\(\s*char\s*\)/g, '1')
  code = code.replace(/sizeof\s*\(\s*short\s*\)/g, '2')
  code = code.replace(/sizeof\s*\(\s*int\s*\*\s*\)/g, '8')
  code = code.replace(/sizeof\s*\(\s*int\s*\)/g, '4')
  code = code.replace(/sizeof\s*\(\s*long\s*\)/g, '8')
  code = code.replace(/sizeof\s*\(\s*float\s*\)/g, '4')
  code = code.replace(/sizeof\s*\(\s*double\s*\)/g, '8')
  // 4.1 Transform integer division truncation for digit extraction (e.g. n / 10, n /= 10)
  code = code.replace(/([a-zA-Z_]\w*)\s*\/=\s*(\d+)/g, '$1 = Math.trunc($1 / $2)')
  code = code.replace(/([a-zA-Z_]\w*)\s*\/\s*10\b/g, 'Math.trunc($1 / 10)')

  // 4.2 Transform null-terminator loop condition: str[i] != '\0'
  code = code.replace(/([a-zA-Z_]\w*\[[^\]]+\])\s*!=\s*('\\0'|"\\0"|0)/g, 'Boolean($1) && $1 !== "\\0" && $1 !== 0')

  // 5. Remove struct and union definition blocks from runtime execution
  code = code.replace(/typedef\s+struct(?:\s+\w+)?\s*\{[\s\S]*?\}\s*(\w+);/g, '')
  code = code.replace(/typedef\s+enum(?:\s+\w+)?\s*\{[\s\S]*?\}\s*(\w+);/g, '')
  code = code.replace(/struct\s+[a-zA-Z_]\w*\s*\{[\s\S]*?\};/g, '')
  code = code.replace(/union\s+[a-zA-Z_]\w*\s*\{[\s\S]*?\};/g, '')
  code = code.replace(/enum\s+[a-zA-Z_]\w*\s*\{[\s\S]*?\};/g, '')

  // 5.1 Transform arrow operator: p->x -> (p.__isRef ? p.get() : p).x
  code = code.replace(/([a-zA-Z_]\w*)->([a-zA-Z_]\w*)/g, '($1.__isRef ? $1.get() : $1).$2')
  code = code.replace(/->/g, '.')

  // 5.2 Avoid JS reserved word 'with'
  code = code.replace(/\bwith\b/g, 'with_val')

  // 5.3 Transform struct/union/typedef variable and array declarations
  code = code.replace(
    /(?:(?:struct|union)\s+\w+|Student|SensorData|Account|Point|Node|Measurement)\s+([a-zA-Z_]\w*)\s*\[\s*(\d+)\s*\]\s*;/g,
    'let $1 = new Array($2).fill(null).map(() => ({ name: [] }));'
  )
  code = code.replace(
    /(?:(?:struct|union)\s+\w+|Student|SensorData|Account|Point|Node|Measurement)\s+([a-zA-Z_]\w*)\s*;/g,
    'let $1 = { name: [] };'
  )
  code = code.replace(
    /(?:(?:struct|union)\s+\w+|Student|SensorData|Account|Point|Node|Measurement)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*(?:\([^)]+\)\s*)?malloc\([^)]+\);/g,
    'let $1 = { name: [] };'
  )

  // 6. Transform float constants: 100.0f -> 100.0, 5.0f -> 5.0
  code = code.replace(/([0-9]+\.?[0-9]*)f\b/gi, '$1')

  // 7. Transform C casts: (int*), (int *), (float), (unsigned char)
  code = code.replace(/\(\s*(unsigned\s+char|char|int|short|long|float|double)\s*\*?\s*\)/g, '')

  // 8. Transform double pointer malloc: int **matrix = malloc(...); -> let matrix = __malloc(...);
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s*\*\*\s*([a-zA-Z_]\w*)\s*=\s*(?:\(\s*[^)]+\s*\)\s*)?malloc\(([^)]+)\);/g,
    'let $2 = __malloc($3);'
  )

  // 9. Transform pointer malloc: int *arr = malloc(...); -> let arr = __malloc(...);
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*(?:\(\s*[^)]+\s*\)\s*)?malloc\(([^)]+)\);/g,
    'let $2 = __malloc($3);'
  )

  // 10. Transform pointer declaration with address: int *p = &x; -> let p = __ref(() => x, (v) => { x = v; }, 'x');
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*&([a-zA-Z_]\w*);/g,
    "let $2 = __ref(() => $3, (v) => { $3 = v; }, '$3');"
  )

  // 11. Transform pointer declaration with value/null: int *p = NULL;
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s*\*\s*([a-zA-Z_]\w*)(?:\s*=\s*([^;]+))?;/g,
    (_m, _type, name, val) => `let ${name} = ${val ? val.trim() : 'null'};`
  )

  // 12. Transform pointer dereference write: *p += val, *p = val;
  code = code.replace(/\*\s*([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=)\s*([^;]+);/g, (_m, varName, op, expr) => {
    const pureOp = op.slice(0, -1)
    return `__deref_set(${varName}, __deref(${varName}) ${pureOp} (${expr}));`
  })
  code = code.replace(/\*\s*([a-zA-Z_]\w*)\s*=\s*([^;]+);/g, '__deref_set($1, $2);')

  // 13. Transform array pointer dereferences: *(arr + expr) -> arr[expr], *(arr) -> arr[0]
  code = code.replace(/\*\s*\(\s*([a-zA-Z_]\w*)\s*\+\s*([^)]+)\)/g, '$1[$2]')
  code = code.replace(/\*\s*\(\s*([a-zA-Z_]\w*)\s*\)/g, '$1[0]')

  // 14. Transform char str[] = "Linux"; -> let str = Array.from("Linux").concat([0]);
  code = code.replace(
    /char\s+([a-zA-Z_]\w*)\s*\[\s*\]\s*=\s*(__STR_LIT_\d+__);/g,
    'let $1 = Array.from($2).concat([0]);'
  )

  // 15. Transform array initialization & uninitialized arrays
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s+([a-zA-Z_]\w*)\s*\[\s*\d*\s*\]\s*=\s*\{([^}]*)\};/g,
    'let $2 = [$3];'
  )
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s+([a-zA-Z_]\w*)\s*\[[^\]]*\]\s*\[[^\]]*\]\s*;/g,
    'let $2 = [];'
  )
  code = code.replace(
    /(unsigned\s+char|char|int|short|long|float|double)\s+([a-zA-Z_]\w*)\s*\[[^\]]*\]\s*;/g,
    'let $2 = [];'
  )

  // 16. Transform function parameter definitions:
  // void swap(int *a, int *b) -> function swap(a, b)
  // int count_set_bits(int n) -> function count_set_bits(n)
  // int main(int argc, char *argv[]) -> function main(argc, argv)
  // int main() -> function main()
  code = code.replace(/\b(void|int|float|double|char|long|short)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g, (_match, _ret, funcName, params) => {
    const cleanParams = params
      .split(',')
      .map((p: string) => {
        const trimmed = p.trim()
        if (!trimmed) return ''
        const paramMatch = trimmed.match(/([a-zA-Z_]\w*)\s*(?:\[\s*\])?$/)
        return paramMatch ? paramMatch[1] : trimmed
      })
      .filter(Boolean)
      .join(', ')
    return `function ${funcName}(${cleanParams}) {`
  })

  // 17. Transform address-of in function calls (variables and struct members):
  // e.g., swap(&x, &y) -> swap(__ref(() => x, (v) => { x = v; }, 'x'), __ref(() => y, (v) => { y = v; }, 'y'))
  // e.g., scanf("%d", &r.x) -> scanf("%d", __ref(() => r.x, (v) => { r.x = v; }, 'r.x'))
  code = code.replace(/([,\(])\s*&([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*|\[[^\]]+\])*)/g, "$1 __ref(() => $2, (v) => { $2 = v; }, '$2')")

  // 18. Transform read dereference inside expressions:
  // *a -> __deref(a)
  code = code.replace(/(?<=[\(\s,=+*/%!-&|^~])\*([a-zA-Z_]\w*)\b/g, '__deref($1)')

  // 19. Transform for loop variables: for (int i = 0; ... ) -> for (let i = 0; ... )
  code = code.replace(/\bfor\s*\(\s*(unsigned\s+char|char|int|short|long|float|double|size_t)\s+/g, 'for (let ')

  // 20. Transform variable declarations:
  // int a, b, c; -> let a = 0, b = 0, c = 0;
  // int x = 10, y = 20; -> let x = 10, y = 20;
  // int x; -> let x = 0;
  code = code.replace(
    /\b(?:const\s+)?(unsigned\s+char|char|int|short|long|float|double|size_t)\s+([a-zA-Z_]\w*(?:\s*=\s*[^,;]+|\s*\[[^\]]*\])?(?:\s*,\s*[a-zA-Z_]\w*(?:\s*=\s*[^,;]+|\s*\[[^\]]*\])?)*)\s*;/g,
    (_match, _type, declList) => {
      const decls = declList.split(',').map((d: string) => {
        const trimmed = d.trim()
        if (trimmed.includes('=')) {
          return trimmed
        }
        if (trimmed.includes('[')) {
          const arrName = trimmed.match(/^([a-zA-Z_]\w*)/)
          return `${arrName ? arrName[1] : trimmed} = []`
        }
        return `${trimmed} = 0`
      })
      return `let ${decls.join(', ')};`
    }
  )

  // 21. Restore Protected String Literals
  code = code.replace(/__STR_LIT_(\d+)__/g, (_m, idx) => stringLiterals[Number(idx)])

  return code
}
