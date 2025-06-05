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
  const result = getMitsumoriList(SearchTantoId, '', '');

  // 検索結果が空の場合はアラートを表示
  if (!result || result.length === 0) {
    SpreadsheetApp.getUi().alert('見積もりデータが見つかりません。');
    return;
  }

  // 結果をメニューシートに書き込む
  const startRow = COLUMN_TITLE_ROW_COUNT + 1; // 書き込み開始行
  const startColumn = 2; // 書き込み開始列

  const links: string[][] = [];
  const state: string[][] = [];
  const mitsumoriDate: string[][] = [];
  const eigyoshos: string[][] = [];
  const tantos: string[][] = [];
  const customers: string[][] = [];
  const kenmei: string[][] = [];
  const kakudos: string[][] = [];
  const total_sums: number[][] = [];
  const delivery_dates: string[][] = [];

  // 項目数の初期化
  //let fieldCount = 0;

  result.forEach(row => {
    let url: string;
    if (row.f) {
      row.f.forEach((value, i) => {
        //ハイバーリンク生成
        if (i === 0) {
          url = `https://docs.google.com/spreadsheets/d/${value.v}`;
        }
        if (i === 1) {
          const link = `=HYPERLINK("${url}", "${value.v}")`;
          links.push([link]);
        }
        if (i === 2) {
          state.push([value.v ? String(value.v) : '']);
        }
        if (i === 3) {
          mitsumoriDate.push([value.v ? String(value.v) : '']);
        }
        if (i === 4) {
          eigyoshos.push([value.v ? String(value.v) : '']);
        }
        if (i === 5) {
          tantos.push([value.v ? String(value.v) : '']);
        }
        if (i === 6) {
          customers.push([value.v ? String(value.v) : '']);
        }
        if (i === 7) {
          kenmei.push([value.v ? String(value.v) : '']);
        }
        if (i === 8) {
          kakudos.push([value.v ? String(value.v) : '']);
        }
        if (i === 9) {
          total_sums.push([value.v ? Number(value.v) : 0]);
        }
        if (i === 10) {
          delivery_dates.push([value.v ? String(value.v) : '']);
        }
      });
    }
  });
  // 書き込み範囲を取得
  const writeRange = menuSheet.getRange(
    startRow,
    startColumn,
    result.length,
    11 // 書き込む列数
  );
  // 書き込むデータを2次元配列にまとめる
  const writeData = links.map((link, index) => [
    link[0],
    state[index][0],
    mitsumoriDate[index][0],
    eigyoshos[index][0],
    tantos[index][0],
    customers[index][0],
    kenmei[index][0],
    kakudos[index][0],
    total_sums[index][0],
    delivery_dates[index][0],
  ]);
  // 書込み
  writeRange.setValues(writeData);
  // 書込み後、即時反映
  SpreadsheetApp.flush();
}
