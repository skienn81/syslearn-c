export interface SystemAnnouncement {
  id: string
  version: string
  timestamp: string
  title: string
  summary: string
  newExercisesCount: number
  newExercisesList: {
    id: string
    title: string
    level: number
    topic: string
  }[]
  notes: string[]
}

export const LATEST_ANNOUNCEMENT: SystemAnnouncement = {
  id: 'announcement_2026_10_14_v2_3',
  version: '2.3.0',
  timestamp: '14/10/2026',
  title: 'Cập Nhật 44 Bài Lab Giáo Trình Mới & Giảm Gợi Ý Mức 1 - 2!',
  summary: 'Hệ thống đã nạp trọn bộ 44 bài tập thực hành chính thức từ giáo trình Lab 2, Lab 3, Lab 4/5 Structs. Đặc biệt, hệ thống đã lược bỏ gợi ý ở Mức 1 & 2 để bạn tự tay gõ từng dòng mã C, giúp khắc sâu cú pháp cốt lõi.',
  newExercisesCount: 44,
  newExercisesList: [
    { id: 'lab2_01', title: 'Lab 2: Biến, Kiểu Dữ Liệu & In Ấn Cơ Bản', level: 1, topic: 'Variables & Formats' },
    { id: 'lab2_04', title: 'Lab 2: Xếp Loại Học Lực & Câu Lệnh Điều Kiện', level: 2, topic: 'Control Flow' },
    { id: 'lab2_07', title: 'Lab 2: Kiểm Tra Số Nguyên Tố & Vòng Lặp', level: 2, topic: 'Loops & Primes' },
    { id: 'lab2_10', title: 'Lab 2: Quản Lý Điểm Sinh Viên & Thống Kê Mảng', level: 2, topic: 'Arrays' },
    { id: 'lab2_14', title: 'Lab 2: Kiểm Tra Chuỗi Con (Substring Search)', level: 2, topic: 'Strings' },
    { id: 'lab3_01', title: 'Lab 3: Máy Tính Tiền Điện Bậc Thang', level: 2, topic: 'Branches & Rates' },
    { id: 'lab3_06', title: 'Lab 3: Đệ Quy Tính Tổng, Giai Thừa, Lũy Thừa', level: 2, topic: 'Recursion' },
    { id: 'lab3_11', title: 'Lab 3: Hoán Đổi & Trả Kết Quả Bằng Con Trỏ', level: 3, topic: 'Pointers' },
    { id: 'lab3_16', title: 'Lab 3: Cấp Phát Bộ Nhớ Động (malloc & realloc)', level: 3, topic: 'Dynamic Memory' },
    { id: 'lab4_01', title: 'Lab 4/5: Cấu Trúc Dữ Liệu struct, union & Danh Sách Liên Kết', level: 4, topic: 'Structs & Unions' },
  ],
  notes: [
    'Giảm gợi ý Mức 1 & 2: Buộc người học phải tự gõ #include, main(), kiểu dữ liệu và scanf để rèn phản xạ cú pháp thay vì phụ thuộc khung code có sẵn.',
    '44 bài Lab đa dạng: Bao trùm toàn diện từ Biến, Bitwise, Vòng lặp, Mảng, Chuỗi, Hàm đệ quy, Con trỏ, malloc/realloc đến struct/union và danh sách liên kết.',
    'Giả lập C Engine nâng cấp: Hỗ trợ chuẩn xác realloc(), struct, union, mảng struct, toán tử mũi tên -> và bóc tách định dạng %d, %f, %s, %u, 0x%08X.',
    'Lời giải mẫu luôn sẵn sàng: Khi bạn hoàn thành hoặc bí ý tưởng, bạn luôn có thể mở tab Lời giải để đối chiếu và học hỏi cách viết tối ưu.',
    'Học đan xen lý thuyết & thực hành: Đừng ngần ngại hỏi trực tiếp tại bàn học khi gặp khúc mắc cú pháp hoặc lỗi logic!',
  ]
}

export function hasUnreadAnnouncement(): boolean {
  try {
    const seenId = localStorage.getItem('syslearn_seen_announcement_id')
    return seenId !== LATEST_ANNOUNCEMENT.id
  } catch {
    return false
  }
}

export function markAnnouncementAsRead(): void {
  try {
    localStorage.setItem('syslearn_seen_announcement_id', LATEST_ANNOUNCEMENT.id)
  } catch {
    // ignore
  }
}
