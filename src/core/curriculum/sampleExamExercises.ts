import { LabExercise } from '../../types/curriculum'

export const SAMPLE_EXAM_EXERCISES: LabExercise[] = [
  // --- MỨC 1 ---
  {
    id: 'exam_c_01',
    number: 101,
    title: 'Tìm Số Lớn Nhất Trong 3 Số',
    topic: 'Cú pháp cơ bản & Điều kiện',
    difficulty: 'Căn bản',
    level: 1,
    description: 'Nhập vào 3 số nguyên a, b, c từ bàn phím (cách nhau bởi khoảng trắng). In ra màn hình số lớn nhất.',
    theoryExplanation: 'Sử dụng scanf("%d %d %d", &a, &b, &c) và cấu trúc if-else để tìm giá trị cực đại max.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int a, b, c;
    if (scanf("%d %d %d", &a, &b, &c) != 3) return 1;
    
    int max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    
    printf("Max: %d\\n", max);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int a, b, c;
    if (scanf("%d %d %d", &a, &b, &c) != 3) return 1;
    
    int max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    
    printf("Max: %d\\n", max);
    return 0;
}
`,
    defaultFileName: 'max_of_three.c',
    testCases: [
      { id: 'tc1', input: '10 25 7', expectedOutput: 'Max: 25' },
      { id: 'tc2', input: '-5 -1 -20', expectedOutput: 'Max: -1' },
      { id: 'tc3', input: '100 100 100', expectedOutput: 'Max: 100' },
    ],
    hints: ['Khởi tạo max = a, sau đó lần lượt so sánh max với b và c.'],
    pitfalls: ['Quên truyền địa chỉ & cho scanf.'],
  },
  {
    id: 'exam_c_02',
    number: 102,
    title: 'Chuyển Đổi Độ Celsius Sang Fahrenheit',
    topic: 'Kiểu dữ liệu số thực & Ép kiểu',
    difficulty: 'Căn bản',
    level: 1,
    description: 'Nhập nhiệt độ C (số thực float). Chuyển sang độ F theo công thức: F = C * 9/5 + 32. In kết quả với chính xác 2 chữ số thập phân.',
    theoryExplanation: 'Cạm bẫy chia số nguyên: trong C, 9/5 sẽ bằng 1 (phép chia nguyên). Phải viết 9.0 / 5.0 để đảm bảo tính toán số thực.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    float c;
    if (scanf("%f", &c) != 1) return 1;
    
    /* TODO: Tính F và in định dạng %.2f */
    float f = c * 9.0 / 5.0 + 32.0;
    printf("%.2f\\n", f);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    float c;
    if (scanf("%f", &c) != 1) return 1;
    float f = c * 9.0 / 5.0 + 32.0;
    printf("%.2f\\n", f);
    return 0;
}
`,
    defaultFileName: 'temp_convert.c',
    testCases: [
      { id: 'tc1', input: '100', expectedOutput: '212.00' },
      { id: 'tc2', input: '0', expectedOutput: '32.00' },
      { id: 'tc3', input: '-40', expectedOutput: '-40.00' },
    ],
    hints: ['Luôn dùng 9.0 / 5.0 thay vì 9 / 5.'],
    pitfalls: ['Dùng phép chia 9/5 sẽ bị mất phần thập phân (ra kết quả sai).'],
  },
  {
    id: 'exam_c_03',
    number: 103,
    title: 'Tính Tổng Các Số Chẵn Từ 1 Đến N',
    topic: 'Vòng lặp & Toán tử số học',
    difficulty: 'Căn bản',
    level: 1,
    description: 'Nhập số nguyên dương N. Tính tổng tất cả các số chẵn trong đoạn [1, N]. In tổng ra màn hình.',
    theoryExplanation: 'Sử dụng vòng lặp for từ 2 đến N với bước nhảy 2 hoặc dùng phép chia dư i % 2 == 0.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    
    long long sum = 0;
    for (int i = 2; i <= n; i += 2) {
        sum += i;
    }
    
    printf("Tong: %lld\\n", sum);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    long long sum = 0;
    for (int i = 2; i <= n; i += 2) {
        sum += i;
    }
    printf("Tong: %lld\\n", sum);
    return 0;
}
`,
    defaultFileName: 'sum_even.c',
    testCases: [
      { id: 'tc1', input: '10', expectedOutput: 'Tong: 30' },
      { id: 'tc2', input: '5', expectedOutput: 'Tong: 6' },
      { id: 'tc3', input: '1', expectedOutput: 'Tong: 0' },
    ],
    hints: ['Bước nhảy i += 2 chạy nhanh gấp đôi kiểm tra i % 2 == 0.'],
    pitfalls: ['Chú ý trường hợp N < 2 kết quả là 0.'],
  },

  // --- MỨC 2 ---
  {
    id: 'exam_c_04',
    number: 104,
    title: 'Kiểm Tra Số Nguyên Tố',
    topic: 'Thuật toán số học & Tối ưu vòng lặp',
    difficulty: 'Căn bản',
    level: 2,
    description: 'Nhập số nguyên N. Nếu N là số nguyên tố in "YES", ngược lại in "NO".',
    theoryExplanation: 'Số nguyên tố là số nguyên > 1 chỉ chia hết cho 1 và chính nó. Chỉ cần kiểm tra các ước từ 2 đến căn bậc hai của N (i * i <= N).',
    scaffoldingCode: `#include <stdio.h>

int is_prime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    }
    return 1;
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    
    if (is_prime(n)) printf("YES\\n");
    else printf("NO\\n");
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int is_prime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    }
    return 1;
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    if (is_prime(n)) printf("YES\\n");
    else printf("NO\\n");
    return 0;
}
`,
    defaultFileName: 'prime_check.c',
    testCases: [
      { id: 'tc1', input: '29', expectedOutput: 'YES' },
      { id: 'tc2', input: '1', expectedOutput: 'NO' },
      { id: 'tc3', input: '100', expectedOutput: 'NO' },
      { id: 'tc4', input: '2', expectedOutput: 'YES' },
    ],
    hints: ['Số 0 và 1 không phải là số nguyên tố.'],
    pitfalls: ['Quên chặn biên n <= 1.'],
  },
  {
    id: 'exam_c_05',
    number: 105,
    title: 'Ước Chung Lớn Nhất (Thuật Toán Euclid)',
    topic: 'Thuật toán Euclid & Đệ quy/Lặp',
    difficulty: 'Căn bản',
    level: 2,
    description: 'Nhập 2 số nguyên dương a và b. Tìm và in ra ước chung lớn nhất (UCLN / GCD) của hai số.',
    theoryExplanation: 'Thuật toán Euclid: gcd(a, b) = gcd(b, a % b). Khi b == 0 thì gcd = a.',
    scaffoldingCode: `#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    printf("GCD: %d\\n", gcd(a, b));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    printf("GCD: %d\\n", gcd(a, b));
    return 0;
}
`,
    defaultFileName: 'euclid_gcd.c',
    testCases: [
      { id: 'tc1', input: '48 18', expectedOutput: 'GCD: 6' },
      { id: 'tc2', input: '101 103', expectedOutput: 'GCD: 1' },
      { id: 'tc3', input: '54 24', expectedOutput: 'GCD: 6' },
    ],
    hints: ['Dùng phép chia dư % để rút ngắn số bước lặp từ O(min(a,b)) xuống O(log(min(a,b))).'],
    pitfalls: ['Không xử lý phép chia cho 0.'],
  },
  {
    id: 'exam_c_06',
    number: 106,
    title: 'Đảo Ngược Chữ Số Của Số Nguyên',
    topic: 'Xử lý toán học & Vòng lặp',
    difficulty: 'Căn bản',
    level: 2,
    description: 'Nhập số nguyên dương N. In ra số đảo ngược của N (ví dụ: nhập 12345 in ra 54321).',
    theoryExplanation: 'Lấy chữ số cuối bằng n % 10, dồn vào kết quả: rev = rev * 10 + digit, sau đó giảm n /= 10.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    
    printf("%d\\n", rev);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    printf("%d\\n", rev);
    return 0;
}
`,
    defaultFileName: 'reverse_digits.c',
    testCases: [
      { id: 'tc1', input: '12345', expectedOutput: '54321' },
      { id: 'tc2', input: '900', expectedOutput: '9' },
      { id: 'tc3', input: '7', expectedOutput: '7' },
    ],
    hints: ['Khởi tạo rev = 0 và nhân 10 sau mỗi bước.'],
    pitfalls: ['Số có đuôi 0 như 900 đảo ngược sẽ thành 9.'],
  },

  // --- MỨC 3 ---
  {
    id: 'exam_c_07',
    number: 107,
    title: 'Kiểm Tra Lũy Thừa Của 2 Bằng Bitwise Trick',
    topic: 'Toán tử Bitwise (&) & Bit Hacks',
    difficulty: 'Trung bình',
    level: 3,
    description: 'Nhập số nguyên dương N. Kiểm tra xem N có phải là lũy thừa của 2 (2^k) hay không bằng toán tử Bitwise (&). Nếu đúng in "YES", sai in "NO".',
    theoryExplanation: 'Một số là lũy thừa của 2 ở dạng nhị phân chỉ có duy nhất 1 bit 1 (ví dụ 8 là 1000). Khi lấy n - 1 (thành 0111), phép toán n & (n - 1) sẽ triệt tiêu bit 1 đó và luôn bằng 0. Công thức O(1): (n > 0) && ((n & (n - 1)) == 0).',
    scaffoldingCode: `#include <stdio.h>

int is_power_of_two(int n) {
    /* TODO: Dùng phép toán Bitwise O(1) */
    return (n > 0) && ((n & (n - 1)) == 0);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    
    if (is_power_of_two(n)) printf("YES\\n");
    else printf("NO\\n");
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int is_power_of_two(int n) {
    return (n > 0) && ((n & (n - 1)) == 0);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    if (is_power_of_two(n)) printf("YES\\n");
    else printf("NO\\n");
    return 0;
}
`,
    defaultFileName: 'power_of_two.c',
    testCases: [
      { id: 'tc1', input: '64', expectedOutput: 'YES' },
      { id: 'tc2', input: '14', expectedOutput: 'NO' },
      { id: 'tc3', input: '1', expectedOutput: 'YES' },
      { id: 'tc4', input: '0', expectedOutput: 'NO' },
    ],
    hints: ['n & (n - 1) xóa bit 1 thấp nhất.'],
    pitfalls: ['Quên kiểm tra điều kiện n > 0 (với n = 0 thì 0 & -1 = 0 nhưng không phải lũy thừa của 2).'],
  },
  {
    id: 'exam_c_08',
    number: 108,
    title: 'Bật Và Tắt Bit Thứ K',
    topic: 'Thao tác Bitwise dịch bit (<<, |, &)',
    difficulty: 'Trung bình',
    level: 3,
    description: 'Nhập số nguyên n và vị trí bit k (0-indexed). Hãy thực hiện: 1. Bật bit thứ k (Set bit); 2. Tắt bit thứ k (Clear bit). In ra 2 giá trị này cách nhau bằng dấu cách.',
    theoryExplanation: 'Set bit: n | (1 << k). Clear bit: n & ~(1 << k).',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int n, k;
    if (scanf("%d %d", &n, &k) != 2) return 1;
    
    int set_val = n | (1 << k);
    int clear_val = n & ~(1 << k);
    
    printf("%d %d\\n", set_val, clear_val);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int n, k;
    if (scanf("%d %d", &n, &k) != 2) return 1;
    int set_val = n | (1 << k);
    int clear_val = n & ~(1 << k);
    printf("%d %d\\n", set_val, clear_val);
    return 0;
}
`,
    defaultFileName: 'bit_manipulate.c',
    testCases: [
      { id: 'tc1', input: '5 1', expectedOutput: '7 5' },
      { id: 'tc2', input: '8 3', expectedOutput: '8 0' },
      { id: 'tc3', input: '0 4', expectedOutput: '16 0' },
    ],
    hints: ['Toán tử phủ định bit là dấu ngã ~.'],
    pitfalls: ['Nhầm lẫn giữa toán tử logic ! và bitwise ~.'],
  },
  {
    id: 'exam_c_09',
    number: 109,
    title: 'Hoán Đổi 2 Số Bằng XOR Không Dùng Biến Phụ',
    topic: 'Toán tử XOR (^) & Tối ưu thanh ghi',
    difficulty: 'Trung bình',
    level: 3,
    description: 'Nhập 2 số nguyên a và b. Hãy hoán đổi giá trị của a và b bằng toán tử XOR (^), tuyệt đối KHÔNG khai báo thêm bất kỳ biến phụ nào. In ra giá trị a b sau khi hoán đổi.',
    theoryExplanation: 'Tính chất XOR: x ^ x = 0 và x ^ 0 = x. Chuỗi 3 phép toán: a = a ^ b; b = a ^ b; a = a ^ b.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    
    /* TODO: Hoán đổi chỉ dùng a và b với toán tử ^ */
    a ^= b;
    b ^= a;
    a ^= b;
    
    printf("%d %d\\n", a, b);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    a ^= b;
    b ^= a;
    a ^= b;
    printf("%d %d\\n", a, b);
    return 0;
}
`,
    defaultFileName: 'xor_swap.c',
    testCases: [
      { id: 'tc1', input: '15 28', expectedOutput: '28 15' },
      { id: 'tc2', input: '-5 99', expectedOutput: '99 -5' },
    ],
    hints: ['3 dòng mã thần thánh: a ^= b; b ^= a; a ^= b;'],
    pitfalls: ['Không áp dụng khi a và b cùng trỏ tới 1 ô nhớ (aliasing sẽ làm giá trị thành 0).'],
  },

  // --- MỨC 4 ---
  {
    id: 'exam_c_10',
    number: 110,
    title: 'Đếm Số Lượng Bit 1 (Hamming Weight - Kernighan)',
    topic: 'Thuật toán Brian Kernighan & Bit Counting',
    difficulty: 'Nâng cao',
    level: 4,
    description: 'Nhập số nguyên không âm N. Đếm số lượng bit có giá trị 1 trong biểu diễn nhị phân của N bằng thuật toán tối ưu Brian Kernighan.',
    theoryExplanation: 'Mỗi phép toán n = n & (n - 1) sẽ triệt tiêu bit 1 cuối cùng. Số vòng lặp chỉ bằng đúng số lượng bit 1 có trong n (thay vì phải duyệt cả 32 bit).',
    scaffoldingCode: `#include <stdio.h>

int count_set_bits(unsigned int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}

int main() {
    unsigned int n;
    if (scanf("%u", &n) != 1) return 1;
    printf("Bits: %d\\n", count_set_bits(n));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int count_set_bits(unsigned int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}

int main() {
    unsigned int n;
    if (scanf("%u", &n) != 1) return 1;
    printf("Bits: %d\\n", count_set_bits(n));
    return 0;
}
`,
    defaultFileName: 'popcount_kernighan.c',
    testCases: [
      { id: 'tc1', input: '29', expectedOutput: 'Bits: 4' },
      { id: 'tc2', input: '0', expectedOutput: 'Bits: 0' },
      { id: 'tc3', input: '255', expectedOutput: 'Bits: 8' },
    ],
    hints: ['Thuật toán kết thúc ngay khi n về 0.'],
    pitfalls: ['Dùng biến signed int có thể gặp rắc rối với bit dấu âm khi dịch bit.'],
  },
  {
    id: 'exam_c_11',
    number: 111,
    title: 'Tìm Số Xuất Hiện 1 Lần Trong Mảng (Single Number)',
    topic: 'Thuật toán XOR Reduction & Mảng',
    difficulty: 'Nâng cao',
    level: 4,
    description: 'Cho mảng n số nguyên, trong đó mọi phần tử đều xuất hiện 2 lần ngoại trừ đúng 1 phần tử chỉ xuất hiện 1 lần. Tìm phần tử độc nhất đó với độ phức tạp thời gian O(n) và bộ nhớ O(1). Dòng 1: n; Dòng 2: n số nguyên.',
    theoryExplanation: 'Do x ^ x = 0 và x ^ 0 = x, khi XOR tất cả các phần tử trong mảng lại với nhau, các cặp trùng nhau sẽ tự triệt tiêu thành 0, chỉ còn lại duy nhất số xuất hiện 1 lần.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    
    int result = 0;
    for (int i = 0; i < n; i++) {
        int val;
        scanf("%d", &val);
        result ^= val;
    }
    
    printf("Single: %d\\n", result);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    int result = 0;
    for (int i = 0; i < n; i++) {
        int val;
        scanf("%d", &val);
        result ^= val;
    }
    printf("Single: %d\\n", result);
    return 0;
}
`,
    defaultFileName: 'single_number.c',
    testCases: [
      { id: 'tc1', input: '7\\n2 3 5 4 5 3 2', expectedOutput: 'Single: 4' },
      { id: 'tc2', input: '5\\n10 20 10 30 20', expectedOutput: 'Single: 30' },
    ],
    hints: ['Khởi tạo biến tích lũy bằng 0 và XOR liên tục.'],
    pitfalls: ['Dùng mảng đánh dấu hoặc nested loop sẽ bị vượt giới hạn thời gian.'],
  },
  {
    id: 'exam_c_12',
    number: 112,
    title: 'Đảo Ngược Mảng Bằng Hai Con Trỏ (Pointer Arithmetic)',
    topic: 'Số học con trỏ & Thao tác bộ nhớ mảng',
    difficulty: 'Nâng cao',
    level: 4,
    description: 'Nhập số phần tử n và mảng n số nguyên. Đảo ngược mảng bằng kỹ thuật 2 con trỏ trỏ tới đầu và cuối mảng (*left và *right). In ra mảng sau khi đảo ngược.',
    theoryExplanation: 'Hai con trỏ: int *left = arr; int *right = arr + n - 1; Vòng lặp while (left < right): hoán đổi *left và *right, sau đó left++, right--.',
    scaffoldingCode: `#include <stdio.h>

void reverse_array(int *arr, int n) {
    int *left = arr;
    int *right = arr + n - 1;
    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;
        left++;
        right--;
    }
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    
    reverse_array(arr, n);
    
    for (int i = 0; i < n; i++) {
        printf("%d%c", arr[i], (i == n - 1) ? '\\n' : ' ');
    }
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

void reverse_array(int *arr, int n) {
    int *left = arr;
    int *right = arr + n - 1;
    while (left < right) {
        int temp = *left;
        *left = *right;
        *right = temp;
        left++;
        right--;
    }
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    reverse_array(arr, n);
    for (int i = 0; i < n; i++) {
        printf("%d%c", arr[i], (i == n - 1) ? '\\n' : ' ');
    }
    return 0;
}
`,
    defaultFileName: 'reverse_array_ptr.c',
    testCases: [
      { id: 'tc1', input: '5\\n1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
      { id: 'tc2', input: '4\\n10 20 30 40', expectedOutput: '40 30 20 10' },
    ],
    hints: ['Con trỏ right trỏ tới arr + n - 1.'],
    pitfalls: ['Trỏ quá vùng nhớ (Buffer Overflow) nếu right = arr + n.'],
  },

  // --- MỨC 5 ---
  {
    id: 'exam_c_13',
    number: 113,
    title: 'Đóng Gói Và Giải Nén Màu RGBA (Bit Packing)',
    topic: 'Hệ thống, Bit Packing & Thanh ghi nhị phân',
    difficulty: 'Chuyên sâu',
    level: 5,
    description: 'Nhập 4 giá trị unsigned char: R, G, B, A (0-255). Hãy đóng gói chúng vào 1 biến unsigned int 32-bit theo thứ tự [R: bits 24..31, G: bits 16..23, B: bits 8..15, A: bits 0..7]. In ra mã Hex định dạng in hoa 0x%08X.',
    theoryExplanation: 'Bit packing: (r << 24) | (g << 16) | (b << 8) | a. Đây là kỹ thuật cốt lõi trong đồ họa máy tính và driver Linux framebuffer.',
    scaffoldingCode: `#include <stdio.h>

int main() {
    unsigned int r, g, b, a;
    if (scanf("%u %u %u %u", &r, &g, &b, &a) != 4) return 1;
    
    unsigned int packed = (r << 24) | (g << 16) | (b << 8) | a;
    printf("0x%08X\\n", packed);
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

int main() {
    unsigned int r, g, b, a;
    if (scanf("%u %u %u %u", &r, &g, &b, &a) != 4) return 1;
    unsigned int packed = (r << 24) | (g << 16) | (b << 8) | a;
    printf("0x%08X\\n", packed);
    return 0;
}
`,
    defaultFileName: 'rgba_packing.c',
    testCases: [
      { id: 'tc1', input: '255 128 64 255', expectedOutput: '0xFF8040FF' },
      { id: 'tc2', input: '0 0 0 0', expectedOutput: '0x00000000' },
      { id: 'tc3', input: '18 52 86 120', expectedOutput: '0x12345678' },
    ],
    hints: ['Định dạng in hoa 8 chữ số Hex là 0x%08X.'],
    pitfalls: ['Coi chừng ép kiểu sang unsigned int trước khi dịch quá 16 bit.'],
  },
  {
    id: 'exam_c_14',
    number: 114,
    title: 'Đảo Ngược Thứ Tự Bit Của Byte 8-Bit',
    topic: 'Bit Reversal Algorithm & Embedded Systems',
    difficulty: 'Chuyên sâu',
    level: 5,
    description: 'Nhập số nguyên byte (0-255). Hãy đảo ngược hoàn toàn thứ tự các bit của byte đó (bit 7 sang bit 0, bit 6 sang bit 1, ...). In ra số nguyên kết quả.',
    theoryExplanation: 'Dùng phép dịch bit hoặc kỹ thuật chia để trị SWAP nibble, pair, odd-even bit.',
    scaffoldingCode: `#include <stdio.h>

unsigned char reverse_byte(unsigned char b) {
    b = ((b & 0xF0) >> 4) | ((b & 0x0F) << 4);
    b = ((b & 0xCC) >> 2) | ((b & 0x33) << 2);
    b = ((b & 0xAA) >> 1) | ((b & 0x55) << 1);
    return b;
}

int main() {
    unsigned int val;
    if (scanf("%u", &val) != 1) return 1;
    printf("%u\\n", (unsigned int)reverse_byte((unsigned char)val));
    return 0;
}
`,
    solutionCode: `#include <stdio.h>

unsigned char reverse_byte(unsigned char b) {
    b = ((b & 0xF0) >> 4) | ((b & 0x0F) << 4);
    b = ((b & 0xCC) >> 2) | ((b & 0x33) << 2);
    b = ((b & 0xAA) >> 1) | ((b & 0x55) << 1);
    return b;
}

int main() {
    unsigned int val;
    if (scanf("%u", &val) != 1) return 1;
    printf("%u\\n", (unsigned int)reverse_byte((unsigned char)val));
    return 0;
}
`,
    defaultFileName: 'reverse_byte_bits.c',
    testCases: [
      { id: 'tc1', input: '177', expectedOutput: '141' },
      { id: 'tc2', input: '1', expectedOutput: '128' },
      { id: 'tc3', input: '255', expectedOutput: '255' },
    ],
    hints: ['177 nhị phân là 10110001, đảo ngược là 10001101 = 141.'],
    pitfalls: ['Không áp dụng đúng mặt nạ bitmask khi swap cặp bit.'],
  },
  {
    id: 'exam_c_15',
    number: 115,
    title: 'Kiểm Tra Tràn Số Cộng 32-Bit (Signed Overflow Detection)',
    topic: 'An toàn hệ thống, Hai số bù 2 & Tràn số nguyên',
    difficulty: 'Chuyên sâu',
    level: 5,
    description: 'Nhập 2 số nguyên 32-bit có dấu a và b (int). Hãy kiểm tra xem phép cộng a + b có gây tràn số (Integer Overflow) hay không TRƯỚC KHI thực hiện phép cộng, tránh gây Undefined Behavior. Nếu tràn in "OVERFLOW", nếu an toàn in "OK: %d" (tổng).',
    theoryExplanation: 'Trong C, phép cộng gây tràn số có dấu là Undefined Behavior (UB). Do đó ta phải kiểm tra điều kiện an toàn: Nếu a > 0 và b > INT_MAX - a, hoặc a < 0 và b < INT_MIN - a thì tràn số.',
    scaffoldingCode: `#include <stdio.h>
#include <limits.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    
    if ((a > 0 && b > INT_MAX - a) || (a < 0 && b < INT_MIN - a)) {
        printf("OVERFLOW\\n");
    } else {
        printf("OK: %d\\n", a + b);
    }
    return 0;
}
`,
    solutionCode: `#include <stdio.h>
#include <limits.h>

int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) return 1;
    if ((a > 0 && b > INT_MAX - a) || (a < 0 && b < INT_MIN - a)) {
        printf("OVERFLOW\\n");
    } else {
        printf("OK: %d\\n", a + b);
    }
    return 0;
}
`,
    defaultFileName: 'check_overflow.c',
    testCases: [
      { id: 'tc1', input: '2147483647 1', expectedOutput: 'OVERFLOW' },
      { id: 'tc2', input: '-2147483648 -1', expectedOutput: 'OVERFLOW' },
      { id: 'tc3', input: '100000 200000', expectedOutput: 'OK: 300000' },
    ],
    hints: ['Sử dụng hằng số INT_MAX và INT_MIN từ thư viện <limits.h>.'],
    pitfalls: ['Không được cộng trước rồi mới so sánh (vì UB trong C cho phép trình biên dịch tối ưu hóa bỏ qua so sánh).'],
  },
]
