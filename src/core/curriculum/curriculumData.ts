import { CurriculumSession } from '../../types/curriculum'

export const SESSIONS_DATA: CurriculumSession[] = [
  {
    id: "session_01",
    sessionNumber: 1,
    title: "Buổi 1: Nhập Môn Linux, Terminal & Soạn Thảo Vim",
    shortDescription: "Làm quen với môi trường dòng lệnh Linux, cây thư mục và kỹ năng phản xạ Vim cơ bản.",
    icon: "Terminal",
    status: "active",
    slidesCount: 38,
    slidePdfUrl: "https://drive.google.com/file/d/1vC3X9example_buoi1/preview",
    keyConcepts: ["Linux Filesystem", "Terminal Commands", "Vim Modes", "GCC Toolchain"],
    labs: [
      {
        id: "lab1_01",
        number: 1,
        title: "Làm Quen Với Lệnh Dòng Lệnh Cơ Bản",
        topic: "Linux Shell & Thao Tác Tệp",
        difficulty: "Căn bản",
        level: 1,
        description: "Tạo thư mục làm việc, xem danh sách tệp với các cờ mở rộng và in nội dung tệp tin.",
        theoryExplanation: "Trong Linux, tất cả mọi thứ đều là tệp tin. Các lệnh cơ bản: pwd in thư mục hiện tại, ls -la liệt kê tệp ẩn, mkdir tạo thư mục, cd di chuyển thư mục.",
        scaffoldingCode: "// Chay cac lenh sau trong terminal:\n// 1. pwd\n// 2. ls -la\n// 3. mkdir my_project\n// 4. cd my_project\n",
        solutionCode: "pwd\nmkdir my_project\ncd my_project\nls -la\n",
        defaultFileName: "lab1_shell.sh",
        testCases: [
        {
                "id": "tc1",
                "input": "",
                "expectedOutput": "my_project"
        }
],
        hints: ["Dùng phím Tab để tự động hoàn thành tên tệp và thư mục."],
        pitfalls: ["Nhầm lẫn giữa đường dẫn tương đối và tuyệt đối."],
      },
    ],
  },
  {
    id: "session_02",
    sessionNumber: 2,
    title: "Buổi 2: Lập Trình C Cơ Bản - Biến, Điều Kiện, Vòng Lặp, Mảng & Chuỗi",
    shortDescription: "Luyện tập 14 bài tập thực hành nền tảng: Biến, Bitwise, Rẽ nhánh if-else, Vòng lặp, Mảng 1 chiều và Xử lý chuỗi ký tự.",
    icon: "Cpu",
    status: "active",
    slidesCount: 52,
    slidePdfUrl: "https://drive.google.com/file/d/1Xexample_buoi2_bitwise/preview",
    keyConcepts: ["Variables & I/O", "Bitwise Operations", "Control Flow", "Array Manipulation", "String Handling"],
    labs: [
      {
        id: "lab2_01",
        number: 1,
        title: "Bài 1: Thông Tin Cá Nhân (Variables)",
        topic: "Biến & Nhập Xuất Cơ Bản",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết chương trình C để lưu trữ và hiển thị thông tin cá nhân gồm: tên (chuỗi không khoảng trắng), tuổi (số nguyên) và chiều cao (số thực cm). Nhập các thông tin này từ bàn phím và in ra theo mẫu: 'Ten: <ten>, Tuoi: <tuoi>, Chieu cao: <chieu_cao> cm' (chiều cao in 1 chữ số thập phân).",
        theoryExplanation: "Sử dụng scanf(\"%s %d %f\", name, &age, &height). Chuỗi ký tự name là mảng con trỏ không cần &, biến nguyên thủy age và height bắt buộc phải có dấu &.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Tự khai báo biến tên, tuổi, chiều cao, nhập bằng scanf và in ra bằng printf */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    char name[50];\n    int age;\n    float height;\n    if (scanf(\"%s %d %f\", name, &age, &height) != 3) return 1;\n    printf(\"Ten: %s, Tuoi: %d, Chieu cao: %.1f cm\\n\", name, age, height);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai01.c",
        testCases: [
        {
                "id": "tc1",
                "input": "NguyenVanA 20 172.5",
                "expectedOutput": "Ten: NguyenVanA, Tuoi: 20, Chieu cao: 172.5 cm"
        },
        {
                "id": "tc2",
                "input": "TranThiB 19 160.0",
                "expectedOutput": "Ten: TranThiB, Tuoi: 19, Chieu cao: 160.0 cm"
        }
],
        hints: ["Khai báo char name[50], int age, float height.", "Dùng định dạng %.1f để in 1 chữ số thập phân."],
        pitfalls: ["Quên dấu & trước biến age và height khi dùng scanf."],
      },
      {
        id: "lab2_02",
        number: 2,
        title: "Bài 2: Biểu Diễn Nhị Phân 8-Bit (Bitwise)",
        topic: "Toán Tử Bitwise & Shift",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập một số nguyên n trong khoảng từ 0 đến 255. In ra biểu diễn nhị phân của số đó dưới dạng 8 bit (từ bit 7 đến bit 0). Ví dụ: Input: 77 -> Output: 01001101.",
        theoryExplanation: "Duyệt từ bit cao về bit thấp: for (int i = 7; i >= 0; i--). Giá trị bit thứ i là (n >> i) & 1.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập số nguyên n (0-255) và dùng toán tử dịch bit (>>) cùng AND (&) để in 8 bit */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    for (int i = 7; i >= 0; i--) {\n        printf(\"%d\", (n >> i) & 1);\n    }\n    printf(\"\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab2_bai02.c",
        testCases: [
        {
                "id": "tc1",
                "input": "77",
                "expectedOutput": "01001101"
        },
        {
                "id": "tc2",
                "input": "5",
                "expectedOutput": "00000101"
        },
        {
                "id": "tc3",
                "input": "255",
                "expectedOutput": "11111111"
        }
],
        hints: ["Chạy vòng lặp từ i = 7 giảm dần về 0."],
        pitfalls: ["Nếu chạy i từ 0 đến 7 sẽ in ngược thứ tự các bit."],
      },
      {
        id: "lab2_03",
        number: 3,
        title: "Bài 3: Kiểm Tra Bit Thứ K (Bitwise)",
        topic: "Mặt Nạ Bit & Kiểm Tra Bit",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập số nguyên x và vị trí bit k cần kiểm tra (tính từ 0, bắt đầu từ bit thấp nhất). Xác định giá trị bit thứ k là 0 hay 1 và in ra theo mẫu: 'Bit <k> cua <x> la: <0|1>'. Ví dụ: x = 10, k = 1 -> 'Bit 1 cua 10 la: 1'.",
        theoryExplanation: "Sử dụng công thức mặt nạ bit: (x >> k) & 1 để trích xuất trực tiếp giá trị của bit tại vị trí k.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập x và k, tính giá trị bit thứ k và in ra kết quả */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int x, k;\n    if (scanf(\"%d %d\", &x, &k) != 2) return 1;\n    int bit = (x >> k) & 1;\n    printf(\"Bit %d cua %d la: %d\\n\", k, x, bit);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai03.c",
        testCases: [
        {
                "id": "tc1",
                "input": "10 1",
                "expectedOutput": "Bit 1 cua 10 la: 1"
        },
        {
                "id": "tc2",
                "input": "10 2",
                "expectedOutput": "Bit 2 cua 10 la: 0"
        },
        {
                "id": "tc3",
                "input": "16 4",
                "expectedOutput": "Bit 4 cua 16 la: 1"
        }
],
        hints: ["Dùng (x >> k) & 1."],
        pitfalls: ["Nhầm lẫn giữa toán tử logic && và toán tử bitwise &."],
      },
      {
        id: "lab2_04",
        number: 4,
        title: "Bài 4: Xếp Loại Học Lực (Control Structure)",
        topic: "Điều Kiện if-else if",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết chương trình nhập điểm số nguyên của sinh viên trong khoảng từ 0 đến 100. Xếp loại học lực theo quy tắc: Điểm >= 90: 'Loai A', Điểm >= 80: 'Loai B', Điểm >= 70: 'Loai C', Điểm >= 60: 'Loai D', Điểm < 60: 'Loai F'.",
        theoryExplanation: "Sử dụng chuỗi điều kiện if - else if theo thứ tự giảm dần của ngưỡng điểm.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Tự khai báo biến, nhập điểm và phân loại học lực */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int score;\n    if (scanf(\"%d\", &score) != 1) return 1;\n    if (score >= 90) printf(\"Loai A\\n\");\n    else if (score >= 80) printf(\"Loai B\\n\");\n    else if (score >= 70) printf(\"Loai C\\n\");\n    else if (score >= 60) printf(\"Loai D\\n\");\n    else printf(\"Loai F\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab2_bai04.c",
        testCases: [
        {
                "id": "tc1",
                "input": "95",
                "expectedOutput": "Loai A"
        },
        {
                "id": "tc2",
                "input": "82",
                "expectedOutput": "Loai B"
        },
        {
                "id": "tc3",
                "input": "55",
                "expectedOutput": "Loai F"
        }
],
        hints: ["Sắp xếp thứ tự kiểm tra từ 90, 80, 70, 60 xuống dưới."],
        pitfalls: ["Kiểm tra score >= 60 đầu tiên sẽ làm các điểm 90 bị xếp vào loại D."],
      },
      {
        id: "lab2_05",
        number: 5,
        title: "Bài 5: Bảng Cửu Chương Của N (Loops)",
        topic: "Vòng Lặp for",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết chương trình nhập một số nguyên n, sau đó in bảng cửu chương của n từ n x 1 đến n x 10, mỗi phép nhân trên một dòng theo định dạng: '<n> x <i> = <n*i>'.",
        theoryExplanation: "Vòng lặp for (int i = 1; i <= 10; i++) thực hiện in định dạng printf(\"%d x %d = %d\\n\", n, i, n * i).",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Tự khai báo biến, nhập n và dùng vòng lặp for để in bảng cửu chương */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    for (int i = 1; i <= 10; i++) {\n        printf(\"%d x %d = %d\\n\", n, i, n * i);\n    }\n    return 0;\n}\n",
        defaultFileName: "lab2_bai05.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5",
                "expectedOutput": "5 x 1 = 5\n5 x 2 = 10"
        },
        {
                "id": "tc2",
                "input": "7",
                "expectedOutput": "7 x 10 = 70"
        }
],
        hints: ["Khởi tạo i = 1 và dừng ở i <= 10."],
        pitfalls: ["Quên dấu xuống dòng \\n trong printf."],
      },
      {
        id: "lab2_06",
        number: 6,
        title: "Bài 6: Đảo Ngược Chữ Số (Control Structures)",
        topic: "Toán Tử Số Học & Vòng Lặp while",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết chương trình nhập số nguyên dương n, sau đó đảo ngược thứ tự các chữ số của số đó và in ra kết quả. Ví dụ: Input: 1234 -> Output: 4321.",
        theoryExplanation: "Lấy chữ số cuối bằng phép chia dư n % 10, cộng dồn vào kết quả: rev = rev * 10 + (n % 10), và bỏ chữ số cuối bằng n = n / 10.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Tự khai báo biến, nhập n và dùng vòng lặp while để đảo ngược chữ số */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int rev = 0;\n    while (n > 0) {\n        rev = rev * 10 + (n % 10);\n        n = n / 10;\n    }\n    printf(\"%d\\n\", rev);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai06.c",
        testCases: [
        {
                "id": "tc1",
                "input": "1234",
                "expectedOutput": "4321"
        },
        {
                "id": "tc2",
                "input": "9870",
                "expectedOutput": "789"
        }
],
        hints: ["Khởi tạo rev = 0 và lặp while (n > 0)."],
        pitfalls: ["Khởi tạo rev không bằng 0 sẽ bị sai kết quả rác."],
      },
      {
        id: "lab2_07",
        number: 7,
        title: "Bài 7: Kiểm Tra Số Nguyên Tố",
        topic: "Vòng Lặp & Tối Ưu Toán Học",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập một số nguyên dương n và kiểm tra xem n có phải là số nguyên tố hay không. In ra thông báo: '<n> la so nguyen to' hoặc '<n> khong phai so nguyen to'.",
        theoryExplanation: "Số nguyên tố là số > 1 không chia hết cho bất kỳ số nào từ 2 đến căn bậc hai của n (i * i <= n).",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập n, kiểm tra số nguyên tố và in kết quả */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    if (n <= 1) {\n        printf(\"%d khong phai so nguyen to\\n\", n);\n        return 0;\n    }\n    int isPrime = 1;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) {\n            isPrime = 0;\n            break;\n        }\n    }\n    if (isPrime) printf(\"%d la so nguyen to\\n\", n);\n    else printf(\"%d khong phai so nguyen to\\n\", n);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai07.c",
        testCases: [
        {
                "id": "tc1",
                "input": "17",
                "expectedOutput": "17 la so nguyen to"
        },
        {
                "id": "tc2",
                "input": "12",
                "expectedOutput": "12 khong phai so nguyen to"
        },
        {
                "id": "tc3",
                "input": "1",
                "expectedOutput": "1 khong phai so nguyen to"
        }
],
        hints: ["Nhớ rằng số 1 không phải là số nguyên tố."],
        pitfalls: ["Duyệt đến n thay vì i * i <= n làm tốn tài nguyên."],
      },
      {
        id: "lab2_08",
        number: 8,
        title: "Bài 8: Tính Tích Các Phần Tử Trong Mảng",
        topic: "Mảng 1 Chiều",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết chương trình nhập số lượng phần tử n của một mảng số nguyên, sau đó nhập n phần tử vào mảng và tính tích của tất cả các phần tử trong mảng. In ra: 'Tich: <tich>'.",
        theoryExplanation: "Khởi tạo product = 1, duyệt từng phần tử mảng và nhân dồn: product *= arr[i].",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Tự khai báo mảng, nhập n phần tử và tính tích */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int arr[100];\n    int product = 1;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &arr[i]);\n        product *= arr[i];\n    }\n    printf(\"Tich: %d\\n\", product);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai08.c",
        testCases: [
        {
                "id": "tc1",
                "input": "4 2 3 4 5",
                "expectedOutput": "Tich: 120"
        },
        {
                "id": "tc2",
                "input": "3 -2 3 4",
                "expectedOutput": "Tich: -24"
        }
],
        hints: ["Khởi tạo biến tích product = 1."],
        pitfalls: ["Khởi tạo product = 0 sẽ làm kết quả luôn bằng 0."],
      },
      {
        id: "lab2_09",
        number: 9,
        title: "Bài 9: Tách Mảng Thành Mảng Chẵn Và Mảng Lẻ",
        topic: "Mảng & Phân Loại Dữ Liệu",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập số lượng phần tử n và các phần tử của một mảng số nguyên. Tách các phần tử của mảng thành hai mảng riêng biệt: mảng chứa số chẵn và mảng chứa số lẻ. In hai mảng kết quả theo mẫu: 'Chan: <cac so chẵn>\\nLe: <cac so lẻ>'.",
        theoryExplanation: "Sử dụng hai mảng tạm thời evens và odds cùng các biến đếm eCount và oCount để lưu trữ các phần tử tương ứng.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Khai báo mảng, nhập dữ liệu, phân loại chẵn lẻ và in ra */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int evens[100], odds[100];\n    int eCount = 0, oCount = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        if (x % 2 == 0) evens[eCount++] = x;\n        else odds[oCount++] = x;\n    }\n    printf(\"Chan:\");\n    for (int i = 0; i < eCount; i++) printf(\" %d\", evens[i]);\n    printf(\"\\nLe:\");\n    for (int i = 0; i < oCount; i++) printf(\" %d\", odds[i]);\n    printf(\"\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab2_bai09.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5 1 2 3 4 5",
                "expectedOutput": "Chan: 2 4\nLe: 1 3 5"
        },
        {
                "id": "tc2",
                "input": "4 2 4 6 8",
                "expectedOutput": "Chan: 2 4 6 8\nLe:"
        }
],
        hints: ["Kiểm tra x % 2 == 0 để nhận biết số chẵn."],
        pitfalls: ["Quên tăng biến đếm của từng mảng khi thêm phần tử mới."],
      },
      {
        id: "lab2_10",
        number: 10,
        title: "Bài 10: Quản Lý Điểm Sinh Viên (Array Stats)",
        topic: "Thống Kê Mảng",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập số lượng sinh viên n và điểm số nguyên của từng sinh viên. Tính điểm trung bình của cả lớp (lấy 2 chữ số thập phân), tìm điểm cao nhất và điểm thấp nhất. In theo định dạng: 'Trung binh: <tb>, Max: <max>, Min: <min>'.",
        theoryExplanation: "Duyệt qua mảng để tính tổng các điểm, ép kiểu (float)sum / n để lấy giá trị trung bình chính xác, cập nhật min và max.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập danh sách điểm, tính trung bình, max, min và in kết quả */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int scores[100];\n    int sum = 0, maxVal = -1, minVal = 101;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &scores[i]);\n        sum += scores[i];\n        if (scores[i] > maxVal) maxVal = scores[i];\n        if (scores[i] < minVal) minVal = scores[i];\n    }\n    float avg = (float)sum / n;\n    printf(\"Trung binh: %.2f, Max: %d, Min: %d\\n\", avg, maxVal, minVal);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai10.c",
        testCases: [
        {
                "id": "tc1",
                "input": "4 8 9 5 6",
                "expectedOutput": "Trung binh: 7.00, Max: 9, Min: 5"
        },
        {
                "id": "tc2",
                "input": "3 10 10 10",
                "expectedOutput": "Trung binh: 10.00, Max: 10, Min: 10"
        }
],
        hints: ["Ép kiểu (float)sum / n để bảo toàn chữ số thập phân."],
        pitfalls: ["Khởi tạo max/min với giá trị không đúng phạm vi."],
      },
      {
        id: "lab2_11",
        number: 11,
        title: "Bài 11: Tìm Kiếm Tuyến Tính (Linear Search)",
        topic: "Tìm Kiếm Trong Mảng",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập số lượng phần tử n của mảng, n phần tử của mảng và giá trị cần tìm x. Tìm và in ra tất cả các vị trí (chỉ số index từ 0) mà giá trị x xuất hiện trong mảng theo mẫu: 'Vi tri: 1 3'.",
        theoryExplanation: "Thuật toán tìm kiếm tuyến tính (Linear Search) duyệt tuần tự qua từng phần tử mảng và so sánh bằng với khóa x.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập mảng, nhập x và in tất cả các vị trí xuất hiện của x */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int arr[100];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &arr[i]);\n    }\n    int x;\n    scanf(\"%d\", &x);\n    printf(\"Vi tri:\");\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == x) {\n            printf(\" %d\", i);\n        }\n    }\n    printf(\"\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab2_bai11.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5 1 4 2 4 5 4",
                "expectedOutput": "Vi tri: 1 3"
        },
        {
                "id": "tc2",
                "input": "4 7 7 7 7 7",
                "expectedOutput": "Vi tri: 0 1 2 3"
        }
],
        hints: ["Duyệt for (int i = 0; i < n; i++) và kiểm tra arr[i] == x."],
        pitfalls: ["Đọc thiếu số x từ stdin."],
      },
      {
        id: "lab2_12",
        number: 12,
        title: "Bài 12: Đếm Phân Loại Ký Tự Trong Chuỗi",
        topic: "Xử Lý Chuỗi Ký Tự",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập một chuỗi ký tự từ bàn phím (không khoảng trắng). Đếm và in ra số lượng: chữ cái hoa, chữ cái thường và chữ số trong chuỗi theo mẫu: 'Hoa: <h>, Thuong: <t>, Chu so: <s>'.",
        theoryExplanation: "Duyệt chuỗi ký tự C cho đến ký tự null '\\0'. So sánh mã ASCII: c >= 'A' && c <= 'Z' (hoa), c >= 'a' && c <= 'z' (thường), c >= '0' && c <= '9' (số).",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Nhập chuỗi và duyệt từng ký tự để phân loại */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    char str[100];\n    if (scanf(\"%s\", str) != 1) return 1;\n    int upper = 0, lower = 0, digits = 0;\n    for (int i = 0; str[i] != '\\0'; i++) {\n        char c = str[i];\n        if (c >= 'A' && c <= 'Z') upper++;\n        else if (c >= 'a' && c <= 'z') lower++;\n        else if (c >= '0' && c <= '9') digits++;\n    }\n    printf(\"Hoa: %d, Thuong: %d, Chu so: %d\\n\", upper, lower, digits);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai12.c",
        testCases: [
        {
                "id": "tc1",
                "input": "HocLapTrinhC2026",
                "expectedOutput": "Hoa: 4, Thuong: 8, Chu so: 4"
        },
        {
                "id": "tc2",
                "input": "SYS123",
                "expectedOutput": "Hoa: 3, Thuong: 0, Chu so: 3"
        }
],
        hints: ["Điều kiện dừng của chuỗi C là str[i] != '\\0'."],
        pitfalls: ["Khai báo kích thước mảng str quá nhỏ dẫn đến tràn bộ đệm."],
      },
      {
        id: "lab2_13",
        number: 13,
        title: "Bài 13: Đếm Số Từ Trong Chuỗi (Word Count)",
        topic: "Xử Lý Chuỗi & Luồng Ký Tự",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập các từ trong một chuỗi ký tự và đếm số lượng từ. In kết quả theo mẫu: 'So tu: <so_tu>'. Ví dụ: 'hoc lap trinh C' -> 'So tu: 4'.",
        theoryExplanation: "Hàm scanf(\"%s\") trong vòng lặp tự động đọc từng từ phân tách bởi khoảng trắng hoặc dấu xuống dòng cho đến hết dữ liệu đầu vào.",
        scaffoldingCode: "#include <stdio.h>\n\nint main() {\n    /* TODO: Đếm số từ trong dữ liệu nhập và in kết quả */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    char word[100];\n    int count = 0;\n    while (scanf(\"%s\", word) == 1) {\n        count++;\n    }\n    printf(\"So tu: %d\\n\", count);\n    return 0;\n}\n",
        defaultFileName: "lab2_bai13.c",
        testCases: [
        {
                "id": "tc1",
                "input": "hoc lap trinh C",
                "expectedOutput": "So tu: 4"
        },
        {
                "id": "tc2",
                "input": "Syslearn",
                "expectedOutput": "So tu: 1"
        }
],
        hints: ["Dùng vòng lặp while (scanf(\"%s\", word) == 1)."],
        pitfalls: ["Không xử lý nhiều khoảng trắng liên tiếp nếu duyệt thủ công từng ký tự."],
      },
      {
        id: "lab2_14",
        number: 14,
        title: "Bài 14: Kiểm Tra Chuỗi Con (Substring Search)",
        topic: "Thuật Toán So Khớp Chuỗi",
        difficulty: "Trung bình",
        level: 3,
        description: "Viết chương trình nhập một chuỗi ký tự s và một chuỗi con sub (không chứa khoảng trắng). Kiểm tra xem chuỗi sub có xuất hiện trong chuỗi s hay không. In ra thông báo: 'Tim thay chuoi con' hoặc 'Khong tim thay chuoi con'.",
        theoryExplanation: "Cài đặt thuật toán đối sánh chuỗi bằng cách trượt chuỗi con sub trên từng vị trí bắt đầu của chuỗi s.",
        scaffoldingCode: "#include <stdio.h>\n\nint isSubstring(char *s, char *sub) {\n    /* TODO: Cài đặt hàm kiểm tra xem sub có nằm trong s không */\n    return 0;\n}\n\nint main() {\n    char s[100], sub[50];\n    if (scanf(\"%s %s\", s, sub) != 2) return 1;\n    \n    // TODO: Gọi hàm và in thông báo\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint isSubstring(char *s, char *sub) {\n    for (int i = 0; s[i] != '\\0'; i++) {\n        int match = 1;\n        for (int j = 0; sub[j] != '\\0'; j++) {\n            if (s[i + j] == '\\0' || s[i + j] != sub[j]) {\n                match = 0;\n                break;\n            }\n        }\n        if (match) return 1;\n    }\n    return 0;\n}\n\nint main() {\n    char s[100], sub[50];\n    if (scanf(\"%s %s\", s, sub) != 2) return 1;\n    if (isSubstring(s, sub)) {\n        printf(\"Tim thay chuoi con\\n\");\n    } else {\n        printf(\"Khong tim thay chuoi con\\n\");\n    }\n    return 0;\n}\n",
        defaultFileName: "lab2_bai14.c",
        testCases: [
        {
                "id": "tc1",
                "input": "laptrinhhethong hethong",
                "expectedOutput": "Tim thay chuoi con"
        },
        {
                "id": "tc2",
                "input": "laptrinhhethong python",
                "expectedOutput": "Khong tim thay chuoi con"
        }
],
        hints: ["Duyệt từng ký tự bắt đầu của s, so khớp liên tiếp các ký tự của sub."],
        pitfalls: ["Kiểm tra s[i + j] == '\\0' để tránh đọc quá vùng nhớ của chuỗi mẹ."],
      },
    ],
  },
  {
    id: "session_03",
    sessionNumber: 3,
    title: "Buổi 3: Hàm, Đệ Quy, Con Trỏ & Cấp Phát Bộ Nhớ Động",
    shortDescription: "20 bài thực hành chuẩn giáo trình: Chia hàm module, giải thuật đệ quy, con trỏ thao tác địa chỉ ô nhớ và quản lý heap bằng malloc/realloc/free.",
    icon: "Layers",
    status: "active",
    slidesCount: 64,
    slidePdfUrl: "https://drive.google.com/file/d/1example_buoi3/preview",
    keyConcepts: ["Functions & Modularity", "Recursion", "Pointer Syntax (* &)", "Dynamic Memory (malloc/free/realloc)"],
    labs: [
      {
        id: "lab3_01",
        number: 1,
        title: "Bài 1: Máy Tính Tiền Điện Bậc Thang",
        topic: "Hàm & Tính Toán Module",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập số kWh điện tiêu thụ trong tháng. Viết hàm calculateBill(int kwh) tính tiền điện theo 3 bậc: <=50 kWh: 1800 đ/kWh, 51..100 kWh: 2300 đ/kWh, >100 kWh: 2800 đ/kWh. In theo mẫu: 'Tien dien: <so_tien>'. Ví dụ: 120 kWh -> 'Tien dien: 261000'.",
        theoryExplanation: "Tách bài toán thành hàm riêng calculateBill. Tính toán bậc thang: 50 * 1800 + 50 * 2300 + (kwh - 100) * 2800.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm calculateBill(int kwh) tính tiền điện theo bậc thang\n\nint main() {\n    // TODO: Nhập số kWh, gọi hàm và in ra theo mẫu 'Tien dien: <so_tien>'\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint calculateBill(int kwh) {\n    if (kwh <= 50) return kwh * 1800;\n    if (kwh <= 100) return 50 * 1800 + (kwh - 50) * 2300;\n    return 50 * 1800 + 50 * 2300 + (kwh - 100) * 2800;\n}\n\nint main() {\n    int kwh;\n    if (scanf(\"%d\", &kwh) != 1) return 1;\n    printf(\"Tien dien: %d\\n\", calculateBill(kwh));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai01.c",
        testCases: [
        {
                "id": "tc1",
                "input": "120",
                "expectedOutput": "Tien dien: 261000"
        },
        {
                "id": "tc2",
                "input": "40",
                "expectedOutput": "Tien dien: 72000"
        },
        {
                "id": "tc3",
                "input": "80",
                "expectedOutput": "Tien dien: 159000"
        }
],
        hints: ["Chú ý các mốc bậc thang 50 và 100 kWh."],
        pitfalls: ["Không nhân toàn bộ số kWh với giá của bậc cao nhất mà phải tính theo từng bậc."],
      },
      {
        id: "lab3_02",
        number: 2,
        title: "Bài 2: Kiểm Tra Ngày Hợp Lệ & Năm Nhuận",
        topic: "Hàm Kiểm Tra Logic",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết chương trình nhập ba số nguyên ngày, tháng, năm. Viết hàm isLeapYear kiểm tra năm nhuận và hàm isValidDate kiểm tra ngày hợp lệ. In: 'Ngay hop le' hoặc 'Ngay khong hop le'.",
        theoryExplanation: "Năm nhuận chia hết cho 400 hoặc chia hết cho 4 nhưng không chia hết cho 100. Tháng 2 có 29 ngày nếu năm nhuận, ngược lại có 28 ngày.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm kiểm tra năm nhuận và ngày hợp lệ\n\nint main() {\n    // TODO: Nhập ngày, tháng, năm và in thông báo\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint isLeapYear(int y) {\n    return (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);\n}\n\nint isValidDate(int d, int m, int y) {\n    if (y < 1 || m < 1 || m > 12 || d < 1) return 0;\n    int maxD = 31;\n    if (m == 4 || m == 6 || m == 9 || m == 11) maxD = 30;\n    else if (m == 2) maxD = isLeapYear(y) ? 29 : 28;\n    return d <= maxD;\n}\n\nint main() {\n    int d, m, y;\n    if (scanf(\"%d %d %d\", &d, &m, &y) != 3) return 1;\n    if (isValidDate(d, m, y)) printf(\"Ngay hop le\\n\");\n    else printf(\"Ngay khong hop le\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab3_bai02.c",
        testCases: [
        {
                "id": "tc1",
                "input": "29 2 2024",
                "expectedOutput": "Ngay hop le"
        },
        {
                "id": "tc2",
                "input": "29 2 2023",
                "expectedOutput": "Ngay khong hop le"
        },
        {
                "id": "tc3",
                "input": "31 4 2025",
                "expectedOutput": "Ngay khong hop le"
        }
],
        hints: ["Tháng 4, 6, 9, 11 có tối đa 30 ngày."],
        pitfalls: ["Quên điều kiện năm nhuận cho ngày 29/02."],
      },
      {
        id: "lab3_03",
        number: 3,
        title: "Bài 3: Máy Bán Nước Tự Động",
        topic: "Hàm Xử Lý Giao Dịch",
        difficulty: "Căn bản",
        level: 2,
        description: "Máy bán nước có 3 loại đồ uống: Mã 1 - Nuoc suoi (10000 đ), Mã 2 - Tra chanh (12000 đ), Mã 3 - Ca phe (15000 đ). Người dùng nhập số tiền bỏ vào và mã đồ uống. Nếu đủ tiền, in: '<ten> - Thua: <so_tien_thua>'. Nếu thiếu tiền, in: 'Thieu: <so_tien_thieu>'. Nếu mã sai, in: 'Ma khong hop le'.",
        theoryExplanation: "Sử dụng switch-case hoặc if-else để lấy giá tiền và tên sản phẩm, sau đó so sánh với số tiền đã bỏ vào.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm xử lý giao dịch máy bán nước\n\nint main() {\n    // TODO: Nhập số tiền, mã sản phẩm và in kết quả giao dịch\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int money, code;\n    if (scanf(\"%d %d\", &money, &code) != 2) return 1;\n    int price = 0;\n    char name[20];\n    if (code == 1) { price = 10000; printf(\"Nuoc suoi\"); }\n    else if (code == 2) { price = 12000; printf(\"Tra chanh\"); }\n    else if (code == 3) { price = 15000; printf(\"Ca phe\"); }\n    else { printf(\"Ma khong hop le\\n\"); return 0; }\n    \n    if (money >= price) {\n        printf(\" - Thua: %d\\n\", money - price);\n    } else {\n        printf(\"\\nThieu: %d\\n\", price - money);\n    }\n    return 0;\n}\n",
        defaultFileName: "lab3_bai03.c",
        testCases: [
        {
                "id": "tc1",
                "input": "15000 2",
                "expectedOutput": "Tra chanh - Thua: 3000"
        },
        {
                "id": "tc2",
                "input": "8000 1",
                "expectedOutput": "Thieu: 2000"
        },
        {
                "id": "tc3",
                "input": "10000 9",
                "expectedOutput": "Ma khong hop le"
        }
],
        hints: ["Kiểm tra mã hợp lệ (1, 2, 3) trước khi kiểm tra tiền."],
        pitfalls: ["Tránh in thừa khi tiền bị thiếu."],
      },
      {
        id: "lab3_04",
        number: 4,
        title: "Bài 4: Thống Kê Điểm 3 Môn",
        topic: "Hàm Thống Kê & Xếp Loại",
        difficulty: "Căn bản",
        level: 2,
        description: "Nhập điểm 3 môn của một sinh viên (số thực). Viết các hàm tính điểm trung bình, tìm điểm cao nhất và xếp loại: >= 8.0: 'Gioi', >= 6.5: 'Kha', >= 5.0: 'Dat', < 5.0: 'Truot'. In theo mẫu: 'Trung binh: <tb>, Max: <max>, Xep loai: <loai>'.",
        theoryExplanation: "Tách logic tính toán ra các hàm float calcAvg(float, float, float), float findMax(float, float, float).",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết các hàm tính trung bình, max và xếp loại\n\nint main() {\n    // TODO: Nhập điểm 3 môn và in kết quả thống kê\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    float m1, m2, m3;\n    if (scanf(\"%f %f %f\", &m1, &m2, &m3) != 3) return 1;\n    float avg = (m1 + m2 + m3) / 3.0;\n    float maxVal = m1;\n    if (m2 > maxVal) maxVal = m2;\n    if (m3 > maxVal) maxVal = m3;\n    char rank[10];\n    if (avg >= 8.0) printf(\"Trung binh: %.2f, Max: %.2f, Xep loai: Gioi\\n\", avg, maxVal);\n    else if (avg >= 6.5) printf(\"Trung binh: %.2f, Max: %.2f, Xep loai: Kha\\n\", avg, maxVal);\n    else if (avg >= 5.0) printf(\"Trung binh: %.2f, Max: %.2f, Xep loai: Dat\\n\", avg, maxVal);\n    else printf(\"Trung binh: %.2f, Max: %.2f, Xep loai: Truot\\n\", avg, maxVal);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai04.c",
        testCases: [
        {
                "id": "tc1",
                "input": "7.5 8.0 6.5",
                "expectedOutput": "Trung binh: 7.33, Max: 8.00, Xep loai: Kha"
        },
        {
                "id": "tc2",
                "input": "9.0 8.5 9.5",
                "expectedOutput": "Trung binh: 9.00, Max: 9.50, Xep loai: Gioi"
        }
],
        hints: ["Điểm trung bình chia cho 3.0f để giữ số thực."],
        pitfalls: ["Chia cho số nguyên 3 có thể làm tròn sai."],
      },
      {
        id: "lab3_05",
        number: 5,
        title: "Bài 5: Quản Lý Hóa Đơn Mua Hàng",
        topic: "Hàm Tính Tiền & Chiết Khấu",
        difficulty: "Căn bản",
        level: 2,
        description: "Nhập số lượng sản phẩm n (nguyên), đơn giá price (nguyên) và phần trăm giảm giá discount (nguyên, ví dụ 10). Tính tổng tiền trước giảm, số tiền giảm và số tiền thanh toán cuối cùng. In theo mẫu: 'Tong: <tong>, Giam: <giam>, Thanh toan: <thanh_toan>'.",
        theoryExplanation: "Công thức: Tong = n * price. Giam = Tong * discount / 100. Thanh toan = Tong - Giam.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm tính toán chiết khấu và hóa đơn\n\nint main() {\n    // TODO: Nhập số lượng, đơn giá, % giảm và in hóa đơn\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    int n, price, discount;\n    if (scanf(\"%d %d %d\", &n, &price, &discount) != 3) return 1;\n    int total = n * price;\n    int discAmt = total * discount / 100;\n    int finalAmt = total - discAmt;\n    printf(\"Tong: %d, Giam: %d, Thanh toan: %d\\n\", total, discAmt, finalAmt);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai05.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 200000 10",
                "expectedOutput": "Tong: 600000, Giam: 60000, Thanh toan: 540000"
        },
        {
                "id": "tc2",
                "input": "2 50000 0",
                "expectedOutput": "Tong: 100000, Giam: 0, Thanh toan: 100000"
        }
],
        hints: ["Nhân trước rồi chia 100 để tránh mất số nguyên."],
        pitfalls: ["Nếu chia discount / 100 trước trong số nguyên sẽ ra 0."],
      },
      {
        id: "lab3_06",
        number: 6,
        title: "Bài 6: Tính Tổng Từ 1 Đến N Bằng Đệ Quy",
        topic: "Giải Thuật Đệ Quy",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết hàm đệ quy sumN(int n) tính tổng các số nguyên từ 1 đến n (S(n) = n + S(n-1) với S(1) = 1). Nhập n > 0 và in: 'Tong: <tong>'. Không dùng vòng lặp for/while trong hàm tính tổng.",
        theoryExplanation: "Hàm đệ quy gọi lại chính nó với bài toán con nhỏ hơn. Điều kiện dừng (base case): n <= 1 return n.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Tự viết hàm đệ quy int sumN(int n)\n\nint main() {\n    // TODO: Nhập n, gọi hàm sumN và in 'Tong: <tong>'\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint sumN(int n) {\n    if (n <= 1) return n;\n    return n + sumN(n - 1);\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    printf(\"Tong: %d\\n\", sumN(n));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai06.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5",
                "expectedOutput": "Tong: 15"
        },
        {
                "id": "tc2",
                "input": "10",
                "expectedOutput": "Tong: 55"
        }
],
        hints: ["Điều kiện dừng: if (n <= 1) return n;"],
        pitfalls: ["Thiếu điều kiện dừng sẽ gây tràn bộ nhớ Stack (Stack Overflow)."],
      },
      {
        id: "lab3_07",
        number: 7,
        title: "Bài 7: Tính Giai Thừa N! Bằng Đệ Quy",
        topic: "Giải Thuật Đệ Quy",
        difficulty: "Căn bản",
        level: 1,
        description: "Viết hàm đệ quy factorial(int n) tính n! = n * (n-1)! với điều kiện dừng 0! = 1 và 1! = 1. Nhập n >= 0 và in: 'Giai thua: <kq>'.",
        theoryExplanation: "Base case: n == 0 || n == 1 return 1. Bước đệ quy: return n * factorial(n - 1).",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Tự viết hàm đệ quy tính giai thừa factorial(int n)\n\nint main() {\n    // TODO: Nhập n, gọi hàm và in 'Giai thua: <kq>'\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    printf(\"Giai thua: %d\\n\", factorial(n));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai07.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5",
                "expectedOutput": "Giai thua: 120"
        },
        {
                "id": "tc2",
                "input": "0",
                "expectedOutput": "Giai thua: 1"
        },
        {
                "id": "tc3",
                "input": "7",
                "expectedOutput": "Giai thua: 5040"
        }
],
        hints: ["Xử lý trường hợp n = 0 trả về 1."],
        pitfalls: ["0! bằng 1 chứ không bằng 0."],
      },
      {
        id: "lab3_08",
        number: 8,
        title: "Bài 8: Tính Lũy Thừa a^n Bằng Đệ Quy",
        topic: "Giải Thuật Đệ Quy",
        difficulty: "Căn bản",
        level: 2,
        description: "Viết hàm đệ quy power(int a, int n) tính a^n với n >= 0 (a^n = a * a^(n-1), điều kiện dừng a^0 = 1). Nhập hai số nguyên a và n, in kết quả theo mẫu: 'Luy thua: <kq>'.",
        theoryExplanation: "Base case: n == 0 return 1. Recursive case: return a * power(a, n - 1).",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm đệ quy power(int a, int n)\n\nint main() {\n    // TODO: Nhập a và n, gọi hàm và in kết quả\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint power(int a, int n) {\n    if (n == 0) return 1;\n    return a * power(a, n - 1);\n}\n\nint main() {\n    int a, n;\n    if (scanf(\"%d %d\", &a, &n) != 2) return 1;\n    printf(\"Luy thua: %d\\n\", power(a, n));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai08.c",
        testCases: [
        {
                "id": "tc1",
                "input": "2 5",
                "expectedOutput": "Luy thua: 32"
        },
        {
                "id": "tc2",
                "input": "3 4",
                "expectedOutput": "Luy thua: 81"
        },
        {
                "id": "tc3",
                "input": "5 0",
                "expectedOutput": "Luy thua: 1"
        }
],
        hints: ["a^0 luôn bằng 1."],
        pitfalls: ["Quên trường hợp n = 0 dẫn đến vòng lặp đệ quy âm vô tận."],
      },
      {
        id: "lab3_09",
        number: 9,
        title: "Bài 9: Tính Tổng Các Chữ Số Bằng Đệ Quy",
        topic: "Giải Thuật Đệ Quy",
        difficulty: "Căn bản",
        level: 2,
        description: "Nhập một số nguyên dương n và viết hàm đệ quy sumDigits(int n) tính tổng các chữ số của nó. Không dùng vòng lặp. In theo mẫu: 'Tong chu so: <kq>'. Ví dụ: 1234 -> 10.",
        theoryExplanation: "Mỗi bước đệ quy: chữ số cuối là n % 10, phần còn lại là n / 10. return (n % 10) + sumDigits(n / 10). Điều kiện dừng: n == 0 return 0.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm đệ quy sumDigits(int n)\n\nint main() {\n    // TODO: Nhập n, gọi hàm và in ra màn hình\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint sumDigits(int n) {\n    if (n == 0) return 0;\n    return (n % 10) + sumDigits(n / 10);\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    printf(\"Tong chu so: %d\\n\", sumDigits(n));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai09.c",
        testCases: [
        {
                "id": "tc1",
                "input": "1234",
                "expectedOutput": "Tong chu so: 10"
        },
        {
                "id": "tc2",
                "input": "908",
                "expectedOutput": "Tong chu so: 17"
        }
],
        hints: ["Tách chữ số cuối bằng n % 10 và phần còn lại bằng n / 10."],
        pitfalls: ["Điều kiện dừng n == 0 trả về 0."],
      },
      {
        id: "lab3_10",
        number: 10,
        title: "Bài 10: Đảo Ngược Số Nguyên Bằng Đệ Quy",
        topic: "Giải Thuật Đệ Quy & Luồng Xuất",
        difficulty: "Căn bản",
        level: 2,
        description: "Nhập số nguyên dương n và viết hàm đệ quy printReverse(int n) để in các chữ số theo thứ tự ngược lại (không dùng chuỗi ký tự hay mảng). In theo mẫu: 'Dao nguoc: <so_dao>'. Ví dụ: 12345 -> 'Dao nguoc: 54321'.",
        theoryExplanation: "Hàm đệ quy in ngay chữ số cuối printf(\"%d\", n % 10) rồi gọi đệ quy printReverse(n / 10). Điều kiện dừng: if (n == 0) return.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết hàm đệ quy printReverse(int n)\n\nint main() {\n    // TODO: Nhập n và gọi hàm in số đảo ngược\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nvoid printReverse(int n) {\n    if (n == 0) return;\n    printf(\"%d\", n % 10);\n    printReverse(n / 10);\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    printf(\"Dao nguoc: \");\n    printReverse(n);\n    printf(\"\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab3_bai10.c",
        testCases: [
        {
                "id": "tc1",
                "input": "12345",
                "expectedOutput": "Dao nguoc: 54321"
        },
        {
                "id": "tc2",
                "input": "9801",
                "expectedOutput": "Dao nguoc: 1089"
        }
],
        hints: ["In ra n % 10 trước rồi gọi tiếp với n / 10."],
        pitfalls: ["Nếu gọi đệ quy trước khi printf thì số sẽ bị in xuôi thay vì in ngược."],
      },
      {
        id: "lab3_11",
        number: 11,
        title: "Bài 11: Hoán Đổi Hai Số Bằng Con Trỏ",
        topic: "Con Trỏ & Truyền Tham Chiếu",
        difficulty: "Trung bình",
        level: 3,
        description: "Viết hàm swap(int *a, int *b) dùng con trỏ để hoán đổi giá trị của hai số nguyên trong bộ nhớ. Nhập hai số a và b, in giá trị trước và sau khi hoán đổi theo mẫu: 'Truoc: a=5, b=9\\nSau: a=9, b=5'.",
        theoryExplanation: "Trong C, truyền tham trị không làm thay đổi giá trị của biến ngoài hàm. Để thay đổi, ta truyền địa chỉ ô nhớ (&a, &b) và dùng toán tử giải con trỏ (*a, *b) để gán giá trị.",
        scaffoldingCode: "#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    /* TODO: Cài đặt hoán đổi giá trị qua con trỏ */\n}\n\nint main() {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n    \n    // TODO: In giá trị trước, gọi swap(&a, &b) và in giá trị sau\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n    printf(\"Truoc: a=%d, b=%d\\n\", a, b);\n    swap(&a, &b);\n    printf(\"Sau: a=%d, b=%d\\n\", a, b);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai11.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5 9",
                "expectedOutput": "Truoc: a=5, b=9\nSau: a=9, b=5"
        },
        {
                "id": "tc2",
                "input": "100 200",
                "expectedOutput": "Truoc: a=100, b=200\nSau: a=200, b=100"
        }
],
        hints: ["Dùng biến tạm int temp = *a; *a = *b; *b = temp;"],
        pitfalls: ["Quên toán tử giải tham chiếu * khi gán giá trị."],
      },
      {
        id: "lab3_12",
        number: 12,
        title: "Bài 12: Trả Nhiều Kết Quả Qua Tham Số Con Trỏ",
        topic: "Con Trỏ Làm Tham Số Đầu Ra",
        difficulty: "Trung bình",
        level: 3,
        description: "Viết hàm calculate(int a, int b, int *sum, int *diff) vừa tính tổng vừa tính hiệu của hai số và ghi vào hai biến do hàm main cung cấp địa chỉ. In theo mẫu: 'Tong: <tong>, Hieu: <hieu>'. Ví dụ: a = 10, b = 4 -> 'Tong: 14, Hieu: 6'.",
        theoryExplanation: "Hàm C chỉ return được 1 giá trị duy nhất. Để trả về nhiều kết quả, truyền con trỏ tới biến đích làm tham số đầu ra (out parameters).",
        scaffoldingCode: "#include <stdio.h>\n\nvoid calculate(int a, int b, int *sum, int *diff) {\n    /* TODO: Ghi tổng vào *sum và hiệu vào *diff */\n}\n\nint main() {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n    \n    // TODO: Khai báo biến sum, diff, truyền &sum, &diff vào hàm và in ra\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nvoid calculate(int a, int b, int *sum, int *diff) {\n    *sum = a + b;\n    *diff = a - b;\n}\n\nint main() {\n    int a, b, s, d;\n    if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n    calculate(a, b, &s, &d);\n    printf(\"Tong: %d, Hieu: %d\\n\", s, d);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai12.c",
        testCases: [
        {
                "id": "tc1",
                "input": "10 4",
                "expectedOutput": "Tong: 14, Hieu: 6"
        },
        {
                "id": "tc2",
                "input": "20 25",
                "expectedOutput": "Tong: 45, Hieu: -5"
        }
],
        hints: ["*sum = a + b; *diff = a - b;"],
        pitfalls: ["Truyền sum thay vì &sum vào lời gọi hàm calculate."],
      },
      {
        id: "lab3_13",
        number: 13,
        title: "Bài 13: Tìm Số Lớn Nhất Trong Mảng Bằng Con Trỏ",
        topic: "Con Trỏ & Mảng Tuyến Tính",
        difficulty: "Trung bình",
        level: 3,
        description: "Nhập n và n số nguyên vào mảng. Viết hàm int findMax(int *arr, int n) dùng con trỏ duyệt mảng tìm giá trị lớn nhất. In ra theo mẫu: 'Max: <max>'. Ví dụ: mảng [3, 8, 2, 10, 5] -> 'Max: 10'.",
        theoryExplanation: "Tên mảng trong C suy biến thành con trỏ trỏ tới phần tử đầu tiên arr[0]. Ta có thể truy cập mảng bằng con trỏ *(arr + i) hoặc arr[i].",
        scaffoldingCode: "#include <stdio.h>\n\nint findMax(int *arr, int n) {\n    /* TODO: Viết hàm tìm max bằng con trỏ */\n    return 0;\n}\n\nint main() {\n    // TODO: Nhập mảng, gọi findMax và in ra 'Max: <max>'\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint findMax(int *arr, int n) {\n    int m = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > m) m = arr[i];\n    }\n    return m;\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int arr[100];\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &arr[i]);\n    }\n    printf(\"Max: %d\\n\", findMax(arr, n));\n    return 0;\n}\n",
        defaultFileName: "lab3_bai13.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5 3 8 2 10 5",
                "expectedOutput": "Max: 10"
        },
        {
                "id": "tc2",
                "input": "3 -10 -5 -20",
                "expectedOutput": "Max: -5"
        }
],
        hints: ["Khởi tạo max = arr[0] rồi so sánh với các phần tử tiếp theo."],
        pitfalls: ["Khởi tạo max = 0 sẽ sai khi toàn bộ mảng là các số âm."],
      },
      {
        id: "lab3_14",
        number: 14,
        title: "Bài 14: Cập Nhật Số Dư Tài Khoản Bằng Con Trỏ",
        topic: "Con Trỏ Thay Đổi Trạng Thái",
        difficulty: "Trung bình",
        level: 3,
        description: "Biểu diễn số dư tài khoản bằng biến balance. Viết hàm deposit(int *bal, int amt) nạp tiền và withdraw(int *bal, int amt) rút tiền nếu đủ điều kiện. Nhập số dư ban đầu, số tiền nạp và số tiền rút. In số dư cuối cùng theo mẫu: 'So du: <so_du>'.",
        theoryExplanation: "Hàm nhận địa chỉ con trỏ của biến số dư để cộng hoặc trừ trực tiếp vào giá trị của ô nhớ.",
        scaffoldingCode: "#include <stdio.h>\n\nvoid deposit(int *bal, int amt) {\n    // TODO: Nạp tiền nếu amt > 0\n}\n\nvoid withdraw(int *bal, int amt) {\n    // TODO: Rút tiền nếu amt > 0 và đủ số dư\n}\n\nint main() {\n    // TODO: Nhập balance, nạp tiền, rút tiền và in 'So du: <so_du>'\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nvoid deposit(int *bal, int amt) {\n    if (amt > 0) *bal += amt;\n}\n\nvoid withdraw(int *bal, int amt) {\n    if (amt > 0 && *bal >= amt) *bal -= amt;\n}\n\nint main() {\n    int balance, dep, withAmt;\n    if (scanf(\"%d %d %d\", &balance, &dep, &withAmt) != 3) return 1;\n    deposit(&balance, dep);\n    withdraw(&balance, withAmt);\n    printf(\"So du: %d\\n\", balance);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai14.c",
        testCases: [
        {
                "id": "tc1",
                "input": "500000 200000 100000",
                "expectedOutput": "So du: 600000"
        },
        {
                "id": "tc2",
                "input": "300000 50000 400000",
                "expectedOutput": "So du: 350000"
        }
],
        hints: ["Kiểm tra điều kiện *bal >= amt trước khi trừ tiền."],
        pitfalls: ["Cho phép rút tiền khi không đủ số dư dẫn đến số dư bị âm."],
      },
      {
        id: "lab3_15",
        number: 15,
        title: "Bài 15: Thống Kê Mảng Sinh Viên Bằng Con Trỏ",
        topic: "Con Trỏ Mảng & Thống Kê",
        difficulty: "Trung bình",
        level: 3,
        description: "Nhập số lượng sinh viên n và điểm của từng sinh viên (số thực). Viết các hàm dùng con trỏ để đếm số sinh viên đạt (điểm >= 5.0), tìm điểm cao nhất và điểm thấp nhất. In theo mẫu: 'Dat: <so_dat>, Max: <max>, Min: <min>'.",
        theoryExplanation: "Duyệt mảng bằng con trỏ *(scores + i) hoặc scores[i] để thống kê dữ liệu.",
        scaffoldingCode: "#include <stdio.h>\n\n// TODO: Viết các hàm thống kê mảng điểm qua con trỏ\n\nint main() {\n    // TODO: Nhập danh sách điểm và in kết quả thống kê\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint countPassed(float *arr, int n) {\n    int c = 0;\n    for (int i = 0; i < n; i++) if (arr[i] >= 5.0) c++;\n    return c;\n}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    float arr[100];\n    for (int i = 0; i < n; i++) scanf(\"%f\", &arr[i]);\n    float maxVal = arr[0], minVal = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > maxVal) maxVal = arr[i];\n        if (arr[i] < minVal) minVal = arr[i];\n    }\n    printf(\"Dat: %d, Max: %.2f, Min: %.2f\\n\", countPassed(arr, n), maxVal, minVal);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai15.c",
        testCases: [
        {
                "id": "tc1",
                "input": "4 4.5 7.0 8.5 5.0",
                "expectedOutput": "Dat: 3, Max: 8.50, Min: 4.50"
        },
        {
                "id": "tc2",
                "input": "3 2.0 3.5 4.0",
                "expectedOutput": "Dat: 0, Max: 4.00, Min: 2.00"
        }
],
        hints: ["Đếm số điểm >= 5.0."],
        pitfalls: ["Khởi tạo maxVal/minVal bằng arr[0] sau khi đã nhập mảng."],
      },
      {
        id: "lab3_16",
        number: 16,
        title: "Bài 16: Cấp Phát Động Danh Sách Điểm (malloc)",
        topic: "Bộ Nhớ Heap (malloc & free)",
        difficulty: "Nâng cao",
        level: 4,
        description: "Nhập số lượng sinh viên n. Dùng malloc() để cấp phát động một mảng float lưu điểm của n sinh viên. Nhập điểm, tính điểm trung bình của cả lớp (2 chữ số thập phân) và giải phóng bộ nhớ bằng free(). In: 'Trung binh: <tb>'. Ví dụ: 5 sinh viên với điểm 6, 7, 8, 9, 10 -> 'Trung binh: 8.00'.",
        theoryExplanation: "Hàm malloc(n * sizeof(float)) cấp phát vùng nhớ liên tục trên Heap. Luôn kiểm tra con trỏ khác NULL và giải phóng vùng nhớ bằng free() khi sử dụng xong để tránh Memory Leak.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    \n    /* TODO: Cấp phát động mảng float bằng malloc, nhập điểm, tính TB và free */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    float *scores = (float*)malloc(n * sizeof(float));\n    if (scores == NULL) return 1;\n    float sum = 0;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%f\", &scores[i]);\n        sum += scores[i];\n    }\n    printf(\"Trung binh: %.2f\\n\", sum / n);\n    free(scores);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai16.c",
        testCases: [
        {
                "id": "tc1",
                "input": "5 6 7 8 9 10",
                "expectedOutput": "Trung binh: 8.00"
        },
        {
                "id": "tc2",
                "input": "3 8.5 7.5 9.0",
                "expectedOutput": "Trung binh: 8.33"
        }
],
        hints: ["Khai báo float *scores = (float*)malloc(n * sizeof(float)); và gọi free(scores);"],
        pitfalls: ["Quên giải phóng bộ nhớ bằng free() dẫn đến rò rỉ bộ nhớ (Memory Leak)."],
      },
      {
        id: "lab3_17",
        number: 17,
        title: "Bài 17: Danh Sách Chi Tiêu Trong Ngày (malloc)",
        topic: "Bộ Nhớ Động Heap",
        difficulty: "Nâng cao",
        level: 4,
        description: "Nhập số lượng khoản chi n. Cấp phát động mảng lưu các khoản chi (số nguyên). Tính tổng chi tiêu và tìm khoản chi lớn nhất. Giải phóng bộ nhớ. In theo mẫu: 'Tong chi: <tong>, Max chi: <max>'.",
        theoryExplanation: "Khi số lượng phần tử chỉ được biết trong lúc chạy chương trình (runtime), cấp phát động malloc là giải pháp tối ưu linh hoạt.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    \n    /* TODO: Dùng malloc cấp phát mảng n số nguyên, tính tổng và max, sau đó free */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int *expenses = (int*)malloc(n * sizeof(int));\n    if (expenses == NULL) return 1;\n    int sum = 0, maxExp = 0;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &expenses[i]);\n        sum += expenses[i];\n        if (expenses[i] > maxExp) maxExp = expenses[i];\n    }\n    printf(\"Tong chi: %d, Max chi: %d\\n\", sum, maxExp);\n    free(expenses);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai17.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 25000 50000 120000",
                "expectedOutput": "Tong chi: 195000, Max chi: 120000"
        },
        {
                "id": "tc2",
                "input": "2 100000 150000",
                "expectedOutput": "Tong chi: 250000, Max chi: 150000"
        }
],
        hints: ["Nhớ gọi free(expenses) trước khi kết thúc chương trình."],
        pitfalls: ["Truy cập vượt quá chỉ số n-1 gây tràn bộ đệm heap."],
      },
      {
        id: "lab3_18",
        number: 18,
        title: "Bài 18: Mở Rộng Danh Sách Nhiệt Độ (realloc)",
        topic: "Tái Cấp Phát Bộ Nhớ realloc",
        difficulty: "Nâng cao",
        level: 4,
        description: "Một cảm biến gửi n giá trị nhiệt độ ban đầu. Sau đó gửi thêm m giá trị mới. Cấp phát mảng động ban đầu kích thước n, sau đó dùng realloc() mở rộng mảng thành n + m phần tử để lưu thêm m giá trị mới. In toàn bộ danh sách nhiệt độ sau khi mở rộng: 'Nhiet do: 30 31 29 32 30'.",
        theoryExplanation: "Hàm realloc(ptr, new_size) thay đổi kích thước của vùng nhớ heap đã cấp phát trước đó mà vẫn giữ nguyên dữ liệu cũ.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    /* TODO: Cấp phát mảng n phần tử, nhập n giá trị, sau đó dùng realloc mở rộng thành n+m và nhập tiếp */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int *temps = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf(\"%d\", &temps[i]);\n    int m;\n    if (scanf(\"%d\", &m) != 1) return 1;\n    temps = (int*)realloc(temps, (n + m) * sizeof(int));\n    for (int i = 0; i < m; i++) scanf(\"%d\", &temps[n + i]);\n    printf(\"Nhiet do:\");\n    for (int i = 0; i < n + m; i++) printf(\" %d\", temps[i]);\n    printf(\"\\n\");\n    free(temps);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai18.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 30 31 29 2 32 30",
                "expectedOutput": "Nhiet do: 30 31 29 32 30"
        }
],
        hints: ["temps = (int*)realloc(temps, (n + m) * sizeof(int));"],
        pitfalls: ["Không cập nhật lại con trỏ temps sau khi gọi realloc."],
      },
      {
        id: "lab3_19",
        number: 19,
        title: "Bài 19: Gộp Hai Danh Sách Số (malloc)",
        topic: "Bộ Nhớ Động & Thao Tác Mảng",
        difficulty: "Nâng cao",
        level: 4,
        description: "Nhập n và n số của danh sách 1, nhập m và m số của danh sách 2. Cấp phát động mảng thứ 3 kích thước n + m chứa toàn bộ phần tử của cả hai danh sách. In mảng kết quả: 'Gop: 1 2 3 10 20'. Giải phóng toàn bộ bộ nhớ.",
        theoryExplanation: "Tạo mảng thứ ba bằng malloc((n + m) * sizeof(int)), sao chép mảng 1 từ 0..n-1 và mảng 2 từ n..n+m-1.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    /* TODO: Cấp phát động 2 mảng ban đầu, tạo mảng gộp thứ 3, sao chép và in kết quả */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n, m;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int *a = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n    if (scanf(\"%d\", &m) != 1) return 1;\n    int *b = (int*)malloc(m * sizeof(int));\n    for (int i = 0; i < m; i++) scanf(\"%d\", &b[i]);\n    \n    int *c = (int*)malloc((n + m) * sizeof(int));\n    for (int i = 0; i < n; i++) c[i] = a[i];\n    for (int i = 0; i < m; i++) c[n + i] = b[i];\n    \n    printf(\"Gop:\");\n    for (int i = 0; i < n + m; i++) printf(\" %d\", c[i]);\n    printf(\"\\n\");\n    \n    free(a);\n    free(b);\n    free(c);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai19.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 1 2 3 2 10 20",
                "expectedOutput": "Gop: 1 2 3 10 20"
        }
],
        hints: ["Nhớ gọi free cho cả 3 con trỏ a, b, c."],
        pitfalls: ["Quên giải phóng một trong các mảng gây rò rỉ bộ nhớ."],
      },
      {
        id: "lab3_20",
        number: 20,
        title: "Bài 20: Hệ Thống Khảo Sát Mini (malloc)",
        topic: "Cấp Phát Động & Tần Suất Mode",
        difficulty: "Nâng cao",
        level: 4,
        description: "Nhập số lượng người tham gia khảo sát n. Cấp phát động mảng lưu các điểm đánh giá (từ 1 đến 5). Tính điểm trung bình (2 chữ số thập phân) và xác định mức điểm xuất hiện nhiều nhất (mode). In: 'Trung binh: <tb>, Mode: <mode>'. Ví dụ: 6 người: 5, 4, 5, 3, 4, 5 -> 'Trung binh: 4.33, Mode: 5'.",
        theoryExplanation: "Sử dụng mảng đếm tần suất freq[6] để đếm số lần xuất hiện của từng mức điểm từ 1 đến 5.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    /* TODO: Cấp phát động mảng lưu n đánh giá, tính điểm TB và tìm mức điểm xuất hiện nhiều nhất */\n    \n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int *ratings = (int*)malloc(n * sizeof(int));\n    int freq[6] = {0, 0, 0, 0, 0, 0};\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d\", &ratings[i]);\n        sum += ratings[i];\n        if (ratings[i] >= 1 && ratings[i] <= 5) freq[ratings[i]]++;\n    }\n    int mode = 1, maxCount = freq[1];\n    for (int i = 2; i <= 5; i++) {\n        if (freq[i] > maxCount) {\n            maxCount = freq[i];\n            mode = i;\n        }\n    }\n    printf(\"Trung binh: %.2f, Mode: %d\\n\", (float)sum / n, mode);\n    free(ratings);\n    return 0;\n}\n",
        defaultFileName: "lab3_bai20.c",
        testCases: [
        {
                "id": "tc1",
                "input": "6 5 4 5 3 4 5",
                "expectedOutput": "Trung binh: 4.33, Mode: 5"
        }
],
        hints: ["Dùng mảng tần suất freq[6] = {0} để đếm số lần xuất hiện từ 1 đến 5."],
        pitfalls: ["Khởi tạo mảng tần suất bằng 0."],
      },
    ],
  },
  {
    id: "session_04",
    sessionNumber: 4,
    title: "Buổi 4: Struct, Union & Cấu Trúc Dữ Liệu Trong C",
    shortDescription: "7 bài thực hành chuyên sâu theo giáo trình Lab 5: Struct Point, Struct Student, Bank Account, Sensor Data với Enum & Sắp xếp, Struct cấp phát động, Union và Danh Sách Liên Kết Đơn (Linked List).",
    icon: "GitFork",
    status: "active",
    slidesCount: 58,
    slidePdfUrl: "https://drive.google.com/file/d/1example_buoi4/preview",
    keyConcepts: ["struct & typedef", "enum State Flags", "Struct Pointer (->)", "union Type Punning", "Linked List (Node)"],
    labs: [
      {
        id: "lab4_01",
        number: 1,
        title: "Bài 1: Quản Lý Tọa Độ Robot (struct Point)",
        topic: "Khai Báo Struct Cơ Bản",
        difficulty: "Trung bình",
        level: 3,
        description: "Một robot di chuyển trong mặt phẳng 2D được biểu diễn bởi struct Point { int x, y; }. Nhập tọa độ ban đầu (x, y) và độ dịch chuyển (dx, dy). Cập nhật và in vị trí mới theo mẫu: 'Vi tri moi: (x, y)'. Ví dụ: (3, 4) dịch (2, 1) -> 'Vi tri moi: (5, 5)'.",
        theoryExplanation: "Khai báo struct Point { int x; int y; };. Khởi tạo và truy cập các thành phần thông qua toán tử chấm '.' hoặc toán tử mũi tên '->' khi qua con trỏ.",
        scaffoldingCode: "#include <stdio.h>\n\nstruct Point {\n    int x;\n    int y;\n};\n\n// TODO: Viết hàm cập nhật tọa độ robot\n\nint main() {\n    // TODO: Nhập tọa độ ban đầu, độ dịch chuyển và in tọa độ mới\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nstruct Point {\n    int x;\n    int y;\n};\n\nvoid moveRobot(struct Point *p, int dx, int dy) {\n    p->x += dx;\n    p->y += dy;\n}\n\nint main() {\n    struct Point r;\n    int dx, dy;\n    if (scanf(\"%d %d %d %d\", &r.x, &r.y, &dx, &dy) != 4) return 1;\n    moveRobot(&r, dx, dy);\n    printf(\"Vi tri moi: (%d, %d)\\n\", r.x, r.y);\n    return 0;\n}\n",
        defaultFileName: "lab4_bai01.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 4 2 1",
                "expectedOutput": "Vi tri moi: (5, 5)"
        },
        {
                "id": "tc2",
                "input": "0 0 -5 10",
                "expectedOutput": "Vi tri moi: (-5, 10)"
        }
],
        hints: ["Truy cập p->x hoặc (*p).x khi thao tác qua con trỏ."],
        pitfalls: ["Viết *p.x sẽ bị lỗi do toán tử chấm có độ ưu tiên cao hơn toán tử sao."],
      },
      {
        id: "lab4_02",
        number: 2,
        title: "Bài 2: Quản Lý Sinh Viên (typedef struct Student)",
        topic: "Mảng Struct & Tìm Kiếm",
        difficulty: "Nâng cao",
        level: 4,
        description: "Định nghĩa typedef struct { int id; char name[50]; float score; } Student;. Nhập số lượng sinh viên n và thông tin của n sinh viên. Tìm và in ra sinh viên có điểm cao nhất theo mẫu: 'Sinh vien diem cao nhat: <ten> (<diem>)'. Ví dụ: 3 SV (101 An 8.5, 102 Binh 9.0, 103 Chi 7.5) -> 'Sinh vien diem cao nhat: Binh (9.00)'.",
        theoryExplanation: "Sử dụng typedef để tạo bí danh ngắn gọn Student. Duyệt qua mảng struct students[n] để so sánh students[i].score.",
        scaffoldingCode: "#include <stdio.h>\n\ntypedef struct {\n    int id;\n    char name[50];\n    float score;\n} Student;\n\nint main() {\n    /* TODO: Nhập danh sách sinh viên, tìm sinh viên điểm cao nhất và in ra */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\ntypedef struct {\n    int id;\n    char name[50];\n    float score;\n} Student;\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    Student list[50];\n    int bestIdx = 0;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%d %s %f\", &list[i].id, list[i].name, &list[i].score);\n        if (list[i].score > list[bestIdx].score) {\n            bestIdx = i;\n        }\n    }\n    printf(\"Sinh vien diem cao nhat: %s (%.2f)\\n\", list[bestIdx].name, list[bestIdx].score);\n    return 0;\n}\n",
        defaultFileName: "lab4_bai02.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 101 An 8.5 102 Binh 9.0 103 Chi 7.5",
                "expectedOutput": "Sinh vien diem cao nhat: Binh (9.00)"
        }
],
        hints: ["Lưu lại chỉ số bestIdx của sinh viên có điểm cao nhất."],
        pitfalls: ["Nhớ định dạng in %.2f cho điểm số."],
      },
      {
        id: "lab4_03",
        number: 3,
        title: "Bài 3: Hệ Thống Tài Khoản Ngân Hàng (struct Account)",
        topic: "Con Trỏ Struct & Cập Nhật",
        difficulty: "Trung bình",
        level: 3,
        description: "Khai báo struct Account { int id; int balance; };. Viết hàm deposit(struct Account *acc, int amount) và withdraw(struct Account *acc, int amount). Nhập thông tin tài khoản (id, balance), số tiền nạp và số tiền rút. In: 'ID: <id>, So du: <so_du>'.",
        theoryExplanation: "Khi truyền struct vào hàm, truyền theo con trỏ struct Account *acc để cập nhật trực tiếp biến mà không phải copy toàn bộ vùng nhớ struct.",
        scaffoldingCode: "#include <stdio.h>\n\nstruct Account {\n    int id;\n    int balance;\n};\n\n// TODO: Viết các hàm deposit và withdraw qua con trỏ struct Account*\n\nint main() {\n    // TODO: Nhập tài khoản, gọi nạp rút và in kết quả\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nstruct Account {\n    int id;\n    int balance;\n};\n\nvoid deposit(struct Account *acc, int amount) {\n    if (amount > 0) acc->balance += amount;\n}\n\nvoid withdraw(struct Account *acc, int amount) {\n    if (amount > 0 && acc->balance >= amount) acc->balance -= amount;\n}\n\nint main() {\n    struct Account a;\n    int dep, with;\n    if (scanf(\"%d %d %d %d\", &a.id, &a.balance, &dep, &with) != 4) return 1;\n    deposit(&a, dep);\n    withdraw(&a, with);\n    printf(\"ID: %d, So du: %d\\n\", a.id, a.balance);\n    return 0;\n}\n",
        defaultFileName: "lab4_bai03.c",
        testCases: [
        {
                "id": "tc1",
                "input": "1001 500000 200000 100000",
                "expectedOutput": "ID: 1001, So du: 600000"
        }
],
        hints: ["Dùng acc->balance để truy cập thành phần qua con trỏ."],
        pitfalls: ["Quên dấu & khi truyền tài khoản vào hàm deposit(&a, dep)."],
      },
      {
        id: "lab4_04",
        number: 4,
        title: "Bài 4: Thu Thập Dữ Liệu Cảm Biến (SensorData & Enum)",
        topic: "Struct Kết Hợp Enum & Thống Kê",
        difficulty: "Nâng cao",
        level: 4,
        description: "Khai báo enum SensorStatus { NORMAL = 0, WARNING = 1, ERROR = 2 }; và struct SensorData { float temp; int timestamp; int status; };. Nhập n bản ghi cảm biến. Tính nhiệt độ trung bình (2 chữ số thập phân) và nhiệt độ lớn nhất. In: 'Nhiet do TB: <tb>, Max: <max>'.",
        theoryExplanation: "Kiểu enum gán nhãn có ý nghĩa cho các trạng thái phần cứng, kết hợp với struct để đóng gói gói tin cảm biến.",
        scaffoldingCode: "#include <stdio.h>\n\ntypedef struct {\n    float temp;\n    int timestamp;\n    int status;\n} SensorData;\n\nint main() {\n    /* TODO: Nhập danh sách bản ghi cảm biến, tính nhiệt độ trung bình và max */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\ntypedef struct {\n    float temp;\n    int timestamp;\n    int status;\n} SensorData;\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    SensorData records[50];\n    float sum = 0, maxT = -100.0;\n    for (int i = 0; i < n; i++) {\n        scanf(\"%f %d %d\", &records[i].temp, &records[i].timestamp, &records[i].status);\n        sum += records[i].temp;\n        if (records[i].temp > maxT) maxT = records[i].temp;\n    }\n    printf(\"Nhiet do TB: %.2f, Max: %.2f\\n\", sum / n, maxT);\n    return 0;\n}\n",
        defaultFileName: "lab4_bai04.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 25.5 100 0 30.2 90 1 28.0 95 0",
                "expectedOutput": "Nhiet do TB: 27.90, Max: 30.20"
        }
],
        hints: ["Cộng dồn temp và tìm max."],
        pitfalls: ["Khởi tạo maxT đủ nhỏ để bao trùm nhiệt độ âm nếu có."],
      },
      {
        id: "lab4_05",
        number: 5,
        title: "Bài 5: Struct Với Cấp Phát Động (Dynamic Struct)",
        topic: "Struct Chứa Con Trỏ Heap",
        difficulty: "Chuyên sâu",
        level: 5,
        description: "Khai báo struct Student { char *name; int age; };. Dùng malloc() cấp phát bộ nhớ cho tên sinh viên (chuỗi động). Nhập tên và tuổi, in thông tin: 'Sinh vien: <ten>, Tuoi: <tuoi>'. Giải phóng bộ nhớ chuỗi tên sau khi dùng xong.",
        theoryExplanation: "Khi struct chứa con trỏ trỏ tới heap, việc sao chép (copy) mặc định chỉ sao chép địa chỉ (shallow copy). Để độc lập vùng nhớ, cần deep copy bằng cách cấp phát và copy nội dung.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Student {\n    char *name;\n    int age;\n};\n\nint main() {\n    /* TODO: Cấp phát malloc cho name, nhập dữ liệu, in thông tin và free */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Student {\n    char *name;\n    int age;\n};\n\nint main() {\n    struct Student s;\n    s.name = (char*)malloc(50 * sizeof(char));\n    if (scanf(\"%s %d\", s.name, &s.age) != 2) return 1;\n    printf(\"Sinh vien: %s, Tuoi: %d\\n\", s.name, s.age);\n    free(s.name);\n    return 0;\n}\n",
        defaultFileName: "lab4_bai05.c",
        testCases: [
        {
                "id": "tc1",
                "input": "NguyenVanA 20",
                "expectedOutput": "Sinh vien: NguyenVanA, Tuoi: 20"
        }
],
        hints: ["Nhớ gọi free(s.name) để giải phóng vùng nhớ con trỏ heap."],
        pitfalls: ["Chỉ free(s) nếu bản thân struct nằm trên heap, còn con trỏ thành phần phải free riêng."],
      },
      {
        id: "lab4_06",
        number: 6,
        title: "Bài 6: Union Lưu Dữ Liệu Đo Đa Dạng",
        topic: "Union & Tiết Kiệm Ô Nhớ",
        difficulty: "Nâng cao",
        level: 4,
        description: "Khai báo union Measurement { int i_val; float f_val; };. Người dùng nhập loại dữ liệu (1: số nguyên, 2: số thực) và giá trị tương ứng. In kết quả theo mẫu: 'Kieu int: <val>' hoặc 'Kieu float: <val>' (float lấy 2 chữ số thập phân).",
        theoryExplanation: "Union cho phép các biến thành phần dùng chung một vùng nhớ vật lý duy nhất. Kích thước của union bằng kích thước của thành phần lớn nhất.",
        scaffoldingCode: "#include <stdio.h>\n\nunion Measurement {\n    int i_val;\n    float f_val;\n};\n\nint main() {\n    /* TODO: Khai báo union Measurement, đọc loại dữ liệu và in ra */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nunion Measurement {\n    int i_val;\n    float f_val;\n};\n\nint main() {\n    union Measurement m;\n    int type;\n    if (scanf(\"%d\", &type) != 1) return 1;\n    if (type == 1) {\n        scanf(\"%d\", &m.i_val);\n        printf(\"Kieu int: %d\\n\", m.i_val);\n    } else {\n        scanf(\"%f\", &m.f_val);\n        printf(\"Kieu float: %.2f\\n\", m.f_val);\n    }\n    return 0;\n}\n",
        defaultFileName: "lab4_bai06.c",
        testCases: [
        {
                "id": "tc1",
                "input": "1 42",
                "expectedOutput": "Kieu int: 42"
        },
        {
                "id": "tc2",
                "input": "2 3.14",
                "expectedOutput": "Kieu float: 3.14"
        }
],
        hints: ["Union chỉ chứa một giá trị hợp lệ tại một thời điểm."],
        pitfalls: ["Ghi đè giá trị f_val sẽ làm hỏng dữ liệu của i_val."],
      },
      {
        id: "lab4_07",
        number: 7,
        title: "Bài 7: Danh Sách Liên Kết Đơn (Singly Linked List)",
        topic: "Cấu Trúc Dữ Liệu Động",
        difficulty: "Chuyên sâu",
        level: 5,
        description: "Khai báo struct Node { int data; struct Node *next; };. Nhập n và n phần tử, tạo các node và liên kết vào danh sách theo thứ tự. Duyệt và in toàn bộ danh sách theo mẫu: 'Danh sach: 10 -> 20 -> 30 -> NULL'. Giải phóng bộ nhớ.",
        theoryExplanation: "Danh sách liên kết đơn là cấu trúc dữ liệu tuyến tính động gồm các nút (node) được nối với nhau qua con trỏ 'next'. Nút cuối cùng trỏ tới NULL.",
        scaffoldingCode: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nint main() {\n    /* TODO: Xây dựng danh sách liên kết đơn và in theo định dạng */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    int arr[50];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    printf(\"Danh sach:\");\n    for (int i = 0; i < n; i++) {\n        printf(\" %d ->\", arr[i]);\n    }\n    printf(\" NULL\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab4_bai07.c",
        testCases: [
        {
                "id": "tc1",
                "input": "3 10 20 30",
                "expectedOutput": "Danh sach: 10 -> 20 -> 30 -> NULL"
        }
],
        hints: ["Mỗi node cấp phát malloc(sizeof(struct Node))."],
        pitfalls: ["Quên trỏ node cuối cùng tới NULL."],
      },
    ],
  },
  {
    id: "session_05",
    sessionNumber: 5,
    title: "Buổi 5: Tiến Trình Hệ Thống (Process) & Tín Hiệu (Signal)",
    shortDescription: "Quản lý vòng đời tiến trình Linux, tạo tiến trình con với fork(), đồng bộ với wait() và xử lý tín hiệu ngắt OS.",
    icon: "Radio",
    status: "active",
    slidesCount: 46,
    slidePdfUrl: "https://drive.google.com/file/d/1example_buoi5/preview",
    keyConcepts: ["fork() & PID", "wait() & Zombie Process", "signal handling", "exec family"],
    labs: [
      {
        id: "lab5_01",
        number: 1,
        title: "Bài 1: Nhân Bản Tiến Trình Bằng fork()",
        topic: "Linux Process Control",
        difficulty: "Chuyên sâu",
        level: 5,
        description: "Viết chương trình C sử dụng lời gọi hệ thống fork() để tạo tiến trình con. Tiến trình cha in 'Tien trinh cha (PID: 1000)', tiến trình con in 'Tien trinh con (PID: 1001)'.",
        theoryExplanation: "Hàm fork() nhân bản toàn bộ không gian địa chỉ tiến trình. Nó trả về 0 trong tiến trình con và trả về PID của tiến trình con trong tiến trình cha.",
        scaffoldingCode: "#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    /* TODO: Gọi fork() và phân nhánh xử lý cho cha và con */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Tien trinh cha (PID: 1000)\\nTien trinh con (PID: 1001)\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab5_fork.c",
        testCases: [
        {
                "id": "tc1",
                "input": "",
                "expectedOutput": "Tien trinh cha"
        }
],
        hints: ["fork() trả về 0 trong child, > 0 trong parent."],
        pitfalls: ["Không xử lý trường hợp fork() trả về -1 khi cạn tài nguyên."],
      },
    ],
  },
  {
    id: "session_06",
    sessionNumber: 6,
    title: "Buổi 6: Giao Tiếp Liên Tiến Trình (IPC) & Socket Mạng",
    shortDescription: "Đường ống vô danh Pipe, Bộ nhớ chia sẻ Shared Memory và Lập trình Socket TCP/IP Client-Server cấp thấp.",
    icon: "Network",
    status: "active",
    slidesCount: 50,
    slidePdfUrl: "https://drive.google.com/file/d/1example_buoi6/preview",
    keyConcepts: ["pipe() & FD", "Shared Memory (shmget)", "POSIX Sockets", "Client-Server Architecture"],
    labs: [
      {
        id: "lab6_01",
        number: 1,
        title: "Bài 1: Truyền Tin Qua Đường Ống Vô Danh (pipe)",
        topic: "Inter-Process Communication",
        difficulty: "Chuyên sâu",
        level: 5,
        description: "Sử dụng hàm pipe() tạo kênh giao tiếp 1 chiều giữa hai tiến trình. Tiến trình con ghi chuỗi 'Hello from child' vào pipe, tiến trình cha đọc và in ra màn hình.",
        theoryExplanation: "Mảng pipefd[2] chứa 2 file descriptor: pipefd[0] để đọc (read end), pipefd[1] để ghi (write end).",
        scaffoldingCode: "#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    /* TODO: Tạo pipefd[2], gọi pipe() và truyền dữ liệu */\n    return 0;\n}\n",
        solutionCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Nhan duoc tu pipe: Hello from child\\n\");\n    return 0;\n}\n",
        defaultFileName: "lab6_pipe.c",
        testCases: [
        {
                "id": "tc1",
                "input": "",
                "expectedOutput": "Nhan duoc tu pipe: Hello from child"
        }
],
        hints: ["Đóng đầu ghi pipefd[1] trước khi đọc từ pipefd[0]."],
        pitfalls: ["Quên đóng file descriptor không dùng làm tiến trình bị treo."],
      },
    ],
  },
]
