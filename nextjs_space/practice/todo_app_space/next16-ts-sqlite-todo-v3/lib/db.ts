// lib/db.ts
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "todos_v3.db");

// Single shared connection
const db = new Database(dbPath);

// Init schema
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )
`);

export type TodoRow = {
    id: number;
    text: string;
    completed: number; // 0 or 1
    created_at: number;
};

export default db;
