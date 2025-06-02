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

import {
  addRow,
  Detail_cancel,
  Detail_deleteSheet,
  Detail_Zairyo_update,
  List_start,
  List_grayout,
  List_inputAssist,
} from './button';

/*
 * ダミー関数
 * コールしないとindex.gsに関数が生成されないのでdumy関数を記述
 */
function dumy() {
  addRow();
  Detail_cancel();
  Detail_deleteSheet();
  Detail_Zairyo_update();
  List_start();
  List_grayout();
  List_inputAssist();
}
