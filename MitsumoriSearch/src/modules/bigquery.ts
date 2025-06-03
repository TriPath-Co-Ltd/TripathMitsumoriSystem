const projectId = 'tripath-mitsumori-test';
const datasetId = 'Mitumori';
const tableId = 'Tanto';
const column = 'tannto_name';

export function getTantoName(tannto_id: number) {
  const query = `
        SELECT ${column}
        FROM ${projectId}.${datasetId}.${tableId}
        WHERE tanto_id = ${tannto_id}
    `;
  if (!BigQuery || !BigQuery.Jobs) {
    throw new Error(
      'BigQuery or BigQuery.Jobs is undefined. Please ensure BigQuery is properly initialized.'
    );
  }
  const queryResults = BigQuery.Jobs.query(
    {
      useLegacySql: false,
      query: query,
      timeoutMs: 20000,
      location: 'asia-northeast1',
    },
    projectId
  );

  const texts: (object | undefined)[] = [];

  if (queryResults.rows) {
    queryResults.rows.forEach(row => {
      if (row.f && row.f[0]) {
        texts.push(row.f[0].v);
      }
    });
  }

  return texts;
}
