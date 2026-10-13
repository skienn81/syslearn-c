export interface BitboardState {
  bits8: number[] // array of 8 bits: 0 or 1
  bits16?: number[]
  bits32?: number[]
  activeBitWidth: 8 | 16 | 32
}

export interface StackFrameItem {
  id: string
  functionName: string
  returnAddress: string
  parameters: { name: string; type: string; value: string | number; address: string }[]
  localVariables: { name: string; type: string; value: string | number; address: string }[]
}

export interface MemorySegment {
  name: string
  range: string
  description: string
  color: string
}
