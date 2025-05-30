// 入力補助タイプ
enum inputAssistType {
  inputSheet, // 入力シート
  referenceShape, // 参照図形
}

/*
 入力補助の型
*/
class InputAssist {
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

class inputAssistSheet extends InputAssist {
  private sheetName: string; // 入力補助のシート名

  constructor(sheetName: string, columnTitle: string) {
    super(inputAssistType.inputSheet, columnTitle);
    this.sheetName = sheetName;
  }
  // 入力補助のシート名を取得する
  public getSheetName(): string {
    return this.sheetName;
  }
}

class inputAssistReferenceShape extends InputAssist {
  private shapeName: string; // 入力補助の図形名(実際は図形のアクション名)

  constructor(shapeName: string, columnTitle: string) {
    super(inputAssistType.referenceShape, columnTitle);
    this.shapeName = shapeName;
  }
  // 入力補助の図形名を取得する
  public getShapeName(): string {
    return this.shapeName;
  }
}
