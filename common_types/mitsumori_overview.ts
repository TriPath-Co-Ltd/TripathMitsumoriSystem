/*
 *見積の概要を表すクラス
 *
 *このクラスは、見積データをさまざまな形式で管理および操作するために使用されます。
 *このクラスは、Google SheetsおよびBigQueryのGoogle Apps Scriptで使用するために設計されています。
 */
export class MitsumoriOverview {
  private spread_id: string;
  private spread_name: string;
  private tanto_id: string;
  private customer: string;
  private customer_tanto: string;
  private kenmei: string;
  private total_sum: number;
  private delivery_date: string;
  private state: string;
  private created_at: string;
  private update_datetime: string;
  constructor(
    spread_id: string,
    spread_name: string,
    tanto_id: string,
    customer: string,
    customer_tanto: string,
    kenmei: string,
    total_sum: number,
    delivery_date: string,
    state: string,
    created_at: string,
    update_datetime: string
  ) {
    this.spread_id = spread_id;
    this.spread_name = spread_name;
    this.tanto_id = tanto_id;
    this.customer = customer;
    this.customer_tanto = customer_tanto;
    this.kenmei = kenmei;
    this.update_datetime = update_datetime;
    this.total_sum = total_sum;
    this.delivery_date = delivery_date;
    this.state = state;
    this.created_at = created_at;
  }
  //BigQueryのMitumoriOverviewテーブルからこのクラスのインスタンスを作成する静的メソッド
  static fromBigQueryRow(
    row: GoogleAppsScript.BigQuery.Schema.TableRow
  ): MitsumoriOverview {
    if (!row.f) {
      throw new Error('row.f is undefined');
    }
    const spread_id = row.f[0].v as unknown as string;
    const spread_name = row.f[1].v as unknown as string;
    const tanto_id = row.f[2].v as unknown as string;
    const customer = row.f[3].v as unknown as string;
    const customer_tanto = row.f[4].v as unknown as string;
    const kenmei = row.f[5].v as unknown as string;
    const update_datetime = row.f[6].v as unknown as string;
    const total_sum = row.f[7].v as unknown as number;
    const delivery_date = row.f[8].v as unknown as string;
    const state = row.f[9].v as unknown as string;
    const created_at = row.f[10].v as unknown as string;
    return new MitsumoriOverview(
      spread_id,
      spread_name,
      tanto_id,
      customer,
      customer_tanto,
      kenmei,
      total_sum,
      delivery_date,
      state,
      created_at,
      update_datetime
    );
  }
  // Getter methods for each property
  getSpreadId(): string {
    return this.spread_id;
  }
  getSpreadName(): string {
    return this.spread_name;
  }
  getTantoId(): string {
    return this.tanto_id;
  }
  getCustomer(): string {
    return this.customer;
  }
  getCustomerTanto(): string {
    return this.customer_tanto;
  }
  getKenmei(): string {
    return this.kenmei;
  }
  getUpdateDatetime(): string {
    return this.update_datetime;
  }
  getTotalSum(): number {
    return this.total_sum;
  }
  getDeliveryDate(): string {
    return this.delivery_date;
  }
  getState(): string {
    return this.state;
  }
  getCreatedAt(): string {
    return this.created_at;
  }
  // BigQueryのselect句に使用するためのカラム名配列を返すメソッド
  static toBigQuerySelectArray(): string[] {
    return [
      'spread_id',
      'spread_name',
      'tanto_id',
      'customer',
      'customer_tanto',
      'kenmei',
      'update_datetime',
      'total_sum',
      'delivery_date',
      'state',
      'created_at',
    ];
  }
  toBigQuerySelect(): string {
    return `spread_id, spread_name, tanto_id, customer, customer_tanto, kenmei, update_datetime, total_sum, delivery_date, state, created_at`;
  }
  // BigQueryのテーブル行形式に変換するメソッド
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
  // Method to convert the object to a Google Sheets row format
  toSearchSheetRow(): string[] {
    return [
      'checkbox',
      this.toHyperlinkFormula(),
      this.spread_name,
      this.tanto_id,
      this.customer,
      this.customer_tanto,
      this.kenmei,
      this.update_datetime,
      this.total_sum.toString(),
      this.delivery_date,
      this.state,
      this.created_at,
    ];
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
  // Method to convert the object to a Google Sheets state format
  toStateFormat(): string {
    return `=IF("${this.state}" = "完了", "✅", "❌")`;
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
}
