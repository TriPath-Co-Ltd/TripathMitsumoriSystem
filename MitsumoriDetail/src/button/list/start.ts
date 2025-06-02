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
import { getReferenceShape } from '../../modules';

/* 一覧シート_startボタン*/
export function List_start() {
  // アクティブスプレッドシート取得
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  // 現在開いているスプレッドシートのシートを取得
  const activeSheet = SpreadsheetApp.getActiveSheet();
  //現在のトリガを取得
  const triggers = ScriptApp.getProjectTriggers();

  // 取得したトリガの中にonEditCustomがあるかのフラグ
  let flag = false;

  // onEditCustomトリガが設定されているか確認
  for (const v of triggers) {
    if (v.getHandlerFunction() === 'onEditCustom') {
      flag = true;
    }
  }

  // onEditCustomトリガが未設定ならトリガ設定
  if (!flag && spreadSheet) {
    ScriptApp.newTrigger('onEditCustom')
      .forSpreadsheet(spreadSheet)
      .onEdit()
      .create();
  }

  // startボタンオブジェクトを取得
  const startButtonShape = getReferenceShape(activeSheet, 'List_start');

  // 取得オブジェクトを見えない位置に移動
  if (startButtonShape) {
    startButtonShape.setPosition(1, 1, 2000, 0);
  }

  // グレーアウトオブジェクトを取得
  const grayShape = getReferenceShape(activeSheet, 'List_grayout');

  // グレーアウトオブジェクトを見えない位置に移動
  if (grayShape) {
    grayShape.setPosition(1, 1, 2000, 0);
  }
}
