import { FSTree, FSNode } from '../../types/vfs'

export const DEFAULT_ROOT_ID = 'root'
export const DEFAULT_HOME_ID = 'home'
export const DEFAULT_STUDENT_ID = 'student'
export const DEFAULT_LAB2_ID = 'lab2'

export const INITIAL_FS: FSTree = {
  [DEFAULT_ROOT_ID]: {
    id: DEFAULT_ROOT_ID,
    name: '',
    type: 'dir',
    parentId: null,
    children: [DEFAULT_HOME_ID, 'etc', 'bin'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'etc': {
    id: 'etc',
    name: 'etc',
    type: 'dir',
    parentId: DEFAULT_ROOT_ID,
    children: ['passwd_file'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'passwd_file': {
    id: 'passwd_file',
    name: 'passwd',
    type: 'file',
    content: 'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash',
    parentId: 'etc',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'bin': {
    id: 'bin',
    name: 'bin',
    type: 'dir',
    parentId: DEFAULT_ROOT_ID,
    children: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  [DEFAULT_HOME_ID]: {
    id: DEFAULT_HOME_ID,
    name: 'home',
    type: 'dir',
    parentId: DEFAULT_ROOT_ID,
    children: [DEFAULT_STUDENT_ID],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  [DEFAULT_STUDENT_ID]: {
    id: DEFAULT_STUDENT_ID,
    name: 'student',
    type: 'dir',
    parentId: DEFAULT_HOME_ID,
    children: [DEFAULT_LAB2_ID, 'readme_file'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'readme_file': {
    id: 'readme_file',
    name: 'README.txt',
    type: 'file',
    content: `=== CHÀO MỪNG BẠN ĐẾN VỚI SYSLearn STUDIO ===
Môi trường thực hành Lập trình Hệ thống (LTHT) trực tiếp trên trình duyệt.
* Thư mục bài tập: /home/student/lab2
* Lệnh biên dịch C: gcc <file.c> -o <ten_chuong_trinh>
* Chạy chương trình: ./<ten_chuong_trinh>
* Soạn thảo code: vim <file.c>
Gõ 'help' trong terminal để xem danh sách lệnh!`,
    parentId: DEFAULT_STUDENT_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  [DEFAULT_LAB2_ID]: {
    id: DEFAULT_LAB2_ID,
    name: 'lab2',
    type: 'dir',
    parentId: DEFAULT_STUDENT_ID,
    children: [
      'f_bai01',
      'f_bai02',
      'f_bai03',
      'f_bai04',
      'f_bai05',
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'f_bai01': {
    id: 'f_bai01',
    name: 'bai01_io.c',
    type: 'file',
    content: `#include <stdio.h>

int main() {
    int age = 0;
    printf("Chao mung ban den voi mon Lap Trinh He Thong!\\n");
    printf("Nhap so tuoi cua ban: ");
    scanf("%d", &age);
    printf("Ban %d tuoi. Chuc mung ban bat dau thuc hanh C!\\n", age);
    return 0;
}
`,
    parentId: DEFAULT_LAB2_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'f_bai02': {
    id: 'f_bai02',
    name: 'bai02_sizeof.c',
    type: 'file',
    content: `#include <stdio.h>

int main() {
    printf("Kich thuoc cac kieu du lieu he thong:\\n");
    printf("sizeof(char)   = %zu bytes (%zu bits)\\n", sizeof(char), sizeof(char) * 8);
    printf("sizeof(short)  = %zu bytes (%zu bits)\\n", sizeof(short), sizeof(short) * 8);
    printf("sizeof(int)    = %zu bytes (%zu bits)\\n", sizeof(int), sizeof(int) * 8);
    printf("sizeof(long)   = %zu bytes (%zu bits)\\n", sizeof(long), sizeof(long) * 8);
    printf("sizeof(float)  = %zu bytes (%zu bits)\\n", sizeof(float), sizeof(float) * 8);
    printf("sizeof(double) = %zu bytes (%zu bits)\\n", sizeof(double), sizeof(double) * 8);
    return 0;
}
`,
    parentId: DEFAULT_LAB2_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'f_bai03': {
    id: 'f_bai03',
    name: 'bai03_temp_div.c',
    type: 'file',
    content: `#include <stdio.h>

int main() {
    float fahrenheit = 100.0f;
    // Chu y: 5/9 trong C se bang 0 do phep chia so nguyen!
    float celsius = (5.0f / 9.0f) * (fahrenheit - 32.0f);
    printf("%.1f do F = %.2f do C\\n", fahrenheit, celsius);
    return 0;
}
`,
    parentId: DEFAULT_LAB2_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'f_bai04': {
    id: 'f_bai04',
    name: 'bai04_bitwise.c',
    type: 'file',
    content: `#include <stdio.h>

int main() {
    unsigned char a = 0x05; // 0000 0101
    unsigned char b = 0x09; // 0000 1001
    
    printf("a & b  = 0x%02X (%d)\\n", a & b, a & b);
    printf("a | b  = 0x%02X (%d)\\n", a | b, a | b);
    printf("a ^ b  = 0x%02X (%d)\\n", a ^ b, a ^ b);
    printf("~a     = 0x%02X (%d)\\n", (unsigned char)~a, (unsigned char)~a);
    return 0;
}
`,
    parentId: DEFAULT_LAB2_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'f_bai05': {
    id: 'f_bai05',
    name: 'bai05_shift.c',
    type: 'file',
    content: `#include <stdio.h>

int main() {
    int x = 8;
    printf("Gia tri ban dau: %d\\n", x);
    printf("x << 2 (nhan 4): %d\\n", x << 2);
    printf("x >> 1 (chia 2): %d\\n", x >> 1);
    return 0;
}
`,
    parentId: DEFAULT_LAB2_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
}
