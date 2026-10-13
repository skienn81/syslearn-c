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
  id: 'announcement_2026_10_13_v2',
  version: '2.2.0',
  timestamp: '13/10/2026',
  title: 'Kho Bài Tập C & Hệ Thống Vừa Được Cập Nhật!',
  summary: 'Hệ thống vừa cập nhật các bài tập C mới chuẩn kỳ thi thực hành Lập Trình Hệ Thống (LTHT) trên Linux. Bàn luyện code đã được tinh chỉnh giống chuẩn Linux Terminal & Vim thật.',
  newExercisesCount: 15,
  newExercisesList: [
    { id: 'lab1_01', title: 'Lệnh Linux cơ bản (pwd, ls, mkdir, cd)', level: 1, topic: 'Linux Shell' },
    { id: 'lab2_01', title: 'Tính tổng mảng và thao tác con trỏ', level: 2, topic: 'Pointers' },
    { id: 'lab3_01', title: 'Quản lý bộ nhớ động malloc & free', level: 3, topic: 'Dynamic Memory' },
    { id: 'lab4_01', title: 'Đọc ghi tệp tin nhị phân & Struct', level: 4, topic: 'File I/O & Struct' },
    { id: 'lab5_01', title: 'Tạo và đồng bộ tiến trình (fork & wait)', level: 5, topic: 'System Calls' },
  ],
  notes: [
    'Tự động lưu mã nguồn liên tục: F5 trình duyệt không bao giờ bị mất bài.',
    'Chuẩn phản xạ Vim: Trong chế độ -- INSERT --, bạn bấm phím [Esc] để về NORMAL trước khi dùng :wq hoặc Chạy Thử.',
    'Chạy Thử: Tự động chuyển sang Terminal Linux để kiểm tra cú pháp và cảnh báo GCC.',
    'Nộp Bài: Tự động chạy và chấm toàn bộ Test Cases.',
    'Bài tập mới sẽ tiếp tục được cập nhật liên tục trực tiếp từ giáo trình và đề thi!',
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
