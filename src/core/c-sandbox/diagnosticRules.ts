import { DiagnosticIssue } from '../../types/cEngine'

export function analyzeCCodeDiagnostics(code: string): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = []
  const lines = code.split('\n')

  lines.forEach((lineText, index) => {
    const lineNum = index + 1
    const trimmed = lineText.trim()

    // Bỏ qua dòng comment
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return

    // 1. Kiểm tra thiếu dấu & trong scanf
    // Ví dụ: scanf("%d", a); thay vì scanf("%d", &a);
    const scanfMatch = lineText.match(/scanf\s*\(\s*["']([^"']*)["']\s*,\s*([^)]+)\)/)
    if (scanfMatch) {
      const formatString = scanfMatch[1]
      const args = scanfMatch[2].split(',').map(s => s.trim())
      
      // Nếu có %d, %f, %c, %lf...
      if (/%[0-9]*[dfliuxX]/.test(formatString)) {
        args.forEach(arg => {
          // Nếu không bắt đầu bằng & và không phải mảng/con trỏ rõ ràng
          if (!arg.startsWith('&') && !arg.includes('[') && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(arg)) {
            issues.push({
              id: `diag_scanf_${lineNum}`,
              line: lineNum,
              type: 'error',
              title: 'Lỗi Thiếu Toán Tử Lấy Địa Chỉ (&) Trong scanf',
              problematicCodeSnippet: lineText.trim(),
              systemExplanation: `Ngôn ngữ C truyền đối số theo THAM TRỊ (Pass-by-value). Khi gọi scanf("%d", ${arg}), hàm scanf chỉ nhận được một bản sao giá trị hiện tại của ${arg}, chứ không biết nó nằm ở đâu trong RAM. Để scanf có thể ghi đè giá trị từ bàn phím vào ô nhớ, bạn bắt buộc phải truyền ĐỊA CHỈ Ô NHỚ bằng toán tử '&'.`,
              suggestedFix: `Sửa '${arg}' thành '&${arg}'.`,
              correctedCodeSnippet: lineText.replace(new RegExp(`\\b${arg}\\b`), `&${arg}`),
            })
          }
        })
      }
    }

    // 2. Kiểm tra lỗi chia số nguyên (Integer Division Truncation)
    // Ví dụ: 5 / 9 hoặc 9 / 5 hoặc (5/9)
    const intDivConstMatch = lineText.match(/\b([0-9]+)\s*\/\s*([0-9]+)\b/)
    if (intDivConstMatch && (lineText.includes('float') || lineText.includes('double') || lineText.includes('='))) {
      const num1 = parseInt(intDivConstMatch[1], 10)
      const num2 = parseInt(intDivConstMatch[2], 10)
      if (num2 !== 0 && num1 < num2) {
        issues.push({
          id: `diag_div_${lineNum}`,
          line: lineNum,
          type: 'warning',
          title: 'Cảnh Báo: Phép Chia Số Nguyên Sẽ Bị Cắt Cụt Về 0',
          problematicCodeSnippet: lineText.trim(),
          systemExplanation: `Trong C, phép chia giữa 2 số nguyên (${num1} / ${num2}) sẽ sinh ra kết quả kiểu số nguyên. Mọi phần lẻ thập phân bị CPU loại bỏ ngay lập tức, do đó ${num1} / ${num2} = 0! Dù bạn có gán vào biến float/double thì giá trị nhận được vẫn là 0.00.`,
          suggestedFix: `Đổi ít nhất một toán hạng thành số thực: ${num1}.0f / ${num2}.0f hoặc ép kiểu (float)${num1} / ${num2}.`,
          correctedCodeSnippet: lineText.replace(`${num1} / ${num2}`, `${num1}.0f / ${num2}.0f`),
        })
      }
    }

    // 3. Kiểm tra phép gán trong biểu thức if (Assignment in condition)
    // Ví dụ: if (x = 5) thay vì if (x == 5)
    const ifAssignMatch = lineText.match(/if\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=)]+)\)/)
    if (ifAssignMatch && !lineText.includes('==') && !lineText.includes('!=') && !lineText.includes('<=') && !lineText.includes('>=')) {
      const varName = ifAssignMatch[1]
      const val = ifAssignMatch[2].trim()
      issues.push({
        id: `diag_if_assign_${lineNum}`,
        line: lineNum,
        type: 'error',
        title: 'Cảnh Báo Nhầm Phép Gán (=) Với So Sánh Bằng (==)',
        problematicCodeSnippet: lineText.trim(),
        systemExplanation: `Bạn đang dùng dấu '=' bên trong 'if'. Đây là phép gán giá trị ${val} cho biến ${varName}. Giá trị của biểu thức điều kiện sẽ chính là ${val}. Nếu ${val} khác 0, điều kiện if luôn luôn ĐÚNG; nếu ${val} = 0, điều kiện luôn SAI.`,
        suggestedFix: `Sửa '=' thành '==' để so sánh giá trị: if (${varName} == ${val})`,
        correctedCodeSnippet: lineText.replace(`${varName} = ${val}`, `${varName} == ${val}`),
      })
    }

    // 4. Kiểm tra chuỗi ký tự bị thiếu null terminator '\0'
    // Ví dụ: char s[5] = "hello";
    const strMatch = lineText.match(/char\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\[\s*([0-9]+)\s*\]\s*=\s*"([^"]+)"/)
    if (strMatch) {
      const varName = strMatch[1]
      const size = parseInt(strMatch[2], 10)
      const literal = strMatch[3]
      if (literal.length >= size) {
        issues.push({
          id: `diag_null_term_${lineNum}`,
          line: lineNum,
          type: 'error',
          title: 'Tràn Bộ Đệm: Mảng Chuỗi Không Đủ Chỗ Cho Ký Tự Null (\\0)',
          problematicCodeSnippet: lineText.trim(),
          systemExplanation: `Chuỗi "${literal}" có độ dài ${literal.length} ký tự. Trong C, mọi chuỗi ký tự hợp lệ đều bắt buộc phải có 1 byte null terminator '\\0' ở cuối cùng để các hàm như printf("%s"), strlen biết điểm dừng. Kích thước mảng ${size} là không đủ (cần tối thiểu ${literal.length + 1} bytes). Khi in chuỗi này, chương trình sẽ đọc tràn sang các ô nhớ rác kế tiếp!`,
          suggestedFix: `Tăng kích thước mảng lên tối thiểu [${literal.length + 1}] hoặc để trống [] để trình biên dịch tự tính: char ${varName}[] = "${literal}";`,
          correctedCodeSnippet: lineText.replace(`[${size}]`, `[${literal.length + 1}]`),
        })
      }
    }

    // 5. Kiểm tra con trỏ hoang (Wild Pointer / Uninitialized Pointer)
    if (/int\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*;/.test(lineText)) {
      const ptrName = lineText.match(/int\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*;/)?.[1]
      if (ptrName) {
        issues.push({
          id: `diag_wild_ptr_${lineNum}`,
          line: lineNum,
          type: 'tip',
          title: 'Lưu Ý: Khởi Tạo Con Trỏ An Toàn Tránh SIGSEGV',
          problematicCodeSnippet: lineText.trim(),
          systemExplanation: `Con trỏ '${ptrName}' vừa được khai báo mà chưa gán địa chỉ. Lúc này '${ptrName}' đang chứa một địa chỉ rác trong bộ nhớ. Nếu bạn thực hiện *${ptrName} = ..., chương trình sẽ cố ghi vào ô nhớ không được phép và bị hệ điều hành Linux gửi tín hiệu hủy tiến trình (Segmentation fault / SIGSEGV).`,
          suggestedFix: `Luôn khởi tạo con trỏ bằng NULL hoặc trỏ tới một biến có thực: int *${ptrName} = NULL;`,
        })
      }
    }
  })

  return issues
}
