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
import { CONFIG_SHEET_NAME } from '../constans/sheet_constants';
// eslint-disable-next-line n/no-unpublished-import
import { getRowBQ, insertBQ } from '../../../common_src/bigquery';
// eslint-disable-next-line n/no-unpublished-import
import { PROJECT_CONSTANTS } from '../../../common_src/project_constants';

/**
 * 設定シートから指定されたIDの値を取得する関数
 * @param {string} id - 取得したい設定のID
 * @returns {string | null} - 指定されたIDに対応する値。存在しない場合はnullを返す。
 */
export function getConfigSheet(id: string) {
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

// BigQueryから担当者名を取得する関数
export function getTantoNameByBQ(tanto_id: string): string {
  const result = getRowBQ(
    PROJECT_CONSTANTS.BQ_TABLE_TANTO,
    `SELECT tanto_name`,
    `WHERE tanto_id = '${tanto_id}'`
  );
  // 結果が空の場合はエラーを投げる
  if (!result || result.length === 0) {
    throw new Error(`担当者ID ${tanto_id} に対応する担当者が見つかりません。`);
  }
  // 結果の最初の行から担当者名を取得
  const tantoName = String(result[0]?.f?.[0]?.v); // f[0]は担当者名のカラム
  if (!tantoName) {
    throw new Error(
      `担当者ID ${tanto_id} に対応する担当者名が見つかりません。`
    );
  }
  return tantoName;
}

export function openLink(id: string) {
  const html = HtmlService.createHtmlOutput(
    '<script>window.open("https://docs.google.com/spreadsheets/d/' +
      id +
      '/edit?gid=0#gid=0"); google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showModelessDialog(html, ' ');
}

/*
 * BigQueryにデータを挿入する関数
 * @param {string} spreadId - スプレッドシートID
 * @param {string} spreadName - スプレッドシート名
 * @param {string} tanto_id - 担当者ID
 */
export function insertMitsumori(
  spreadId: string,
  spreadName: string,
  tanto_id: string
) {
  const values = {
    spread_id: spreadId,
    spread_name: spreadName,
    tanto_id: tanto_id,
    created_at: new Date().toISOString(),
  };
  // BigQueryにデータを挿入
  insertBQ(PROJECT_CONSTANTS.BQ_TABLE_OVERVIEW, values);
}

// BigQueryから検索条件を入れて見積一覧情報を取得する関数
export function getMitsumoriList(
  tanto_id: string,
  customer: string,
  kenmei: string
): GoogleAppsScript.BigQuery.Schema.TableRow[] {
  // セレクト句を定義
  const selectClause = `
    SELECT
      spread_id,
      spread_name,
      tanto_id,
      customer,
      customer_tanto,
      kenmei,
      update_datetime,
      total_sum,
      delivery_date,
      state,
      created_at
  `;

  // 検索条件を組み立てる
  const whereConditions: string[] = [];

  // 担当者ID
  if (tanto_id) {
    whereConditions.push(`tanto_id = '${tanto_id}'`);
  }
  // 顧客名
  if (customer) {
    whereConditions.push(`customer LIKE '%${customer}%'`);
  }
  // 件名
  if (kenmei) {
    whereConditions.push(`kenmei LIKE '%${kenmei}%'`);
  }
  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';
  const result = getRowBQ(
    PROJECT_CONSTANTS.BQ_TABLE_OVERVIEW,
    selectClause,
    whereClause
  );
  return result || [];
}
