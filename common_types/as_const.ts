/*
 *as constを使用して、オブジェクトのプロパティをリテラル型として扱う型をまとめたファイル
 *
 */
// 見積状態 (システム値, 表示値)
export const MITSUMORI_STATUS = {
  CREATE: ['Create', '作成中'],
  PRINT: ['Print', '印刷済'],
  REGIST: ['Regist', '登録済'],
  DELETE: ['Delete', '削除'],
} as const;

// 見積の確度(システム値, 表示値)
export const KAKUDO = {
  A: ['A', 'A'],
  B: ['B', 'B'],
  C: ['C', 'C'],
  LOSE: ['Lose', '失注'],
} as const;

// 営業所(表示値,システム値)
export const EIGYOSHO = {
  ISHIKARI: ['Ishikari', '石狩'],
  KIYOTA: ['Kiyota', '清田'],
} as const;
