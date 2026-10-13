import React, { useState } from 'react'
import { Stethoscope, CheckCircle2, AlertTriangle, Lightbulb, Wand2 } from 'lucide-react'
import { analyzeCCodeDiagnostics } from '../../core/c-sandbox/diagnosticRules'
import { DiagnosticIssue } from '../../types/cEngine'

const SAMPLE_ERRORS = [
  {
    title: 'Quên & trong scanf',
    code: `#include <stdio.h>

int main() {
    int age = 0;
    printf("Nhap tuoi: ");
    scanf("%d", age); // Thieu dau &
    printf("Tuoi: %d\\n", age);
    return 0;
}`,
  },
  {
    title: 'Chia số nguyên (5/9)',
    code: `#include <stdio.h>

int main() {
    float fahrenheit = 100.0f;
    float celsius = (5 / 9) * (fahrenheit - 32.0f); // 5/9 bi chat cut ve 0!
    printf("Celsius: %.2f\\n", celsius);
    return 0;
}`,
  },
  {
    title: 'Gán nhầm trong if',
    code: `#include <stdio.h>

int main() {
    int status = 0;
    if (status = 1) { // = la phep gan, phai la ==
        printf("Da kich hoat!\\n");
    }
    return 0;
}`,
  },
  {
    title: 'Chuỗi thiếu \\0',
    code: `#include <stdio.h>

int main() {
    char s[5] = "hello"; // "hello" can 6 bytes cho ca \\0
    printf("Chuoi: %s\\n", s);
    return 0;
}`,
  },
]

export const DiagnosticCoachView: React.FC = () => {
  const [code, setCode] = useState<string>(SAMPLE_ERRORS[0].code)
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>(analyzeCCodeDiagnostics(SAMPLE_ERRORS[0].code))

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    const issues = analyzeCCodeDiagnostics(newCode)
    setDiagnostics(issues)
  }

  const applyFix = (issue: DiagnosticIssue) => {
    if (issue.correctedCodeSnippet) {
      const lines = code.split('\n')
      lines[issue.line - 1] = issue.correctedCodeSnippet
      const newCode = lines.join('\n')
      handleCodeChange(newCode)
    }
  }

  return (
    <div className="space-y-4">
      {/* Sample Quick Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1422] border border-slate-800 rounded-xl p-3 text-xs">
        <span className="text-slate-400 font-medium">Thử nghiệm các lỗi C kinh điển:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_ERRORS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleCodeChange(s.code)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Split: Code Input & Diagnostics Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Code Input */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Mã nguồn C cần kiểm tra:</span>
            <span className="font-mono text-[11px] text-slate-500">Live Analyzer</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            rows={15}
            className="w-full bg-[#080c14] border border-slate-800 focus:border-sky-500 rounded-lg p-3 font-mono text-xs text-slate-200 outline-none leading-relaxed resize-none"
            placeholder="Dán code C của bạn vào đây..."
          />
        </div>

        {/* Right: Diagnostics Card List */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-semibold text-slate-200">
              Chẩn Đoán ({diagnostics.length} vấn đề)
            </span>
            {diagnostics.length === 0 && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Không phát hiện lỗi tiềm ẩn
              </span>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-auto max-h-[460px] pr-1">
            {diagnostics.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
                <span>Mã nguồn chuẩn, không dính cạm bẫy hệ thống nào.</span>
              </div>
            ) : (
              diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                    diag.type === 'error'
                      ? 'bg-rose-500/5 border-rose-500/25 text-rose-200'
                      : 'bg-amber-500/5 border-amber-500/25 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      {diag.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Dòng {diag.line}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-300">
                    <code>{diag.problematicCodeSnippet}</code>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-900/50 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    <strong className="text-sky-300 block mb-0.5">Bản chất hệ thống:</strong>
                    {diag.systemExplanation}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                    <span className="text-[11px] text-emerald-300">
                      💡 {diag.suggestedFix}
                    </span>

                    {diag.correctedCodeSnippet && (
                      <button
                        onClick={() => applyFix(diag)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Wand2 className="w-3 h-3" /> Sửa Tự Động
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
