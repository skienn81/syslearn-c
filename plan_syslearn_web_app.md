# Kế Hoạch Xây Dựng Web App: "SysLearn Studio"
### Nền Tảng Học Lập Trình Hệ Thống & C Thực Chiến Toàn Diện (Interactive Linux + Vim + C)

---

## 1. Mục Tiêu Dự Án (Product Vision)
Xây dựng một Web Application tương tác toàn diện dành riêng cho sinh viên học môn **Lập trình hệ thống**, giải quyết triệt để các rào cản:
1. **Sợ Vim:** Cung cấp môi trường luyện gõ Vim Dojo có hướng dẫn từng phím, mô phỏng chuẩn xác Normal Mode, Insert Mode và Command Mode (`:wq`, `:q!`), kèm theo Realtime Keystroke HUD.
2. **Sợ Terminal/Shell:** Cung cấp Terminal giả lập với hệ thống file ảo (Virtual File System) để gõ lệnh `gcc`, `./program`, `ls`, `mkdir`, `cd` trực tiếp trên web, hỗ trợ nhập `scanf` tương tác.
3. **Sợ Code C & Không biết tự viết:** Chế độ **Scaffolding (Khung xương -> Lấp logic)**, hướng dẫn tư duy từng bước thay vì chỉ đưa code hoàn chỉnh.
4. **Không hiểu thông báo lỗi:** Trợ lý chẩn đoán lỗi (Smart Diagnostic Coach) giải thích thông báo lỗi của GCC theo ngôn ngữ dễ hiểu bằng Tiếng Việt, chỉ ra vị trí sai và lý do tại sao sai (quên `&` trong `scanf`, chia số nguyên `9/5`, tràn mảng, quên `\0`...).
5. **Mô phỏng bộ nhớ trực quan:** Bảng hiển thị bitwise động (8-bit / 32-bit), Call Stack visualizer mô phỏng Stack Frame của các hàm.
6. **Kiến trúc mở rộng bài giảng (Modular Curriculum Engine):** Thiết kế sẵn sàng để nạp toàn bộ slide bài giảng, lý thuyết và bài tập các tuần tiếp theo (Process, Fork/Exec, Pipes, Shared Memory, Signals, Thread, Sockets...).

---

## 2. Kiến Trúc Kỹ Thuật (Architecture & Tech Stack)
* **Framework:** React 19 + TypeScript + Vite.
* **Styling:** Tailwind CSS + Lucide React (Cyberpunk / Terminal Dark Mode).
* **Terminal:** Custom ANSI Terminal Emulator với Virtual File System (VFS).
* **Vim Engine:** Custom Vim State Machine + Keystroke HUD.
* **C Engine:** In-Browser C AST Sandbox & Memory Tracker.
* **Diagnostic Coach:** Hệ thống chẩn đoán lỗi GCC bằng tiếng Việt.
* **Curriculum Engine:** Hỗ trợ nhiều học phần (Buổi 2 Bitwise/Memory, Buổi 3 Con trỏ/Struct, Buổi 4 Process/Signal, Buổi 5 IPC...).
