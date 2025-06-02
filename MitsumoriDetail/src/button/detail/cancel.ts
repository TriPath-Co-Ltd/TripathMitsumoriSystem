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
import { LIST_SHEET_NAME } from '../../constans/sheet_constants';

/**
 * キャンセルボタンの処理
 */
export function Detail_cancel() {
  // 現在のスプレッドシートファイルを取得
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  // 一覧シートを取得
  const listSheet = spreadSheet.getSheetByName(LIST_SHEET_NAME);

  // アクティブなシートが存在する場合、元のシートに戻る
  if (listSheet) {
    spreadSheet.setActiveSheet(listSheet);
  }
}
