export interface PartSkill {
  id: string;
  name: string;
  category: string;
  timing: string;
  cost: string;
  range: string;
  effect: string;
  actionBonus: number;
  isUsed: boolean;
  isBroken: boolean;
}

export interface Attachment {
  id: string;
  target: string;
  table: string;
  type: string;
  madness: number;
  insanityEffect: string;
}

export interface MemoryFragment {
  id: string;
  number: string;
  name: string;
  detail: string;
}

export interface SessionRecord {
  id: string;
  combatFavor: number;
  personalFavor: number;
  memo: string;
}

export const MANEUVER_CATEGORIES = ['ポジション', 'メインクラス', 'サブクラス', '頭', '腕', '胴', '脚'] as const;

export const SKILL_SOURCE_CATEGORIES: readonly string[] = ['ポジション', 'メインクラス', 'サブクラス'];

export const BREAKABLE_CATEGORIES: readonly string[] = ['頭', '腕', '胴', '脚'];

export const MANEUVER_GROUPS: { label: string; categories: readonly string[] }[] = [
  { label: 'スキル', categories: SKILL_SOURCE_CATEGORIES },
  { label: '頭', categories: ['頭'] },
  { label: '腕', categories: ['腕'] },
  { label: '胴', categories: ['胴'] },
  { label: '脚', categories: ['脚'] },
];

export const TIMINGS = ['オート', 'アクション', 'ジャッジ', 'ダメージ', 'ラピッド'] as const;

export const BASE_ACTION_VALUE = 6;

export const MAX_MADNESS = 4;
export const DEFAULT_MADNESS = 3;

const defaultPart = (
  category: string,
  name: string,
  timing: string,
  cost: string,
  range: string,
  effect: string,
  actionBonus = 0,
): PartSkill => ({
  id: crypto.randomUUID(),
  name,
  category,
  timing,
  cost,
  range,
  effect,
  actionBonus,
  isUsed: false,
  isBroken: false,
});

export const createDefaultParts = (): PartSkill[] => [
  defaultPart('頭', 'のうみそ', 'オート', 'なし', '自身', '行動値+2', 2),
  defaultPart('頭', 'めだま', 'オート', 'なし', '自身', '行動値+1', 1),
  defaultPart('頭', 'あご', 'アクション', '2', '0', '肉弾攻撃１'),
  defaultPart('腕', 'こぶし', 'アクション', '2', '0', '肉弾攻撃１'),
  defaultPart('腕', 'うで', 'ジャッジ', '1', '0', '支援１'),
  defaultPart('腕', 'かた', 'アクション', '4', '自身', '移動１'),
  defaultPart('胴', 'せぼね', 'アクション', '1', '自身', '次カウントで使うマニューバ１つのコスト-1'),
  defaultPart('胴', 'はらわた', 'オート', 'なし', 'なし', 'なし'),
  defaultPart('胴', 'はらわた', 'オート', 'なし', 'なし', 'なし'),
  defaultPart('脚', 'ほね', 'アクション', '3', '自身', '移動１'),
  defaultPart('脚', 'ほね', 'アクション', '3', '自身', '移動１'),
  defaultPart('脚', 'あし', 'ジャッジ', '1', '0', '妨害１'),
];

export const POSITIONS = ['アリス', 'ホリック', 'オートマトン', 'ジャンク', 'コート', 'ソロリティ'] as const;

export const CLASSES = [
  'ステーシー',
  'タナトス',
  'ゴシック',
  'レクイエム',
  'バロック',
  'ロマネスク',
  'サイケデリック',
] as const;

export const INITIAL_PLACEMENTS = ['煉獄', '花園', '楽園'] as const;

export const PART_TYPES = ['武装', '変異', '改造'] as const;
export type PartType = (typeof PART_TYPES)[number];

export type ActionValueRow = Record<PartType, number>;

export const emptyActionValueRow = (): ActionValueRow => ({ 武装: 0, 変異: 0, 改造: 0 });

export const CLASS_ACTION_VALUES: Record<string, ActionValueRow> = {
  ステーシー: { 武装: 1, 変異: 1, 改造: 0 },
  タナトス: { 武装: 1, 変異: 0, 改造: 1 },
  ゴシック: { 武装: 0, 変異: 1, 改造: 1 },
  レクイエム: { 武装: 1, 変異: 0, 改造: 1 },
  バロック: { 武装: 0, 変異: 2, 改造: 0 },
  ロマネスク: { 武装: 0, 変異: 0, 改造: 2 },
  サイケデリック: { 武装: 0, 変異: 0, 改造: 1 },
};

export const ATTACHMENT_TABLES = ['姉妹', '中立', '敵'] as const;

export const ATTACHMENT_TYPES: Record<string, string[]> = {
  姉妹: ['嫌悪', '独占', '依存', '執着', '恋心', '対抗', '友情', '保護', '憧憬', '信頼'],
  中立: ['忌避', '嫉妬', '依存', '憐憫', '感謝', '悔恨', '期待', '保護', '尊敬', '信頼'],
  敵: ['恐怖', '隷属', '不安', '憐憫', '愛憎', '悔恨', '軽蔑', '憤怒', '怨念', '憎悪'],
};

export interface BasicInfo {
  furigana: string;
  name: string;
  ageAtDeath: string;
  gender: string;
  height: string;
  weight: string;
  suggestion: string;
  initialPlacement: string;
}

export const emptyBasicInfo = (): BasicInfo => ({
  furigana: '',
  name: '',
  ageAtDeath: '',
  gender: '',
  height: '',
  weight: '',
  suggestion: '',
  initialPlacement: INITIAL_PLACEMENTS[0],
});

export interface CharacterDesign {
  position: string;
  mainClass: string;
  subClass: string;
  bonusType: PartType | null;
  favor: ActionValueRow;
}

export const emptyCharacterDesign = (): CharacterDesign => ({
  position: POSITIONS[0],
  mainClass: CLASSES[0],
  subClass: CLASSES[0],
  bonusType: null,
  favor: emptyActionValueRow(),
});

export interface Character {
  id: string;
  ownerId: string;
  updatedAt: string;
  basicInfo: BasicInfo;
  design: CharacterDesign;
  parts: PartSkill[];
  memoryFragments: MemoryFragment[];
  attachments: Attachment[];
  sessionRecords: SessionRecord[];
  memo: string;
}

export const createDefaultCharacter = (ownerId: string): Character => ({
  id: crypto.randomUUID(),
  ownerId,
  updatedAt: new Date().toISOString(),
  basicInfo: emptyBasicInfo(),
  design: emptyCharacterDesign(),
  parts: createDefaultParts(),
  memoryFragments: [],
  attachments: [],
  sessionRecords: [],
  memo: '',
});

