import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(__dirname, '../../migrations/001_init.sql'), 'utf-8');

async function main() {
  await pool.query(sql);
  console.log('Migration applied.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
