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

import { getReferenceShape } from './modules/';

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

// UIオブジェクト
declare global {
  export let g_ui: GoogleAppsScript.Base.Ui | null;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).g_ui = null;

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
  // UIオブジェクトの取得
  g_ui = SpreadsheetApp.getUi();
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

/* 一覧シート_入力補助ボタン*/
function List_inputAssist() {
  // 入力補助設定
  const inputAssists: Array<InputAssist> = [
    new inputAssistSheet('材料', '材料'),
    new inputAssistReferenceShape('曲げ', 'List_referenceBending'),
  ];
  // グローバル変数の設定
  setGlobalSpreadsheetPara();

  // 現在のセルを取得
  const activeCell = g_activeSheet ? g_activeSheet.getActiveCell() : null;

  // 現在のセルの行番号取得
  const rowIndex = activeCell ? activeCell.getRow() : null;

  // 現在のセルの列番号取得
  const columnIndex = activeCell ? activeCell.getColumn() : null;

  // 入力補助範囲をチェック(とりあえず)
  if (
    !g_activeSheet ||
    rowIndex === null ||
    columnIndex === null ||
    rowIndex < COLUMN_TITLE_ROW_COUNT
  ) {
    // 範囲外なら何もしない
    return;
  }

  /*
    現在のセルの項目名取得
  */
  let columnTitle = '';

  // 結合セルは左上に値がセットされているので値を取得するまで繰り返し(なければ左にずれる、5回まで)
  for (let i = 0; i < 5; i++) {
    const targetColumnIndex = columnIndex - i;
    if (targetColumnIndex < 1) {
      break; // 無効な列インデックスの場合は終了
    }
    columnTitle = g_activeSheet
      .getRange(COLUMN_TITLE_ROW_COUNT, targetColumnIndex)
      .getValue();
    if (columnTitle !== '') {
      break;
    }
  }

  try {
    // 入力補助のタイプを取得
    const actionType = inputAssistByColumnName(columnTitle)?.getType;

    // 参照表示の場合
    if (actionType?.() === inputAssistType.referenceShape) {
      // 対応参照図オブジェクトを取得
      const targetShape = getReferenceShapeByColumnTitle(columnTitle);

      // 対応参照図を選択セルのそばに表示する
      if (targetShape) {
        targetShape.setPosition(rowIndex, columnIndex, -300, 0);
      }
      // 入力補助シート表示の場合
    } else if (actionType?.() === inputAssistType.inputSheet) {
      // 入力補助シート名取得(非表示のテンプレートシート名取得)
      const assistInfo = inputAssistByColumnName(columnTitle);
      const targetSheetName = assistInfo
        ? (assistInfo as inputAssistSheet).getSheetName()
        : undefined;

      // 入力補助シート名を行数を元に作成
      const copySheetName =
        String(rowIndex - COLUMN_TITLE_ROW_COUNT - 1).padStart(3, '0') +
        '_' +
        targetSheetName;

      // 入力補助シートがあるか確認
      let copySheet = g_spreadSheet
        ? g_spreadSheet.getSheetByName(copySheetName)
        : null;

      // 入力補助シートがなければ新規作成
      if (!copySheet) {
        // テンプレートシートをコピー
        if (g_spreadSheet && targetSheetName) {
          const sheet = g_spreadSheet.getSheetByName(targetSheetName);
          if (sheet) {
            copySheet = sheet.copyTo(g_spreadSheet);
          } else {
            copySheet = null; // Explicitly handle the case where the sheet is not found
          }
        }

        // コピーしたシートを指定入力補助シート名に変更する
        if (copySheet) {
          copySheet.setName(copySheetName);
        }
      }

      // コピーしたシートを表示化
      if (copySheet) {
        copySheet.showSheet();
      }

      // コピーしたシートをアクティブ化
      if (copySheet) {
        copySheet.activate();
      }
    }

    // actionTypeが取得できない→入力補助対象カラムではないと判定
  } catch (e) {
    // エラーが発生した場合は入力補助対象カラムではないと判断
    if (g_ui) {
      g_ui.alert('入力補助対象セルではありません。');
    }
    return;
  }
  /* 
    列名から入力補助を取得する
  */
  function inputAssistByColumnName(
    columnName: string
  ): InputAssist | undefined {
    return inputAssists.find(info => info.getColumnTitle() === columnName);
  }

  // 参照表示図形オブジェクト取得
  function getReferenceShapeByColumnTitle(columnTitle: string) {
    // 対象オブジェクト名をカラムタイトルから取得
    const assistInfo = inputAssistByColumnName(columnTitle);
    const targetShapeName = assistInfo ? assistInfo.getColumnTitle : undefined;

    // 対象オブジェクトを検索して返却
    return targetShapeName && typeof targetShapeName === 'string'
      ? getReferenceShape(targetShapeName)
      : undefined;
  }
}
