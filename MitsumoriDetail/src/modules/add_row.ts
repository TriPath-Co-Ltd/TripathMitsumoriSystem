export function addRow() {
  // 追加行数入力ボックス
  let addRowCount = 0;

  const ui = SpreadsheetApp.getUi();

  // 入力ボックスを表示
  const response = ui.prompt(
    '追加行数(1～100)を入力してください。',
    ui.ButtonSet.OK_CANCEL
  );

  // OKボタンがクリックされた場合の処理
  if (response.getSelectedButton() === ui.Button.OK) {
    // 入力文字列を整数に変換
    const responseInt = parseInt(response.getResponseText(), 10);

    // 入力文字列が0より大きく100以下なら追加行数として採用
    if (0 < responseInt && responseInt <= 100) {
      addRowCount = responseInt;
    }
    // 不採用
    else {
      ui.alert('入力文字列が不整合');
    }
  }

  // 入力文字列が問題なければ行追加
  if (addRowCount > 0) {
    const activeSheet = SpreadsheetApp.getActiveSheet();

    // A列最終行取得
    const lastRow = activeSheet.getLastRow() - 3;

    // 最終列取得
    const lastCol = activeSheet.getLastColumn();

    // 空白行を入力行末に追加
    activeSheet.insertRowsAfter(lastRow, addRowCount);

    for (let i = 0; i < addRowCount; i++) {
      // 非表示の入力項目をコピーし、入力行末に貼付
      activeSheet
        .getRange(1, 1, 1, lastCol)
        .copyTo(activeSheet.getRange(lastRow + 1 + i, 1));
    }
  }
}
