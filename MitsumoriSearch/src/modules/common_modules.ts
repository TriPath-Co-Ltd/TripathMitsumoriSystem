import { CONFIG_SHEET_NAME } from '../constans/sheet_constants';

/**
 * 設定シートから指定されたIDの値を取得する関数
 * @param {string} id - 取得したい設定のID
 * @returns {string | null} - 指定されたIDに対応する値。存在しない場合はnullを返す。
 */
export function getConfig(id: string) {
  // アクティブシートのインスタンス取得
  const menuSheet = SpreadsheetApp.getActiveSpreadsheet();
  // configシートのインスタンス取得
  const configSheet = menuSheet.getSheetByName(CONFIG_SHEET_NAME);

  // configシートが存在しない場合はnullを返す
  if (!configSheet) {
    return null;
  }

  // configシートの2行目以降のデータを取得
  const array_id = configSheet
    .getRange(2, 1, configSheet.getLastRow())
    .getValues()
    .flat();
  // 取得したデータからIDを検索し、対応する値を返す
  const array_value = configSheet
    .getRange(2, 2, configSheet.getLastRow())
    .getValues()
    .flat();
  // IDのインデックスを取得し、対応する値を返す
  const value_index = array_id.indexOf(id);
  if (value_index !== -1) {
    return array_value[value_index];
  }
  return null;
}
