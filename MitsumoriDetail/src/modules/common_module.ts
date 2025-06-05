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
// eslint-disable-next-line n/no-unpublished-import
import { updateBQ } from '../../../common_src/bigquery';
// eslint-disable-next-line n/no-unpublished-import
import { PROJECT_CONSTANTS } from '../../../common_src/project_constants';

// 特定図形を取得する関数
export function getReferenceShape(
  activeSheet: GoogleAppsScript.Spreadsheet.Sheet | null,
  targetShapeName: string
): GoogleAppsScript.Spreadsheet.Drawing | undefined {
  // 図形オブジェクト群を取得
  const shapes = activeSheet ? activeSheet.getDrawings() : [];

  // 対象オブジェクトを検索して返却
  return shapes.find(shape => shape.getOnAction() === targetShapeName);
}

/**
 * Mitsumoriの情報を更新する関数
 * @param {string} spread_id - スプレッドシートのID
 * @param {string} tanto_id - 担当者のID
 * @param {string} customer - 顧客名
 * @param {string} customer_tanto - 顧客担当者名
 * @param {string} kenmei - 件名
 * @param {number} totalSum - 合計金額
 */
export function updateMitsumori(
  spread_id: string,
  tanto_id: string,
  customer: string,
  customer_tanto: string,
  kenmei: string,
  totalSum: number
) {
  const value = {
    tanto_id: tanto_id,
    customer: customer,
    customer_tanto: customer_tanto,
    kenmei: kenmei,
    update_datetime: new Date().toISOString(),
    total_sum: totalSum,
  };

  // BigQueryの見積データを更新
  updateBQ(
    PROJECT_CONSTANTS.BQ_TABLE_OVERVIEW,
    value,
    `spread_id = '${spread_id}'`
  );
}
