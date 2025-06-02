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
// Bigquery関係の定数
const PROJECT_ID = 'tripath-mitsumori-test';
// BigqueryOverViewテーブル更新
export function updateMitumoriOverviewData(
  spread_id: string,
  tanto_id: number, //【要修正】後でDBをstringに変更
  customer: string,
  customer_tanto: string,
  kenmei: string,
  totalSum: number
) {
  const query = `
  UPDATE tripath-mitsumori-test.Mitumori.Overview
  SET tanto_id = ${tanto_id}, customer = '${customer}', customer_tanto = '${customer_tanto}', kenmei = '${kenmei}', update_datetime = CURRENT_TIMESTAMP(), total_sum = ${totalSum}
  WHERE spread_id = '${spread_id}'
`;
  BigQuery.Jobs?.query(
    {
      query: query,
      useLegacySql: false,
      location: 'asia-northeast1',
    },
    PROJECT_ID
  );
}
