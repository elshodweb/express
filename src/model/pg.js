import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});

export default async ( SQL, ...params) => {
  const client = await pool.connect();

  try {
    const rows = await client.query(SQL, params.length ? params : null);
    return rows?.rows;

  } catch (error) {
    return error
  } finally {
    await client.release();
  }
};
