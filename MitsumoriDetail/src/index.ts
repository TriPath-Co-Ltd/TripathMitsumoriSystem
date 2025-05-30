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
/* eslint-disable @typescript-eslint/no-unused-vars */

import { hello, getReferenceShape } from './modules/';

/* 定数 */
// LISTシートのタイトル行数
const COLUMN_TITLE_ROW_COUNT = 11;

/* グローバル変数
毎回取得するのは無駄なので、グローバル変数として宣言しておく
使用しない場合もあるため、nullで初期化しておく
*/

// 自スプレッドシートファイル
declare global {
  export let g_spreadSheet:
    | GoogleAppsScript.Spreadsheet.Spreadsheet
    | undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).g_spreadSheet = undefined;

// アクティブシート
declare global {
  export let g_activeSheet: GoogleAppsScript.Spreadsheet.Sheet | undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).g_activeSheet = undefined;

// スプレッドシートID
declare global {
  export let g_spreadSheetId: string | null;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).g_spreadSheetId = null;

/**
 * スプレッドシートのグローバル変数を設定する
 * スプレッドシートのID、アクティブなスプレッドシート、アクティブなシートを取得する
 */
function setGlobalSpreadsheetPara() {
  // アクティブスプレッドシート取得
  g_spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  // 現在開いているスプレッドシートのシートを取得
  g_activeSheet = SpreadsheetApp.getActiveSheet();
  // スプレッドシートIDの取得
  g_spreadSheetId = g_spreadSheet.getId();
}

/* 一覧シート_startボタン*/
function List_start() {
  // グローバル変数の設定
  setGlobalSpreadsheetPara();

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
  if (!flag && g_spreadSheet) {
    ScriptApp.newTrigger('onEditCustom')
      .forSpreadsheet(g_spreadSheet)
      .onEdit()
      .create();
  }

  // startボタンオブジェクトを取得
  const startButtonShape = getReferenceShape('List_start');

  // 取得オブジェクトを見えない位置に移動
  if (startButtonShape) {
    startButtonShape.setPosition(1, 1, 2000, 0);
  }

  // グレーアウトオブジェクトを取得
  const grayShape = getReferenceShape('List_grayout');

  // グレーアウトオブジェクトを見えない位置に移動
  if (grayShape) {
    grayShape.setPosition(1, 1, 2000, 0);
  }
}
