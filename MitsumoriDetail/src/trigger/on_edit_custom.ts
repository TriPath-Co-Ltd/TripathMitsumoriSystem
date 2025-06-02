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
import { LIST_SHEET_NAME } from '../constans/sheet_constants';
import { updateMitumoriOverviewData } from '../modules/bigquery';
//import { updateMitumoriOverviewData } from './bigquery';

/**
 * onEditイベントハンドラ
 * スプレッドシートの編集時に呼び出される関数
 * 純正のonEditイベントではライブラリの関数が呼び出せない？ため、カスタム関数として定義。
 * startボタン押下時にトリガイベントとして設定される。
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - onEditイベントオブジェクト
 */
export function onEditCustom(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const sheetname = sheet.getName();

  let updateFlag = false;

  if (sheetname === LIST_SHEET_NAME) {
    // 変更セルをA1表記で表記
    const notation = range.getA1Notation();
    // 変更セルがBigquery管理情報の場合
    if (
      notation === 'B4' ||
      notation === 'B6' ||
      notation === 'B8' ||
      notation === 'B9'
    ) {
      // BigQuery更新フラグを立てる
      updateFlag = true;
    }

    // 現在開いているスプレッドシートのシートを取得
    const activeSheet = SpreadsheetApp.getActiveSheet();

    // シート合計とDB合計を比較し、異なればBigQueryに書き込み
    const totalSum = activeSheet.getRange('B2').getValue();
    const dbSum = activeSheet.getRange('B3').getValue();
    if (totalSum !== dbSum) {
      updateFlag = true;
      activeSheet.getRange('B3').setValue(totalSum);
    }
    // BigQuery更新フラグが立っていれば、BigQueryに書き込み
    if (updateFlag) {
      const customer = activeSheet.getRange('B4').getValue();
      const kenmei = activeSheet.getRange('B6').getValue();
      const spreadSheetId = SpreadsheetApp.getActiveSpreadsheet().getId();

      // BigQuery更新
      updateMitumoriOverviewData(
        spreadSheetId,
        218,
        customer,
        '',
        kenmei,
        totalSum
      );
    }
  }

  // 材料シート
  if (sheetname.includes('材料')) {
    const notationColumn = range.getColumn();

    // 担当変更,お客様名変更,件名変更を検知し、黄色くする
    if (notationColumn === 6 || notationColumn === 7) {
      // 変更箇所を黄色する
      range.setBackground('yellow');
    }
  }
}
