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
// 入力補助タイプ
export enum inputAssistType {
  inputSheet, // 入力シート
  referenceShape, // 参照図形
}

/*
 入力補助の型
*/
export class InputAssist {
  private type: inputAssistType; // 入力補助のタイプ
  private columnTitle: string; // 入力補助の列タイトル

  constructor(type: inputAssistType, columnTitle: string) {
    this.type = type;
    this.columnTitle = columnTitle;
  }
  // 入力補助の列タイトルを取得する
  public getColumnTitle(): string {
    return this.columnTitle;
  }
  // 入力補助のタイプを取得する
  public getType(): inputAssistType {
    return this.type;
  }
}

export class inputAssistSheet extends InputAssist {
  private sheetName: string; // 入力補助のシート名

  constructor(columnTitle: string, sheetName: string) {
    super(inputAssistType.inputSheet, columnTitle);
    this.sheetName = sheetName;
  }
  // 入力補助のシート名を取得する
  public getSheetName(): string {
    return this.sheetName;
  }
}

export class inputAssistReferenceShape extends InputAssist {
  private shapeName: string; // 入力補助の図形名(実際は図形のアクション名)

  constructor(columnTitle: string, shapeName: string) {
    super(inputAssistType.referenceShape, columnTitle);
    this.shapeName = shapeName;
  }
  // 入力補助の図形名を取得する
  public getShapeName(): string {
    return this.shapeName;
  }
}
