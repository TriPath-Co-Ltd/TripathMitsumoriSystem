import { PROJECT_CONSTANTS } from './project_constants';
/*
 * BigQueryから指定されたテーブルの行を取得する関数
 * @param {string} tableName - 取得するテーブル名
 * @param {string} where - WHERE句の条件
 * @returns {object[]} - 取得した行の配列
 */
export function getRowBQ(
  tableName: string,
  select_cols: string[],
  where: string
) {
  const query = `
        SELECT ${select_cols.join(', ') || '*'}
        FROM \`${PROJECT_CONSTANTS.BQ_PROJECT_ID}.${PROJECT_CONSTANTS.BQ_DATABASE_ID}.${tableName}\`
        ${where}
    `;
  const queryResults = BQquery(query);
  return queryResults.rows;
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

/*
 * BigQueryの指定されたテーブルのデータを更新する関数
  * @param {string} tableName - 更新するテーブル名
  * @param {Object} values - 更新するデータのキーと値のペア
  * @param {string} where - WHERE句の条件
  * @throws {Error} - BigQueryまたはBigQuery.Jobsが未定義の場合
  * @example
      updateBQ('your_table_name', { column1: 'value1', column2: 123 }, 'id = 1');
 */
export function updateBQ(
  tableName: string,
  values: { [key: string]: string | number | boolean },
  where: string
) {
  const setClause = Object.entries(values)
    // キーと値のペアを文字列に変換、文字列以外の場合はクォートしない
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key} = '${value}'`;
      } else {
        return `${key} = ${value}`;
      }
    })
    .join(', ');

  const query = `
        UPDATE \`${PROJECT_CONSTANTS.BQ_PROJECT_ID}.${PROJECT_CONSTANTS.BQ_DATABASE_ID}.${tableName}\`
        SET ${setClause}
        WHERE ${where}
    `;

  if (!BigQuery || !BigQuery.Jobs) {
    throw new Error(
      'BigQuery or BigQuery.Jobs is undefined. Please ensure BigQuery is properly initialized.'
    );
  }

  // BigQueryにデータを更新
  BQquery(query);
}

function BQquery(
  query: string
): GoogleAppsScript.BigQuery.Schema.QueryResponse {
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
