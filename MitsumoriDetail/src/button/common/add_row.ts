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

import { COLUMN_TITLE_ROW_COUNT } from '../../constans/sheet_constants';

/**
 * 行追加
 * 一覧画面、材料画面、副材料画面で使用。
 * ユーザーに追加行数(1～100行)を入力させ、指定された行数だけ空白行を追加。
 * 1行目の非表示の入力項目をコピーし、追加行に貼り付ける。
 * 追加行はA列の最終行の下に追加される。
 * @returns {void}
 */
export function addRow() {
  // 追加行数入力ボックス
  let addRowCount = 0;

  const ui = SpreadsheetApp.getUi();

  // 入力ボックスを表示
  const response = ui.prompt(
    '追加行数(1～100)を入力してください。',
    ui.ButtonSet.OK_CANCEL
  );

  // OKボタンがクリックされた場合の処理
  if (response.getSelectedButton() === ui.Button.OK) {
    // 入力文字列を整数に変換
    const responseInt = parseInt(response.getResponseText(), 10);

    // 入力文字列が0より大きく100以下なら追加行数として採用
    if (0 < responseInt && responseInt <= 100) {
      addRowCount = responseInt;
    }
    // 不採用
    else {
      ui.alert('入力文字列が不整合');
    }
  }

  // 入力文字列が問題なければ行追加
  if (addRowCount > 0) {
    const activeSheet = SpreadsheetApp.getActiveSheet();

    // A列最終行取得
    const lastRow = activeSheet
      .getRange(COLUMN_TITLE_ROW_COUNT, 1)
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow();

    // 最終列取得
    const lastCol = activeSheet.getLastColumn();

    // 空白行を入力行末に追加
    activeSheet.insertRowsAfter(lastRow, addRowCount);

    for (let i = 0; i < addRowCount; i++) {
      // 非表示の入力項目をコピーし、入力行末に貼付
      activeSheet
        .getRange(1, 1, 1, lastCol)
        .copyTo(activeSheet.getRange(lastRow + 1 + i, 1));
    }
  }
}
