import { getConfig } from '../modules/common_modules';
import { getTantoName } from '../modules/bigquery'; // 追加: getTantoNameをインポート
import {
  LIST_SHEET_NAME,
  MITUMORIFOLDERID,
  MITUMORITEMPLETESPREADID,
} from '../constans/sheet_constants';

export function createEstimate_katayama() {
  // config取得
  const tannto_id = getConfig('tannto_id');

  let tannto_name = '';
  try {
    const result = getTantoName(tannto_id);
    tannto_name = result && result[0] ? String(result[0]) : '';
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log(e);
    }
  }

  console.log(tannto_name);

  // // お客様名
  // let customer = Browser.inputBox("お客様名を入力してください。");

  // if (customer == "") {
  //   customer = "お客様名無し"
  // }

  // // 件名
  // let kenmei = Browser.inputBox("見積件名を入力してください。");

  // if (kenmei == "") {
  //   kenmei = "件名無し"
  // }

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

  // 新規見積シート
  const mitsumoriSpreadSheet = SpreadsheetApp.openById(
    activateMitsumoriSpreadId
  );
  const mitsumoriSheet = mitsumoriSpreadSheet.getSheetByName(LIST_SHEET_NAME);

  // // お客様名セット
  // mitsumoriSheet.getRange(2,2).setValue(customer);

  // // 件名セット
  // mitsumoriSheet.getRange(3,2).setValue(kenmei);

  // リンクを開く
  //openLink(g_activateMitsumoriSpreadId)

  // BigQuery登録
  //insertMitumori(g_activateMitsumoriSpreadId,spreadName,tannto_id)
}
