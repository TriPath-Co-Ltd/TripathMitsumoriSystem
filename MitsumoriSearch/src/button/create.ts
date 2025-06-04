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
import {
  getConfigSheet,
  getTantoNameByBQ,
  insertMitsumoriByBQ,
  openLink,
} from '../modules/common_modules';
import {
  MITUMORIFOLDERID,
  MITUMORITEMPLETESPREADID,
} from '../constans/sheet_constants';

export function create() {
  // configシート取得
  const tanto_id = String(getConfigSheet('tanto_id'));

  if (!tanto_id) {
    throw new Error('担当者IDが設定されていません。');
  }

  // 担当者名取得
  const tanto_name = getTantoNameByBQ(tanto_id);

  console.log(tanto_name);

  // 見積テンプレートシートを開く
  const file = DriveApp.getFileById(MITUMORITEMPLETESPREADID);

  // 見積フォルダ取得
  const folder = DriveApp.getFolderById(MITUMORIFOLDERID);

  // 日付データ取得
  const today = new Date();
  const strTime = Utilities.formatDate(today, 'JST', 'yyyy-MM-dd_HH:mm:ss');

  // コピーの実行
  const spreadName = `見積_片山_${strTime}`;
  const copyFile = file.makeCopy(spreadName, folder);
  const activateMitsumoriSpreadId = copyFile.getId();

  // リンクを開く
  openLink(activateMitsumoriSpreadId);

  // BigQuery登録
  insertMitsumoriByBQ(activateMitsumoriSpreadId, spreadName, tanto_id);
}
