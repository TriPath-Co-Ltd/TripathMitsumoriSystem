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
import { getMitsumoriList } from '../modules/common_modules';
import { COLUMN_TITLE_ROW_COUNT } from '../constans/sheet_constants';

export function search() {
  // メニューシート取得
  const menuSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('メニュー');
  if (!menuSheet) {
    SpreadsheetApp.getUi().alert('メニューシートが見つかりません。');
    return;
  }

  // Pass appropriate values for tanto_id, customer, and kenmei
  const SearchTantoId = '218'; // Replace with actual value
  const MitsumoriOverviewList = getMitsumoriList(SearchTantoId, '', '');

  // 検索結果が空の場合はアラートを表示
  if (!MitsumoriOverviewList || MitsumoriOverviewList.length === 0) {
    SpreadsheetApp.getUi().alert('見積もりデータが見つかりません。');
    return;
  }

  // 結果をメニューシートに書き込む
  const startRow = COLUMN_TITLE_ROW_COUNT + 1; // 書き込み開始行
  const startColumn = 1; // 書き込み開始列

  // チェックボックスの列を追加
  const checkboxColumn = menuSheet.getRange(
    startRow,
    startColumn,
    MitsumoriOverviewList.length
  );
  checkboxColumn.insertCheckboxes();
  // チェックボックスの初期値を設定
  checkboxColumn.setValues(
    MitsumoriOverviewList.map(() => [false]) // 全ての行に対してチェックボックスを初期化
  );
  // 書き込み範囲を取得
  const writeRange = menuSheet.getRange(
    startRow,
    startColumn + 1, // チェックボックスの次の列から書き込み開始
    MitsumoriOverviewList.length,
    MitsumoriOverviewList[0].toSearchSheetRow().length // 書き込む列数
  );
  // 書込み
  writeRange.setValues(
    MitsumoriOverviewList.map(overview =>
      // 検索シートの行に変換
      overview.toSearchSheetRow()
    )
  );
  // 書込み後、即時反映
  SpreadsheetApp.flush();
}
