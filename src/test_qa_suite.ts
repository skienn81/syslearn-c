import { runCCode } from '../src/core/c-sandbox/cInterpreter'
import { analyzeCCodeDiagnostics } from '../src/core/c-sandbox/diagnosticRules'
import { VimEngine } from '../src/core/vim/VimEngine'
import { SESSIONS_DATA } from '../src/core/curriculum/curriculumData'

declare const process: any

console.log('====================================================')
console.log('🤖 KHỞI CHẠY BỘ KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN (QA SUITE)')
console.log('====================================================\n')

let passedTests = 0
let failedTests = 0

function assert(condition: boolean, testName: string, detail: string = '') {
  if (condition) {
    passedTests++
    console.log(`  ✅ [PASS] ${testName}`)
  } else {
    failedTests++
    console.error(`  ❌ [FAIL] ${testName} - ${detail}`)
  }
}

// SUITE 1: CHẠY THỬ TOÀN BỘ 14 BÀI TẬP LAB 2 + CÁC LAB KHÁC
console.log('--- TEST SUITE 1: KIỂM THỬ TẤT CẢ SOLUTION LABS VỚI TEST CASES ---')
const allLabs = SESSIONS_DATA.flatMap(s => s.labs)

allLabs.forEach(lab => {
  if (!lab.solutionCode) return
  lab.testCases.forEach((tc, idx) => {
    const res = runCCode(lab.solutionCode, tc.input)
    const passed = res.stdout.trim().includes(tc.expectedOutput.trim())
    assert(
      passed,
      `${lab.id} (#${lab.number} ${lab.title}) Test #${idx + 1}`,
      `Expected: "${tc.expectedOutput.trim()}", Got stdout: "${res.stdout.trim()}", stderr: "${res.stderr}"`
    )
  })
})

// SUITE 2: EDGE CASES CỦA C SANDBOX INTERPRETER
console.log('\n--- TEST SUITE 2: KIỂM THỬ CÁC TRƯỜNG HỢP BIÊN (EDGE CASES) TRONG C ENGINE ---')

// 2.1: Code rỗng
const emptyRes = runCCode('')
assert(emptyRes.exitCode !== 0, 'Edge case: Code rỗng trả về lỗi biên dịch', `ExitCode: ${emptyRes.exitCode}`)

// 2.2: Không có hàm main
const noMainRes = runCCode('int a = 10;')
assert(noMainRes.exitCode !== 0 && noMainRes.stderr.includes('main'), 'Edge case: Thiếu hàm main() báo lỗi rõ ràng')

// 2.3: Thân hàm main với comment phức tạp và nhiều dòng trống
const codeWithComments = `
// Comment dau dong
#include <stdio.h>
/* Block comment
   nhieu dong */
int main() {
    // Comment trong main
    int x = 42; /* inline comment */
    printf("Ket qua: %d\\n", x);
    return 0;
}
`
const commentRes = runCCode(codeWithComments)
assert(commentRes.stdout.includes('Ket qua: 42'), 'Edge case: Bóc tách comment C chuẩn xác (single-line & multi-line)')

// 2.4: Phép toán Bitwise phức tạp (AND, OR, XOR, NOT, Shift)
const bitwiseCode = `
int main() {
    int a = 5;      // 0101
    int b = 3;      // 0011
    int and_val = a & b; // 0001 = 1
    int or_val = a | b;  // 0111 = 7
    int xor_val = a ^ b; // 0110 = 6
    int shift_left = a << 2; // 5 * 4 = 20
    int shift_right = 20 >> 2; // 5
    printf("AND:%d OR:%d XOR:%d SHL:%d SHR:%d\\n", and_val, or_val, xor_val, shift_left, shift_right);
    return 0;
}
`
const bitRes = runCCode(bitwiseCode)
assert(bitRes.stdout.includes('AND:1 OR:7 XOR:6 SHL:20 SHR:5'), 'Edge case: Toán tử Bitwise (&, |, ^, <<, >>) tính toán chính xác')

// 2.5: Định dạng in printf hex (%02X, %X) và kiểu sizeof (%zu)
const formatCode = `
int main() {
    unsigned char flag = 0x0A;
    printf("HEX:0x%02X SIZEOF:%zu\\n", flag, sizeof(int));
    return 0;
}
`
const fmtRes = runCCode(formatCode)
assert(fmtRes.stdout.includes('HEX:0x0A SIZEOF:4'), 'Edge case: Định dạng %02X và %zu khớp chuẩn GCC')

// 2.6: Nhập liệu scanf với khoảng trắng, tab và nhiều tham số
const scanfMultiCode = `
int main() {
    int x = 0;
    int y = 0;
    scanf("%d %d", &x, &y);
    printf("Tong: %d\\n", x + y);
    return 0;
}
`
const scanfRes = runCCode(scanfMultiCode, '  15 \n  25  ')
assert(scanfRes.stdout.includes('Tong: 40'), 'Edge case: scanf với nhiều tokens và whitespace/newline')

// SUITE 3: KIỂM THỬ BỘ CHẨN ĐOÁN LỖI GCC (DIAGNOSTIC COACH)
console.log('\n--- TEST SUITE 3: KIỂM THỬ BỘ BẮT LỖI & CẢNH BÁO GCC DIAGNOSTICS ---')

// 3.1: Quên dấu & trong scanf
const diag1 = analyzeCCodeDiagnostics('scanf("%d", age);')
assert(diag1.some(d => d.title.includes('Thiếu Toán Tử')), 'Diagnostics: Bắt lỗi quên & trong scanf')

// 3.2: Chia số nguyên 5/9
const diag2 = analyzeCCodeDiagnostics('float c = (5 / 9) * 100;')
assert(diag2.some(d => d.title.includes('Phép Chia Số Nguyên')), 'Diagnostics: Bắt cảnh báo chia số nguyên 5 / 9 = 0')

// 3.3: Nhầm phép gán = trong if thay vì ==
const diag3 = analyzeCCodeDiagnostics('if (x = 5) { printf("true"); }')
assert(diag3.some(d => d.title.includes('Phép Gán')), 'Diagnostics: Bắt cảnh báo nhầm phép gán = trong if')

// 3.4: Chuỗi thiếu byte '\0'
const diag4 = analyzeCCodeDiagnostics('char s[5] = "Linux";')
assert(diag4.some(d => d.title.includes('Tràn Bộ Đệm')), 'Diagnostics: Bắt lỗi mảng chuỗi không đủ chỗ cho null byte')

// 3.5: Code đúng hoàn toàn không bị bắt lỗi sai (False Positive)
const diagClean = analyzeCCodeDiagnostics('scanf("%d", &age); float c = 5.0f / 9.0f; if (x == 5) {}')
assert(diagClean.length === 0, 'Diagnostics: Code đúng chuẩn không sinh cảnh báo giả (No False Positive)')

// SUITE 4: KIỂM THỬ VIM ENGINE & PHÍM TẮT ĐIỀU HƯỚNG
console.log('\n--- TEST SUITE 4: KIỂM THỬ ĐỘNG CƠ VIM (MODES, KEYS, :wq) ---')

const vim = new VimEngine('int main() {\n    return 0;\n}')
assert(vim.getState().mode === 'NORMAL', 'Vim Engine: Khởi đầu ở NORMAL mode')

// Gõ i để vào INSERT mode
vim.handleKeyDown({ key: 'i' } as any)
assert(vim.getState().mode === 'INSERT', 'Vim Engine: Bấm i chuyển sang INSERT mode')

// Gõ ký tự trong INSERT mode
vim.handleKeyDown({ key: 'x' } as any)
assert(vim.getText().startsWith('xint main()'), 'Vim Engine: Gõ phím chèn ký tự chuẩn xác')

// Bấm Escape về NORMAL mode
vim.handleKeyDown({ key: 'Escape' } as any)
assert(vim.getState().mode === 'NORMAL', 'Vim Engine: Bấm Esc trở về NORMAL mode')

// Test lệnh :set nu
const nuCmd = vim.executeCommand(':set nu')
assert(nuCmd.success, 'Vim Engine: Lệnh :set nu thành công')

// Test lệnh cứu hộ :w và :wq
let saved = false
vim.setCallbacks((_content) => { saved = true }, () => {})
const saveCmd = vim.executeCommand(':wq')
// SUITE 5: KIỂM THỬ BẮT LỖI CÚ PHÁP C (C SYNTAX VALIDATION & GCC COMPILER ERROR REJECTION)
console.log('\n--- TEST SUITE 5: BẮT LỖI CÚ PHÁP C & TỪ CHỐI CHẠY CODE SAI CÚ PHÁP ---')

// 5.1: Tham số rỗng trong hàm / dấu phẩy thừa (như scaffolding scanf("%d", );)
const syn1 = runCCode('int main() { scanf("%d", ); return 0; }')
assert(
  syn1.exitCode !== 0 && syn1.stderr.includes('expected expression before ‘)’ token'),
  'Syntax Error 1: Chặn tham số rỗng / dấu phẩy thừa trong hàm (expected expression before ‘)’ token)'
)

// 5.2: Thiếu dấu chấm phẩy ; kết thúc câu lệnh
const syn2 = runCCode('int main() {\n    int age = 0\n    printf("%d", age);\n    return 0;\n}')
assert(
  syn2.exitCode !== 0 && syn2.stderr.includes('expected ‘;’ before'),
  'Syntax Error 2: Chặn thiếu dấu chấm phẩy ; (expected ‘;’ before ...)'
)

// 5.3: Sử dụng biến chưa khai báo kiểu dữ liệu (Undeclared variable)
const syn3 = runCCode('int main() {\n    total = 100;\n    return 0;\n}')
assert(
  syn3.exitCode !== 0 && syn3.stderr.includes('undeclared'),
  'Syntax Error 3: Chặn dùng biến chưa khai báo kiểu trong C (‘total’ undeclared)'
)

// 5.4: Biểu thức dang dở chưa hoàn thành (Incomplete expression)
const syn4 = runCCode('int main() {\n    int age = ;\n    return 0;\n}')
assert(
  syn4.exitCode !== 0 && syn4.stderr.includes('expected expression before ‘;’ token'),
  'Syntax Error 4: Chặn biểu thức dang dở (int age = ;)'
)

// 5.5: Mở ngoặc nhọn { mà không đóng ngoặc }
const syn5 = runCCode('int main() {\n    printf("Test");\n')
assert(
  syn5.exitCode !== 0 && syn5.stderr.includes('expected ‘}’ at end of input'),
  'Syntax Error 5: Chặn thiếu ngoặc nhọn đóng } (expected ‘}’ at end of input)'
)

// 5.6: Khai báo kiểu dữ liệu không tồn tại trong C
const syn6 = runCCode('int main() {\n    unknowntype x;\n    return 0;\n}')
assert(
  syn6.exitCode !== 0 && syn6.stderr.includes('unknown type name'),
  'Syntax Error 6: Chặn kiểu dữ liệu không xác định (unknown type name)'
)

// 5.7: Đảm bảo code sai cú pháp KHÔNG BAO GIỜ sinh stdout hợp lệ
assert(
  syn1.stdout === '' && syn2.stdout === '' && syn3.stdout === '',
  'Syntax Error 7: Code sai cú pháp TUYỆT ĐỐI KHÔNG CHẠY và không sinh stdout'
)

// BÁO CÁO KẾT QUẢ TỔNG THỂ
console.log('\n====================================================')
console.log(`🏁 TỔNG KẾT KIỂM THỬ: ${passedTests} PASSED, ${failedTests} FAILED`)
console.log('====================================================')

if (failedTests > 0) {
  process.exit(1)
} else {
  console.log('✨ TẤT CẢ TÍNH NĂNG & EDGE CASES ĐỀU HOẠT ĐỘNG HOÀN HẢO!\n')
}
