import React, { useState } from 'react'
import { Binary, ArrowLeftRight, RefreshCw, Layers } from 'lucide-react'

export const BitwiseLab: React.FC = () => {
  // 8-bit board state
  const [bits8, setBits8] = useState<number[]>([0, 0, 0, 0, 1, 0, 1, 0]) // 10 in decimal
  
  // Register A & B for Bitwise Operations
  const [regA, setRegA] = useState<number>(0x05) // 0000 0101 (5)
  const [regB, setRegB] = useState<number>(0x09) // 0000 1001 (9)

  // Call Stack Simulator state
  const [activeCallDepth, setActiveCallDepth] = useState<number>(1)

  const getUint8Value = (bits: number[]) => {
    return bits.reduce((acc, bit, idx) => acc + (bit ? Math.pow(2, 7 - idx) : 0), 0)
  }

  const uint8Val = getUint8Value(bits8)
  const int8Val = uint8Val > 127 ? uint8Val - 256 : uint8Val // Two's complement
  const hexVal = uint8Val.toString(16).toUpperCase().padStart(2, '0')

  const toggleBit = (idx: number) => {
    const next = [...bits8]
    next[idx] = next[idx] === 1 ? 0 : 1
    setBits8(next)
  }

  const handleShiftLeft = () => {
    const next = [...bits8.slice(1), 0]
    setBits8(next)
  }

  const handleShiftRight = () => {
    const next = [0, ...bits8.slice(0, 7)]
    setBits8(next)
  }

  const resetBits = () => {
    setBits8([0, 0, 0, 0, 0, 0, 0, 0])
  }

  const opAnd = regA & regB
  const opOr = regA | regB
  const opXor = regA ^ regB
  const opNotA = (~regA) & 0xff

  const toBin8Str = (val: number) => {
    return (val & 0xff).toString(2).padStart(8, '0')
  }

  return (
    <div className="space-y-5">
      {/* 8-Bit Interactive Board & Value Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 8-Bit Board */}
        <div className="lg:col-span-2 bg-[#0e1422] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-100">Bảng 8-Bit Tương Tác (Nhấp chuột để lật bit)</h2>
            </div>
            <button
              onClick={resetBits}
              className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Bit Buttons */}
          <div className="grid grid-cols-8 gap-2 my-2">
            {bits8.map((bit, idx) => {
              const power = 7 - idx
              const bitWeight = Math.pow(2, power)
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500">2^{power}</span>
                  <button
                    onClick={() => toggleBit(idx)}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-colors border ${
                      bit === 1
                        ? 'bg-sky-400 text-slate-950 border-sky-300'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {bit}
                  </button>
                  <span className="text-[9px] font-mono text-slate-500">+{bit ? bitWeight : 0}</span>
                </div>
              )
            })}
          </div>

          {/* Shift Controls */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ArrowLeftRight className="w-3.5 h-3.5 text-sky-400" />
              <span>Phép toán dịch bit (Shift):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShiftLeft}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-mono font-medium transition-colors"
                title="Dịch trái: x << 1 (Nhân 2)"
              >
                &lt;&lt; Left Shift (x2)
              </button>
              <button
                onClick={handleShiftRight}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-mono font-medium transition-colors"
                title="Dịch phải: x >> 1 (Chia 2)"
              >
                Right Shift (&gt;&gt; / 2)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Values */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-100 mb-3">Giá Trị Tương Đương</h3>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Hexadecimal:</span>
              <span className="text-sky-400 font-semibold text-sm">0x{hexVal}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Unsigned Dec:</span>
              <span className="text-slate-100 font-semibold text-sm">{uint8Val}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Signed Dec (Bù 2):</span>
              <span className={`font-semibold text-sm ${int8Val < 0 ? 'text-amber-400' : 'text-slate-100'}`}>
                {int8Val}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Binary Form:</span>
              <span className="text-slate-200 font-medium tracking-wider">
                {bits8.slice(0, 4).join('')} {bits8.slice(4).join('')}
              </span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>Bản chất Bù 2:</strong> Bit cao nhất MSB = {bits8[0]} là bit dấu. Khi MSB = 1, giá trị âm = {uint8Val} - 256 = {int8Val}.
          </div>
        </div>
      </div>

      {/* Bitwise Logical Operations */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-100">Toán Tử Bitwise Cấp Thấp</h3>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Thanh ghi A:</span>
              <input
                type="number"
                min="0"
                max="255"
                value={regA}
                onChange={(e) => setRegA(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-14 bg-slate-950 border border-slate-800 text-sky-400 rounded px-2 py-0.5 text-center font-mono font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Thanh ghi B:</span>
              <input
                type="number"
                min="0"
                max="255"
                value={regB}
                onChange={(e) => setRegB(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-14 bg-slate-950 border border-slate-800 text-sky-400 rounded px-2 py-0.5 text-center font-mono font-medium"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>A &amp; B (AND)</span>
              <span className="text-[10px] text-sky-400">0x{opAnd.toString(16).toUpperCase()}</span>
            </div>
            <div className="text-slate-100 font-semibold text-sm tracking-wider">{toBin8Str(opAnd)}</div>
            <div className="text-[10px] text-slate-500">Dec: {opAnd}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>A | B (OR)</span>
              <span className="text-[10px] text-sky-400">0x{opOr.toString(16).toUpperCase()}</span>
            </div>
            <div className="text-slate-100 font-semibold text-sm tracking-wider">{toBin8Str(opOr)}</div>
            <div className="text-[10px] text-slate-500">Dec: {opOr}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>A ^ B (XOR)</span>
              <span className="text-[10px] text-sky-400">0x{opXor.toString(16).toUpperCase()}</span>
            </div>
            <div className="text-slate-100 font-semibold text-sm tracking-wider">{toBin8Str(opXor)}</div>
            <div className="text-[10px] text-slate-500">Dec: {opXor}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>~A (NOT)</span>
              <span className="text-[10px] text-sky-400">0x{opNotA.toString(16).toUpperCase()}</span>
            </div>
            <div className="text-slate-100 font-semibold text-sm tracking-wider">{toBin8Str(opNotA)}</div>
            <div className="text-[10px] text-slate-500">Dec: {opNotA}</div>
          </div>
        </div>
      </div>

      {/* Call Stack Visualizer */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">Mô Phỏng Ngăn Xếp Gọi Hàm (Call Stack)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCallDepth(prev => Math.min(3, prev + 1))}
              disabled={activeCallDepth >= 3}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-mono disabled:opacity-40"
            >
              + Gọi Hàm (PUSH)
            </button>
            <button
              onClick={() => setActiveCallDepth(prev => Math.max(1, prev - 1))}
              disabled={activeCallDepth <= 1}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-mono disabled:opacity-40"
            >
              - Trả Về (POP)
            </button>
          </div>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {activeCallDepth >= 3 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/30 flex flex-col gap-1">
              <div className="flex items-center justify-between font-semibold text-sky-300">
                <span>[Stack Frame 3]: helper_func(val = 10)</span>
                <span className="text-[10px] text-slate-500">0x7ffd9b8a3e40 (Đỉnh Stack)</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Biến cục bộ: result = 20 | Return address: swap+42
              </div>
            </div>
          )}

          {activeCallDepth >= 2 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-700 flex flex-col gap-1">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>[Stack Frame 2]: swap(int *a, int *b)</span>
                <span className="text-[10px] text-slate-500">0x7ffd9b8a3e20</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Biến cục bộ: temp = 5 | Return address: main+28
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span>[Stack Frame 1]: main(argc, argv)</span>
              <span className="text-[10px] text-slate-500">0x7ffd9b8a3e00 (Đáy Stack)</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Biến cục bộ: x = 5 (tại 0x7ffd9b8a3e04), y = 10 (tại 0x7ffd9b8a3e08)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
