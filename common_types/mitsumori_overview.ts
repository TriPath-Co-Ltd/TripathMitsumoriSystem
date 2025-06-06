import { EIGYOSHO, MITSUMORI_STATUS } from './as_const';

/*
 *見積の概要を表すクラス
 *
 *このクラスは、見積データをさまざまな形式で管理および操作するために使用されます。
 *このクラスは、Google SheetsおよびBigQueryのGoogle Apps Scriptで使用するために設計されています。
 */
export class MitsumoriOverview {
  public readonly spread_id: string;
  public readonly spread_name: string;
  public readonly tanto_id: string;
  public readonly customer: string;
  public readonly customer_tanto: string;
  public readonly kenmei: string;
  public readonly total_sum: number;
  public readonly delivery_date: string;
  public readonly created_at: string;
  public readonly update_datetime: string;
  public readonly mitsumoiri_status: string;
  public readonly eigyosho: string;
  // コンストラクタ
  // BigQueryのテーブル行形式のデータを受け取り、MitsumoriOverviewのインスタンスを初期化する。
  constructor(data: GoogleAppsScript.BigQuery.Schema.TableRow) {
    if (!data.f) {
      throw new Error('BigQueryのデータが正しくありません。');
    }

    this.spread_id = data.f[0].v as unknown as string;
    this.spread_name = data.f[1].v as unknown as string;
    this.tanto_id = data.f[2].v as unknown as string;
    this.customer = data.f[3].v as unknown as string;
    this.customer_tanto = data.f[4].v as unknown as string;
    this.kenmei = data.f[5].v as unknown as string;
    this.update_datetime = data.f[6].v as unknown as string;
    this.total_sum = data.f[7].v as unknown as number;
    this.delivery_date = data.f[8].v as unknown as string;
    this.created_at = data.f[9].v as unknown as string;
    this.mitsumoiri_status = data.f[10].v as unknown as string;
    this.eigyosho = data.f[11].v as unknown as string;
  }
  // 検索シートの行形式に変換するメソッド
  // この配列順が検索シートの列順となる。
  toSearchSheetRow(): string[] {
    return [
      this.toHyperlinkFormula(),
      this.mitsumoiri_status,
      this.eigyosho,
      this.spread_name,
      this.tanto_id,
      this.customer,
      this.customer_tanto,
      this.kenmei,
      this.update_datetime,
      this.toTotalSumFormat(),
      this.delivery_date,
      this.created_at,
    ];
  }
  // BigQueryのselect句に使用するためのカラム名配列を返すメソッド
  static toBigQuerySelectArray(): string[] {
    return ['*'];
  }

  //BigQueryのテーブル行形式に変換するメソッド
  toBigQueryRow(): GoogleAppsScript.BigQuery.Schema.TableRow {
    const result: GoogleAppsScript.BigQuery.Schema.TableRow = { f: [] };
    if (!result.f) {
      result.f = [];
    }
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = this[key as keyof MitsumoriOverview];
        result.f.push({ v: { value: value } });
      }
    }
    return result;
  }

  // Method to convert the object to a Google Sheets hyperlink formula
  toHyperlinkFormula(): string {
    return `=HYPERLINK("https://docs.google.com/spreadsheets/d/${this.spread_id}", "${this.spread_name}")`;
  }
  // Method to convert the object to a Google Sheets date format
  toDateFormat(): string {
    return `=DATE(${this.update_datetime.slice(0, 4)}, ${this.update_datetime.slice(5, 7)}, ${this.update_datetime.slice(8, 10)})`;
  }
  // Method to convert the object to a Google Sheets currency format
  toCurrencyFormat(): string {
    return `=CURRENCY(${this.total_sum})`;
  }
  // Method to convert the object to a Google Sheets date format for delivery date
  toDeliveryDateFormat(): string {
    return `=DATE(${this.delivery_date.slice(0, 4)}, ${this.delivery_date.slice(5, 7)}, ${this.delivery_date.slice(8, 10)})`;
  }
  // Method to convert the object to a Google Sheets created at format
  toCreatedAtFormat(): string {
    return `=DATE(${this.created_at.slice(0, 4)}, ${this.created_at.slice(5, 7)}, ${this.created_at.slice(8, 10)})`;
  }
  // Method to convert the object to a Google Sheets tanto format
  toTantoFormat(): string {
    return `=IF("${this.tanto_id}" = "", "未設定", "${this.tanto_id}")`;
  }
  // Method to convert the object to a Google Sheets customer format
  toCustomerFormat(): string {
    return `=IF("${this.customer}" = "", "未設定", "${this.customer}")`;
  }
  // Method to convert the object to a Google Sheets kenmei format
  toKenmeiFormat(): string {
    return `=IF("${this.kenmei}" = "", "未設定", "${this.kenmei}")`;
  }
  // Method to convert the object to a Google Sheets customer tanto format
  toCustomerTantoFormat(): string {
    return `=IF("${this.customer_tanto}" = "", "未設定", "${this.customer_tanto}")`;
  }
  // Method to convert the object to a Google Sheets total sum format
  toTotalSumFormat(): string {
    return `=IF(${this.total_sum} = 0, "未設定", ${this.total_sum})`;
  }
  toEigyoshoFormat(): string {
    return `=IF("${this.eigyosho}" = "", "未設定", "${this.eigyosho}")`;
  }
}
