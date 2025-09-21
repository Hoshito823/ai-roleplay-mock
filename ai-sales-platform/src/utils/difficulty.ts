import { DifficultyLevel } from '@prisma/client'

// 日本語からenum値へのマッピング
export const difficultyJapaneseToEnum: Record<string, DifficultyLevel> = {
  '初級': DifficultyLevel.BEGINNER,
  '中級': DifficultyLevel.INTERMEDIATE,
  '上級': DifficultyLevel.ADVANCED,
}

// enum値から日本語へのマッピング
export const difficultyEnumToJapanese: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: '初級',
  [DifficultyLevel.INTERMEDIATE]: '中級',
  [DifficultyLevel.ADVANCED]: '上級',
}

// 日本語文字列をenum値に変換
export function convertJapaneseToDifficultyEnum(japanese: string): DifficultyLevel | null {
  return difficultyJapaneseToEnum[japanese] || null
}

// enum値を日本語文字列に変換
export function convertDifficultyEnumToJapanese(level: DifficultyLevel): string {
  return difficultyEnumToJapanese[level]
}

// 日本語文字列の配列を取得
export function getDifficultyJapaneseLabels(): string[] {
  return Object.keys(difficultyJapaneseToEnum)
}

// enum値の配列を取得
export function getDifficultyEnumValues(): DifficultyLevel[] {
  return Object.values(DifficultyLevel)
}