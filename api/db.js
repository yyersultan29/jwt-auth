import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  password: "12345qwert",
  host: "localhost",
  port: "5432",
  database: "auth",
});

export default pool;
