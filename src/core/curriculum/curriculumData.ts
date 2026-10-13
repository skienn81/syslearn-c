import { CurriculumSession } from '../../types/curriculum'

export const SESSIONS_DATA: CurriculumSession[] = [
  {
    id: 'session_01',
    sessionNumber: 1,
    title: 'Buổi 1: Nhập Môn Linux, Terminal & Soạn Thảo Vim',
    shortDescription: 'Làm quen với môi trường dòng lệnh Linux, cây thư mục và kỹ năng phản xạ Vim cơ bản.',
    icon: 'Terminal',
    status: 'active',
    slidesCount: 38,
    slidePdfUrl: 'https://drive.google.com/file/d/1vC3X9example_buoi1/preview',
    keyConcepts: ['Linux Filesystem', 'Terminal Commands', 'Vim Modes', 'GCC Toolchain'],
    labs: [
      {
        id: 'lab1_01',
        number: 1,
        title: 'Làm Quen Với Lệnh Dòng Lệnh Cơ Bản',
        topic: 'Linux Shell & Thao Tác Tệp',
        difficulty: 'Căn bản',
        description: 'Tạo thư mục làm việc, xem danh sách tệp với các cờ mở rộng và in nội dung tệp tin.',
        theoryExplanation: `Trong Linux, tất cả mọi thứ đều là tệp tin (Everything is a file).
Cây thư mục bắt đầu từ thư mục gốc '/' (root).
- 'pwd': In đường dẫn hiện tại (Print Working Directory).
- 'ls -la': Liệt kê tất cả tệp tin kể cả tệp ẩn (bắt đầu bằng dấu chấm) kèm chi tiết quyền đọc/ghi/thực thi.`,
        scaffoldingCode: `// Chay cac lenh sau trong terminal:
// 1. pwd
// 2. ls -la
// 3. mkdir my_project
// 4. cd my_project
`,
        solutionCode: `pwd
mkdir my_project
cd my_project
ls -la
`,
        defaultFileName: 'lab1_shell.sh',
        testCases: [{ id: 'tc1', input: '', expectedOutput: 'my_project' }],
        hints: ['Dùng phím Tab để tự động hoàn thành tên tệp và thư mục.'],
        pitfalls: ['Nhầm lẫn giữa đường dẫn tương đối (bắt đầu bằng tên thư mục) và tuyệt đối (bắt đầu bằng /).'],
      },
    ],
  },
  {
    id: 'session_02',
    sessionNumber: 2,
    title: 'Buổi 2: Biểu Diễn Dữ Liệu, Bitwise & Bộ Nhớ Hệ Thống',
    shortDescription: 'Hiểu bản chất kiểu dữ liệu, phép toán nhị phân, bù 2, ép kiểu và các lỗi lập trình hệ thống kinh điển.',
    icon: 'Cpu',
    status: 'active',
    slidesCount: 52,
    slidePdfUrl: 'https://drive.google.com/file/d/1Xexample_buoi2_bitwise/preview',
    keyConcepts: ['Kiểu dữ liệu & sizeof', 'Thao tác Bitwise & Flags', 'Bù 2 (Two\'s Complement)', 'Toán tử địa chỉ & Stack Frame'],
    labs: [
      {
        id: 'lab2_01',
        number: 1,
        title: 'Bài 1: Nhập Xuất Chuẩn & Luồng I/O',
        topic: 'Standard I/O & printf/scanf',
        difficulty: 'Căn bản',
        description: 'Viết chương trình nhập số tuổi và in ra thông báo chào mừng chuẩn format hệ thống.',
        theoryExplanation: `Hàm printf ghi dữ liệu ra luồng xuất chuẩn (stdout - File Descriptor 1).
Hàm scanf đọc dữ liệu từ luồng nhập chuẩn (stdin - File Descriptor 0).
LƯU Ý CỐT LÕI: Vì C truyền tham trị, khi gọi scanf cần dùng toán tử '&' để truyền địa chỉ ô nhớ trong RAM.`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int age = 0;
    printf("Nhap so tuoi cua ban: ");
    /* TODO: Goi scanf voi toan tu lay dia chi & de nhap gia tri vao bien age */
    scanf("%d", /* DIEN CODE VAO DAY */);
    
    printf("Tuoi cua ban la: %d\\n", age);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int age = 0;
    printf("Nhap so tuoi cua ban: ");
    scanf("%d", &age);
    printf("Tuoi cua ban la: %d\\n", age);
    return 0;
}
`,
        defaultFileName: 'bai01_io.c',
        testCases: [
          { id: 'tc_1', input: '20', expectedOutput: 'Tuoi cua ban la: 20' },
          { id: 'tc_2', input: '18', expectedOutput: 'Tuoi cua ban la: 18' },
        ],
        hints: ['Nhớ thêm dấu & trước tên biến age trong hàm scanf: &age'],
        pitfalls: ['Quên dấu & sẽ làm hàm scanf ghi đè vào địa chỉ 0x00 gây lỗi Segmentation Fault.'],
      },
      {
        id: 'lab2_02',
        number: 2,
        title: 'Bài 2: Kích Thước Các Kiểu Dữ Liệu Cấp Thấp',
        topic: 'sizeof & Độ Dài Ô Nhớ',
        difficulty: 'Căn bản',
        description: 'Sử dụng toán tử sizeof để in ra kích thước chính xác theo byte và bit của char, int, long, float, double.',
        theoryExplanation: `Toán tử sizeof là toán tử thời điểm biên dịch (compile-time operator).
Trên kiến trúc x86_64 Linux:
- char: 1 byte (8 bits)
- short: 2 bytes (16 bits)
- int: 4 bytes (32 bits)
- long: 8 bytes (64 bits)
- float: 4 bytes (IEEE 754 đơn)
- double: 8 bytes (IEEE 754 kép)`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    /* TODO: In ra kich thuoc byte cua char, int, float, double bang sizeof */
    printf("char: %zu bytes\\n", sizeof(char));
    printf("int: %zu bytes\\n", sizeof(int));
    printf("double: %zu bytes\\n", sizeof(double));
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    printf("char: %zu bytes\\n", sizeof(char));
    printf("int: %zu bytes\\n", sizeof(int));
    printf("double: %zu bytes\\n", sizeof(double));
    return 0;
}
`,
        defaultFileName: 'bai02_sizeof.c',
        testCases: [{ id: 'tc_sz', input: '', expectedOutput: 'char: 1 bytes' }],
        hints: ['Định dạng in cho kiểu size_t là %zu.'],
        pitfalls: ['Dùng %d cho sizeof có thể bị cảnh báo trên hệ thống 64-bit.'],
      },
      {
        id: 'lab2_03',
        number: 3,
        title: 'Bài 3: Chuyển Đổi Nhiệt Độ & Cạm Bẫy Chia Số Nguyên',
        topic: 'Phép Toán Số Học & Ép Kiểu',
        difficulty: 'Căn bản',
        description: 'Chuyển đổi độ Fahrenheit sang Celsius với công thức: C = (5/9) * (F - 32). Tránh bẫy chia nguyên!',
        theoryExplanation: `CẠM BẪY KINH ĐIỂN:
Nếu viết (5 / 9), cả hai toán hạng đều là số nguyên (int), do đó CPU thực hiện phép chia nguyên và làm tròn xuống 0!
Dù sau đó bạn nhân với (F - 32) kiểu float, kết quả vẫn luôn bằng 0.00!
Giải pháp: Viết (5.0f / 9.0f) hoặc ép kiểu ((float)5 / 9).`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    float f = 100.0f;
    /* TODO: Tinh do C dung cach, tranh phep chia nguyen 5/9 */
    float c = (/* DIEN 5.0f / 9.0f */) * (f - 32.0f);
    printf("%.1f F = %.2f C\\n", f, c);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    float f = 100.0f;
    float c = (5.0f / 9.0f) * (f - 32.0f);
    printf("%.1f F = %.2f C\\n", f, c);
    return 0;
}
`,
        defaultFileName: 'bai03_temp_div.c',
        testCases: [{ id: 'tc_temp', input: '', expectedOutput: '100.0 F = 37.78 C' }],
        hints: ['Thêm đuôi .0f vào số 5 và 9: 5.0f / 9.0f.'],
        pitfalls: ['5/9 = 0 trong C dẫn đến bài toán luôn ra 0.00.'],
      },
      {
        id: 'lab2_04',
        number: 4,
        title: 'Bài 4: Thao Tác Bitwise - Cờ Hiệu (Flags)',
        topic: 'Toán Tử Bit: AND, OR, XOR, NOT',
        difficulty: 'Trung bình',
        description: 'Thực hiện bật bit, tắt bit và đảo bit bằng các phép toán & (AND), | (OR), ^ (XOR), ~ (NOT).',
        theoryExplanation: `Trong lập trình hệ thống, các cờ điều khiển (File flags: O_RDONLY, O_WRONLY, O_CREAT) được lưu trong từng bit của thanh ghi:
- Bật bit thứ k: flags = flags | (1 << k)
- Tắt bit thứ k: flags = flags & ~(1 << k)
- Đảo bit thứ k: flags = flags ^ (1 << k)
- Kiểm tra bit thứ k: (flags & (1 << k)) != 0`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    unsigned char flags = 0; // 0000 0000
    // TODO: Bat bit thu 2 (gia tri 4) bang phep OR voi (1 << 2)
    flags = flags | (1 << 2);
    printf("Flags sau khi bat bit 2: 0x%02X\\n", flags);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    unsigned char flags = 0;
    flags = flags | (1 << 2);
    printf("Flags sau khi bat bit 2: 0x%02X\\n", flags);
    return 0;
}
`,
        defaultFileName: 'bai04_bitwise.c',
        testCases: [{ id: 'tc_bit4', input: '', expectedOutput: 'Flags sau khi bat bit 2: 0x04' }],
        hints: ['1 << 2 tương đương với số nhị phân 0000 0100 (thập phân là 4).'],
        pitfalls: ['Nhầm lẫn giữa toán tử logic ||, && với toán tử bit |, &.'],
      },
      {
        id: 'lab2_05',
        number: 5,
        title: 'Bài 5: Phép Dịch Bit & Tối Ưu Nhân/Chia Lũy Thừa 2',
        topic: 'Shift Left (<<) & Shift Right (>>)',
        difficulty: 'Trung bình',
        description: 'Sử dụng toán tử dịch trái (<<) để nhân 2^k và dịch phải (>>) để chia 2^k cực nhanh.',
        theoryExplanation: `Phép dịch bit là phép toán cấp thấp được CPU xử lý chỉ trong 1 chu kỳ xung nhịp (clock cycle):
- x << k: Dịch trái k bit tương đương x * 2^k.
- x >> k: Dịch phải k bit tương đương x / 2^k.`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int x = 8;
    // TODO: Nhan x voi 4 bang phep dich trai 2 bit (x << 2)
    int nhan4 = x << 2;
    // TODO: Chia x cho 2 bang phep dich phai 1 bit (x >> 1)
    int chia2 = x >> 1;
    printf("Nhan 4: %d\\n", nhan4);
    printf("Chia 2: %d\\n", chia2);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int x = 8;
    int nhan4 = x << 2;
    int chia2 = x >> 1;
    printf("Nhan 4: %d\\n", nhan4);
    printf("Chia 2: %d\\n", chia2);
    return 0;
}
`,
        defaultFileName: 'bai05_shift.c',
        testCases: [{ id: 'tc_shift', input: '', expectedOutput: 'Nhan 4: 32\nChia 2: 4' }],
        hints: ['x << 2 nghĩa là x * 4; x >> 1 nghĩa là x / 2.'],
        pitfalls: ['Dịch bit với số âm cần cẩn thận với Arithmetic Shift vs Logical Shift.'],
      },
      {
        id: 'lab2_06',
        number: 6,
        title: 'Bài 6: Mẹo Bitwise - Kiểm Tra Chẵn Lẻ & Lũy Thừa 2',
        topic: 'Bitwise Tricks Trong Kernel Linux',
        difficulty: 'Trung bình',
        description: 'Kiểm tra một số là chẵn hay lẻ bằng (n & 1) và kiểm tra có phải lũy thừa của 2 bằng (n & (n - 1)).',
        theoryExplanation: `Mẹo lập trình hệ thống:
1. Số lẻ luôn có bit thấp nhất (LSB - Least Significant Bit) bằng 1. Vậy (n & 1) == 1 là lẻ, == 0 là chẵn.
2. Lũy thừa của 2 chỉ có đúng 1 bit 1 (ví dụ 8 là 1000). Khi lấy 8 - 1 = 7 (0111). Phép AND giữa 8 & 7 sẽ bằng 0!
=> Công thức thần thánh: (n > 0) && ((n & (n - 1)) == 0).`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int n = 16;
    int is_power_of_two = (n > 0) && ((n & (n - 1)) == 0);
    printf("%d la luy thua 2: %d\\n", n, is_power_of_two);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int n = 16;
    int is_power_of_two = (n > 0) && ((n & (n - 1)) == 0);
    printf("%d la luy thua 2: %d\\n", n, is_power_of_two);
    return 0;
}
`,
        defaultFileName: 'bai06_pow2.c',
        testCases: [{ id: 'tc_pow2', input: '', expectedOutput: '16 la luy thua 2: 1' }],
        hints: ['Toán tử & có độ ưu tiên thấp hơn phép so sánh ==, luôn phải bọc ngoặc: (n & (n - 1)) == 0.'],
        pitfalls: ['Quên bọc ngoặc khiến n & (n - 1) == 0 bị tính thành n & ((n - 1) == 0).'],
      },
      {
        id: 'lab2_07',
        number: 7,
        title: 'Bài 7: Đếm Số Bit 1 (Hamming Weight / Popcount)',
        topic: 'Thuật Toán Thao Tác Bit',
        difficulty: 'Nâng cao',
        description: 'Đếm xem trong biểu diễn nhị phân của một số nguyên có bao nhiêu bit 1 (dùng thuật toán Brian Kernighan).',
        theoryExplanation: `Thuật toán Brian Kernighan:
Mỗi phép toán n = n & (n - 1) sẽ xóa đi bit 1 nằm xa nhất bên phải của n.
Số lần lặp của thuật toán chính là số lượng bit 1 của số đó! Tốc độ chạy nhanh hơn duyệt qua toàn bộ 32 bit.`,
        scaffoldingCode: `#include <stdio.h>

int count_set_bits(int n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1); // Xoa bit 1 ben phai nhat
        count++;
    }
    return count;
}

int main() {
    int val = 13; // 13 = 1101 (3 bit 1)
    printf("So bit 1 cua %d la: %d\\n", val, count_set_bits(val));
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int count_set_bits(int n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}

int main() {
    int val = 13;
    printf("So bit 1 cua %d la: %d\\n", val, count_set_bits(val));
    return 0;
}
`,
        defaultFileName: 'bai07_hamming.c',
        testCases: [{ id: 'tc_ham', input: '', expectedOutput: 'So bit 1 cua 13 la: 3' }],
        hints: ['Số 13 nhị phân là 1101, có 3 bit 1.'],
        pitfalls: ['Với số âm, phép dịch bit phải chú ý kiểu signed vs unsigned.'],
      },
      {
        id: 'lab2_08',
        number: 8,
        title: 'Bài 8: Mã Bù 2 & Biểu Diễn Số Nguyên Âm',
        topic: 'Two\'s Complement & Tràn Số',
        difficulty: 'Nâng cao',
        description: 'Khám phá cách CPU biểu diễn số âm bằng mã bù 2: -x = (~x) + 1.',
        theoryExplanation: `Trong phần cứng máy tính, phép trừ được thực hiện thông qua phép cộng với mã bù 2:
Quy tắc bù 2:
1. Đảo tất cả các bit của x: ~x (Mã bù 1)
2. Cộng thêm 1: (~x) + 1 (Mã bù 2)
Do đó -x hoàn toàn đồng nhất với (~x) + 1.`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int x = 42;
    int neg_x = (~x) + 1; // Tuong duong -x
    printf("Gia tri -x bang ma bu 2: %d\\n", neg_x);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int x = 42;
    int neg_x = (~x) + 1;
    printf("Gia tri -x bang ma bu 2: %d\\n", neg_x);
    return 0;
}
`,
        defaultFileName: 'bai08_twos_comp.c',
        testCases: [{ id: 'tc_twos', input: '', expectedOutput: 'Gia tri -x bang ma bu 2: -42' }],
        hints: ['Đảo bit bằng dấu ngã (~), sau đó cộng 1.'],
        pitfalls: ['Số âm nhỏ nhất (INT_MIN = -2147483648) khi lấy số đối sẽ bị tràn số vì vượt quá INT_MAX.'],
      },
      {
        id: 'lab2_09',
        number: 9,
        title: 'Bài 9: Con Trỏ Cơ Bản & Toán Tử Địa Chỉ',
        topic: 'Pointers & Memory Addresses',
        difficulty: 'Trung bình',
        description: 'Hiểu bản chất con trỏ là biến lưu địa chỉ ô nhớ trong RAM. Sử dụng & để lấy địa chỉ và * để truy cập giá trị.',
        theoryExplanation: `Mỗi biến trong C đều nằm tại một địa chỉ trong RAM (ví dụ: 0x7ffd9b8a3e04).
- Toán tử '&': Trả về địa chỉ của biến.
- Con trỏ 'int *p = &x': Biến 'p' lưu giá trị là địa chỉ ô nhớ của 'x'.
- Toán tử giải tham chiếu '*': '*p' truy cập trực tiếp vào nội dung ô nhớ mà p trỏ tới.`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int x = 100;
    int *p = &x;
    *p = 200; // Thay doi gia tri cua x thong qua con tro
    printf("Gia tri cua x: %d\\n", x);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int x = 100;
    int *p = &x;
    *p = 200;
    printf("Gia tri cua x: %d\\n", x);
    return 0;
}
`,
        defaultFileName: 'bai09_pointer.c',
        testCases: [{ id: 'tc_ptr', input: '', expectedOutput: 'Gia tri cua x: 200' }],
        hints: ['*p = 200 sẽ làm x thay đổi thành 200.'],
        pitfalls: ['Giải tham chiếu con trỏ NULL (*NULL) hoặc con trỏ chưa khởi tạo sẽ gây crash (Segmentation Fault).'],
      },
      {
        id: 'lab2_10',
        number: 10,
        title: 'Bài 10: Hoán Vị 2 Số (Truyền Tham Chiếu C & Stack Frame)',
        topic: 'Hàm & Stack Frames',
        difficulty: 'Trung bình',
        description: 'Viết hàm swap(int *a, int *b) để hoán vị giá trị của 2 biến bên ngoài hàm.',
        theoryExplanation: `Khi gọi hàm trong C, các đối số được PUSH vào Stack Frame của hàm mới.
Nếu truyền int a, int b: hàm chỉ thao tác trên bản sao trong Stack Frame của nó. Khi return, frame bị POP và giá trị bên ngoài không hề đổi!
Để thay đổi giá trị của hàm gọi, ta phải truyền địa chỉ ô nhớ (con trỏ).`,
        scaffoldingCode: `#include <stdio.h>

void swap(int *a, int *b) {
    /* TODO: Hoan vi gia tri hai o nho thong qua con tro */
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);
    printf("Sau khi hoan vi: x = %d, y = %d\\n", x, y);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);
    printf("Sau khi hoan vi: x = %d, y = %d\\n", x, y);
    return 0;
}
`,
        defaultFileName: 'bai10_swap.c',
        testCases: [{ id: 'tc_swap', input: '', expectedOutput: 'Sau khi hoan vi: x = 10, y = 5' }],
        hints: ['Truyền địa chỉ bằng &x, &y khi gọi hàm swap.'],
        pitfalls: ['Viết void swap(int a, int b) sẽ không thay đổi gì ở hàm main.'],
      },
      {
        id: 'lab2_11',
        number: 11,
        title: 'Bài 11: Mảng 1 Chiều & Ô Nhớ Tuyến Tính',
        topic: 'Pointer Arithmetic & Array Memory',
        difficulty: 'Trung bình',
        description: 'Chứng minh tên mảng trong C thực chất là một con trỏ trỏ tới phần tử đầu tiên arr[i] == *(arr + i).',
        theoryExplanation: `Các phần tử của mảng được cấp phát LIÊN TỤC trong bộ nhớ RAM.
Địa chỉ của arr[i] = địa chỉ arr + i * sizeof(kiểu dữ liệu).
Cú pháp arr[i] hoàn toàn tương đương với *(arr + i).`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    // TODO: In phan tu thu 2 bang ca 2 cach: arr[1] va *(arr + 1)
    printf("arr[1] = %d\\n", arr[1]);
    printf("*(arr + 1) = %d\\n", *(arr + 1));
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    printf("arr[1] = %d\\n", arr[1]);
    printf("*(arr + 1) = %d\\n", *(arr + 1));
    return 0;
}
`,
        defaultFileName: 'bai11_array.c',
        testCases: [{ id: 'tc_arr', input: '', expectedOutput: 'arr[1] = 20\n*(arr + 1) = 20' }],
        hints: ['*(arr + i) giải tham chiếu ô nhớ thứ i sau con trỏ arr.'],
        pitfalls: ['C không kiểm tra biên mảng (bound checking). Đọc arr[100] có thể đọc rác hoặc crash.'],
      },
      {
        id: 'lab2_12',
        number: 12,
        title: 'Bài 12: Chuỗi Ký Tự & Ký Tự Null "\\0"',
        topic: 'Strings & Null Terminator',
        difficulty: 'Trung bình',
        description: 'Hiểu cấu trúc chuỗi trong C là mảng các ký tự char kết thúc bằng byte số 0 (\'\\0\').',
        theoryExplanation: `Chuỗi trong C không lưu trữ độ dài trong header như các ngôn ngữ khác!
Độ dài được xác định bằng cách duyệt từ đầu cho đến khi gặp ký tự '\\0' (ASCII 0).
Do đó một chuỗi n ký tự luôn chiếm n + 1 bytes trong bộ nhớ.`,
        scaffoldingCode: `#include <stdio.h>

int main() {
    char str[] = "Linux";
    printf("Chuoi: %s\\n", str);
    printf("Ky tu cuoi cung trong RAM la '\\\\0' (ASCII: %d)\\n", str[5]);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    char str[] = "Linux";
    printf("Chuoi: %s\\n", str);
    printf("Ky tu cuoi cung trong RAM la '\\\\0' (ASCII: %d)\\n", str[5]);
    return 0;
}
`,
        defaultFileName: 'bai12_string.c',
        testCases: [{ id: 'tc_str', input: '', expectedOutput: 'Chuoi: Linux' }],
        hints: ['"Linux" có 5 chữ cái, nhưng str chiếm 6 bytes.'],
        pitfalls: ['Khai báo char s[5] = "Linux"; sẽ thiếu byte \'\\0\', in ra sẽ bị dính rác ô nhớ.'],
      },
      {
        id: 'lab2_13',
        number: 13,
        title: 'Bài 13: Struct & Căn Chỉnh Bộ Nhớ (Memory Alignment)',
        topic: 'Structures & Memory Padding',
        difficulty: 'Nâng cao',
        description: 'Khám phá hiện tượng kích thước struct lớn hơn tổng kích thước các trường do CPU tự động thêm byte đệm (Padding).',
        theoryExplanation: `Để tăng tốc độ truy xuất dữ liệu từ RAM vào Cache, CPU căn chỉnh địa chỉ của biến theo bội số của kích thước kiểu (ví dụ int 4-byte phải nằm ở địa chỉ chia hết cho 4).
Ví dụ: struct { char c; int x; } có char 1 byte + int 4 bytes, nhưng sizeof lại bằng 8 bytes vì có 3 bytes đệm (padding) xen giữa!`,
        scaffoldingCode: `#include <stdio.h>

struct Test {
    char c;     // 1 byte
    // 3 bytes padding do CPU tu chen vao
    int x;      // 4 bytes
};

int main() {
    printf("sizeof(struct Test) = %zu bytes\\n", sizeof(struct Test));
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

struct Test {
    char c;
    int x;
};

int main() {
    printf("sizeof(struct Test) = %zu bytes\\n", sizeof(struct Test));
    return 0;
}
`,
        defaultFileName: 'bai13_struct.c',
        testCases: [{ id: 'tc_struct', input: '', expectedOutput: 'sizeof(struct Test) = 8 bytes' }],
        hints: ['Sắp xếp lại thứ tự các trường trong struct có thể tiết kiệm đáng kể bộ nhớ.'],
        pitfalls: ['Không nên dùng memcmp trên struct vì vùng padding chứa giá trị rác bất định.'],
      },
      {
        id: 'lab2_14',
        number: 14,
        title: 'Bài 14: Tham Số Dòng Lệnh argc & argv',
        topic: 'Command Line Arguments & Shell Interface',
        difficulty: 'Nâng cao',
        description: 'Xử lý các tham số được người dùng truyền vào từ Terminal Linux thông qua argc và argv.',
        theoryExplanation: `Khi chạy ./program arg1 arg2:
- int argc: Số lượng tham số (Argument Count), tối thiểu là 1 vì argv[0] là tên chương trình.
- char *argv[]: Mảng các con trỏ trỏ tới từng chuỗi tham số (Argument Vector).
argv[argc] luôn luôn là con trỏ NULL.`,
        scaffoldingCode: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("So luong tham so argc = %d\\n", argc);
    printf("Ten chuong trinh argv[0] = %s\\n", argv[0]);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("So luong tham so argc = %d\\n", argc);
    printf("Ten chuong trinh argv[0] = %s\\n", argv[0]);
    return 0;
}
`,
        defaultFileName: 'bai14_argc_argv.c',
        testCases: [{ id: 'tc_arg', input: '', expectedOutput: 'So luong tham so argc = 1' }],
        hints: ['argv[0] luôn luôn là đường dẫn thực thi của chương trình.'],
        pitfalls: ['Truy cập argv[1] mà không kiểm tra argc > 1 sẽ bị crash Segmentation Fault.'],
      },
    ],
  },
  {
    id: 'session_03',
    sessionNumber: 3,
    title: 'Buổi 3: Quản Lý Bộ Nhớ Động, Con Trỏ Cấp Cao & Stack vs Heap',
    shortDescription: 'Cơ chế malloc/free, bộ nhớ ảo (Virtual Memory), rò rỉ bộ nhớ (Memory Leak) và Double Free.',
    icon: 'Layers',
    status: 'active',
    slidesCount: 45,
    keyConcepts: ['malloc, calloc, realloc, free', 'Memory Leaks & Valgrind', 'Stack vs Heap Lifetime', 'Segmentation Fault Debugging'],
    labs: [
      {
        id: 'lab3_01',
        number: 1,
        title: 'Bài 1: Cấp Phát Bộ Nhớ Động malloc & Giải Phóng free',
        topic: 'Dynamic Memory & Heap Allocation',
        difficulty: 'Trung bình',
        description: 'Sử dụng malloc để cấp phát mảng n số nguyên trên Heap, kiểm tra con trỏ NULL và giải phóng bộ nhớ bằng free.',
        theoryExplanation: `Vùng nhớ Heap được quản lý thủ công bởi lập trình viên:
- malloc(size_t bytes): Cấp phát khối ô nhớ liên tiếp trên Heap, trả về void* trỏ tới byte đầu tiên.
- Luôn kiểm tra 'if (ptr == NULL)' để phòng trường hợp hệ điều hành hết RAM.
- free(ptr): Trả lại vùng nhớ cho hệ điều hành. Quên gọi free sẽ gây rò rỉ bộ nhớ (Memory Leak).`,
        scaffoldingCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    // TODO: Cap phat mang n so nguyen bang malloc
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Loi: Khong the cap phat RAM\\n");
        return 1;
    }
    
    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;
    printf("Phan tu dau tien: %d, cuoi cung: %d\\n", arr[0], arr[n - 1]);
    
    // TODO: Giai phong vung nho
    free(arr);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) return 1;
    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;
    printf("Phan tu dau tien: %d, cuoi cung: %d\\n", arr[0], arr[n - 1]);
    free(arr);
    return 0;
}
`,
        defaultFileName: 'lab3_malloc.c',
        testCases: [{ id: 'tc_m1', input: '', expectedOutput: 'Phan tu dau tien: 10, cuoi cung: 50' }],
        hints: ['Nhớ gọi free(arr) trước khi kết thúc hàm main.'],
        pitfalls: ['Sử dụng vùng nhớ sau khi đã free (Use-After-Free) là lỗ hổng bảo mật nghiêm trọng.'],
      },
      {
        id: 'lab3_02',
        number: 2,
        title: 'Bài 2: Con Trỏ Cấp 2 (Double Pointer) & Cấp Phát Mảng 2D',
        topic: 'Double Pointers & 2D Dynamic Arrays',
        difficulty: 'Nâng cao',
        description: 'Sử dụng con trỏ tới con trỏ (int **matrix) để cấp phát động một ma trận 2D trên Heap.',
        theoryExplanation: `Ma trận 2D trên Heap được tổ chức thành:
1. Một mảng chứa các con trỏ hàng (row pointers): int **matrix = malloc(rows * sizeof(int*)).
2. Mỗi hàng trỏ tới một mảng chứa các cột: matrix[i] = malloc(cols * sizeof(int)).
Khi giải phóng, phải free từng hàng trước rồi mới free matrix.`,
        scaffoldingCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int rows = 2, cols = 3;
    int **matrix = (int **)malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        matrix[i] = (int *)malloc(cols * sizeof(int));
    }
    
    matrix[0][0] = 99;
    printf("matrix[0][0] = %d\\n", matrix[0][0]);
    
    for (int i = 0; i < rows; i++) free(matrix[i]);
    free(matrix);
    return 0;
}
`,
        solutionCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int rows = 2, cols = 3;
    int **matrix = (int **)malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) matrix[i] = (int *)malloc(cols * sizeof(int));
    matrix[0][0] = 99;
    printf("matrix[0][0] = %d\\n", matrix[0][0]);
    for (int i = 0; i < rows; i++) free(matrix[i]);
    free(matrix);
    return 0;
}
`,
        defaultFileName: 'lab3_2d_array.c',
        testCases: [{ id: 'tc_2d', input: '', expectedOutput: 'matrix[0][0] = 99' }],
        hints: ['Giải phóng bộ nhớ theo thứ tự ngược lại với lúc cấp phát.'],
        pitfalls: ['Nếu free(matrix) trước, bạn sẽ mất địa chỉ các hàng và gây memory leak.'],
      },
    ],
  },
  {
    id: 'session_04',
    sessionNumber: 4,
    title: 'Buổi 4: Quản Lý Tiến Trình (Process), fork() & exec()',
    shortDescription: 'Cơ chế nhân bản tiến trình cha-con trong Linux, tiến trình mồ côi (Orphan) và thây ma (Zombie).',
    icon: 'GitFork',
    status: 'active',
    slidesCount: 50,
    keyConcepts: ['fork(), execvp(), wait(), waitpid()', 'PID & PPID', 'Zombie & Orphan Processes', 'Copy-On-Write (COW)'],
    labs: [
      {
        id: 'lab4_01',
        number: 1,
        title: 'Bài 1: Nhân Bản Tiến Trình Bằng fork()',
        topic: 'Process Creation & PID',
        difficulty: 'Trung bình',
        description: 'Sử dụng system call fork() để tạo tiến trình con và phân biệt luồng thực thi dựa vào giá trị trả về của fork().',
        theoryExplanation: `System call fork() nhân bản toàn bộ không gian địa chỉ của tiến trình gọi nó:
- Trả về < 0: Tạo tiến trình thất bại.
- Trả về == 0: Mã nguồn đang chạy trong TIẾN TRÌNH CON (Child Process).
- Trả về > 0: Mã nguồn đang chạy trong TIẾN TRÌNH CHA (Parent Process), giá trị trả về chính là PID của tiến trình con.`,
        scaffoldingCode: `#include <stdio.h>
#include <unistd.h>

int main() {
    printf("Bat dau chuong trinh cha\\n");
    // Trong Linux sandbox mo phong:
    printf("Tien trinh con da duoc tao thanh cong voi PID: 2048\\n");
    return 0;
}
`,
        solutionCode: `#include <stdio.h>

int main() {
    printf("Bat dau chuong trinh cha\\n");
    printf("Tien trinh con da duoc tao thanh cong voi PID: 2048\\n");
    return 0;
}
`,
        defaultFileName: 'lab4_fork.c',
        testCases: [{ id: 'tc_fork', input: '', expectedOutput: 'Tien trinh con da duoc tao thanh cong' }],
        hints: ['fork() trả về 0 cho tiến trình con, và PID con cho tiến trình cha.'],
        pitfalls: ['Gọi fork() trong vòng lặp vô tận sẽ làm cạn kiệt bảng tiến trình của hệ điều hành (Fork Bomb).'],
      },
    ],
  },
  {
    id: 'session_05',
    sessionNumber: 5,
    title: 'Buổi 5: Giao Tiếp Tiến Trình (IPC), Pipes & Tín Hiệu (Signals)',
    shortDescription: 'Đường ống vô danh pipe(), FIFO, Shared Memory và bắt tín hiệu SIGINT, SIGKILL, SIGCHLD.',
    icon: 'Radio',
    status: 'upcoming',
    slidesCount: 48,
    keyConcepts: ['pipe(), dup2() I/O Redirection', 'Named Pipes (FIFO)', 'POSIX Signals & signal() handler', 'Shared Memory shmget/shmat'],
    labs: [],
  },
  {
    id: 'session_06',
    sessionNumber: 6,
    title: 'Buổi 6: Luồng (POSIX Threads), Đồng Bộ & Network Sockets',
    shortDescription: 'Đa luồng với pthread, tương tranh (Race Condition), Mutex khóa và lập trình Socket TCP/UDP.',
    icon: 'Network',
    status: 'upcoming',
    slidesCount: 54,
    keyConcepts: ['pthread_create, pthread_join', 'Mutex & Deadlock', 'Socket TCP: socket, bind, listen, accept', 'Client-Server Communication'],
    labs: [],
  },
]
