/**
 * Copyright 2025 Shoki Yamada
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  COLUMN_TITLE_ROW_COUNT,
  LIST_SHEET_NAME,
} from '../../../constans/sheet_constants';

export function Detail_Zairyo_update() {
  // スプレッドシート取得
  const g_spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  // アクティブなシートを取得
  const activeSheet = g_spreadSheet.getActiveSheet();
  // 材料費
  const zairyoCost = activeSheet
    .getRange(activeSheet.getLastRow(), activeSheet.getLastColumn())
    .getValue();

  // 取得したアクティブなシートのシート名を取得
  const activeSheetName = activeSheet.getSheetName();

  // 更新項目名と行を取得
  const koumoku_row = activeSheetName.split('_');

  // 更新項目名
  const koumoku = koumoku_row[1];

  // LISTシートの更新行数算出
  const targetRow = Number(koumoku_row[0]) + COLUMN_TITLE_ROW_COUNT + 1;

  // 一覧シート取得
  const listSheet = g_spreadSheet.getSheetByName(LIST_SHEET_NAME);
  // 一覧シートが存在しない場合はエラーを投げる
  if (!listSheet) {
    throw new Error(`Sheet with name "${LIST_SHEET_NAME}" does not exist.`);
  }

  // 更新項目の列数取得
  const textFinderResult = listSheet
    .getRange(COLUMN_TITLE_ROW_COUNT, 1, 1, listSheet.getLastColumn())
    .createTextFinder(koumoku)
    .findNext();

  // 更新項目が見つからない場合はエラーを投げる
  if (!textFinderResult) {
    throw new Error(`Column with name "${koumoku}" not found in the sheet.`);
  }

  // 更新項目の列番号を取得
  const targetCol = textFinderResult.getColumn();

  // 段取時間更新
  listSheet.getRange(targetRow, targetCol).setValue(zairyoCost);

  // ワークシートを更新セルを選択状態にしてアクティブ化
  listSheet.getRange(targetRow, targetCol).activate();
}
