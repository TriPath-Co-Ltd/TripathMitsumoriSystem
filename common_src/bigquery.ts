import { PROJECT_CONSTANTS } from "./project_constants";

/*
  * BigQueryから指定されたテーブルの行を取得する関数
  * @param {string} tableName - 取得するテーブル名
  * @param {string} where - WHERE句の条件
  * @returns {object[]} - 取得した行の配列
  */
export function getRowBQ(tableName: string, where: string) {
  const query = `
        SELECT *
        FROM \`${PROJECT_CONSTANTS.BQ_PROJECT_ID}.${PROJECT_CONSTANTS.BQ_DATABASE_ID}.${tableName}\`
        WHERE ${where}
    `;
 
  const queryResults = BQquery(query);

  const texts: (object | undefined)[] = [];

  if (queryResults.rows) {
    queryResults.rows.forEach((row: { f: { v: object | undefined; }[]; }) => {
      if (row.f && row.f[0]) {
        texts.push(row.f[0].v);
      }
    });
  }

  return texts;
}

/*
 * BigQueryにデータを挿入する関数
 * @param {string} tableName - 挿入先のテーブル名
 * @param {Object} values - 挿入するデータのキーと値のペア
 */
export function insertBQ(
  tableName: string,
  values: { [key: string]: string | number | boolean }
) {
  const query = `
        INSERT INTO \`${PROJECT_CONSTANTS.BQ_PROJECT_ID}.${PROJECT_CONSTANTS.BQ_DATABASE_ID}.${tableName}\`
        (${Object.keys(values).join(', ')})
        VALUES (${Object.values(values)
          .map(value => `'${value}'`)
          .join(', ')})
    `;

  if (!BigQuery || !BigQuery.Jobs) {
    throw new Error(
      'BigQuery or BigQuery.Jobs is undefined. Please ensure BigQuery is properly initialized.'
    );
  }

  // BigQueryにデータを挿入
  BQquery(query);
}

function BQquery( 
  query: string
): any {
  if (!BigQuery || !BigQuery.Jobs) {
    throw new Error(
      'BigQuery or BigQuery.Jobs is undefined. Please ensure BigQuery is properly initialized.'
    );
  }
  // BigQueryにクエリを実行
  return BigQuery.Jobs.query(
    {
      useLegacySql: false,
      query: query,
      timeoutMs: 20000,
      location: PROJECT_CONSTANTS.BQ_LOCATION,
    },
    PROJECT_CONSTANTS.BQ_PROJECT_ID
  );
}