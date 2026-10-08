import mysql, { type ExecuteValues } from "mysql2/promise";
import { Pool, types as pgTypes } from "pg";


// Postgres mengembalikan bigint (int8) sebagai string — paksa ke number
// supaya cocok dengan tipe `id`, `price`, dan `COUNT(...)` di lib/types.ts.
pgTypes.setTypeParser(20, (value) => parseInt(value, 10));

// Kolom numeric (mis. products.rating) juga dikembalikan sebagai string.
pgTypes.setTypeParser(1700, (value) => parseFloat(value));

const usePg = Boolean(process.env.SUPABASE_DB_URL);

let pgPool: Pool | undefined;
let mysqlPool: mysql.Pool | undefined;

function getPgPool(): Pool {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
  }
  return pgPool;
}

function getMysqlPool(): mysql.Pool {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST ?? "127.0.0.1",
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE ?? "rizqyutamaelectric",
      connectionLimit: 10,
      decimalNumbers: true,
    });
  }
  return mysqlPool;
}

// Postgres memakai $1, $2, ... — MySQL memakai ?. Kode halaman tetap memakai `?`.
function toPostgresSql(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

export async function query<T>(sql: string, params: ExecuteValues = []): Promise<T> {
  if (usePg) {
    const result = await getPgPool().query(toPostgresSql(sql), params as unknown[]);
    return result.rows as T;
  }
  const [rows] = await getMysqlPool().execute(sql, params);
  return rows as T;
}
