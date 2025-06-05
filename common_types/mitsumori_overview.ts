/*
 *見積の概要を表すクラス
 *
 *このクラスは、見積データをさまざまな形式で管理および操作するために使用されます。
 *このクラスは、Google SheetsおよびBigQueryのGoogle Apps Scriptで使用するために設計されています。
 */
class MitsumoriOverview {
    private spread_id: string;
    private spread_name: string;
    private tanto_id: string;
    private customer: string;
    private customer_tanto: string;
    private kenmei: string;
    private update_datetime: string;
    private total_sum: number;
    private delivery_date: string;
    private state: string;
    private created_at: string;
    constructor(
        spread_id: string,
        spread_name: string,
        tanto_id: string,
        customer: string,
        customer_tanto: string,
        kenmei: string,
        update_datetime: string,
        total_sum: number,
        delivery_date: string,
        state: string,
        created_at: string
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
    // BigQueryのテーブル行形式に変換するメソッド
    toBigQueryRow(): GoogleAppsScript.BigQuery.Schema.TableRow {
        let result: GoogleAppsScript.BigQuery.Schema.TableRow = { f: [] };
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
            
            this.spread_id,
            this.spread_name,
            this.tanto_id,
            this.customer,
            this.customer_tanto,
            this.kenmei,
            this.update_datetime,
            this.total_sum.toString(),
            this.delivery_date,
            this.state,
            this.created_at
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