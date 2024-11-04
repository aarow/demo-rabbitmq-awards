import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

const sslCertPath = './dbServerCert.txt';

const sql = postgres({
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  //ssl: {rejectUnauthorized:false}
  //ssl: {
  //  rejectUnauthorized: true,      // Enforces certificate validation
  //  ca: fs.readFileSync(sslCertPath).toString(), // Path to the server cert
  //}
});

export default sql;
