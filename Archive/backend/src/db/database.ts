import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "demo.db");

export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error("Failed to connect to database:", err.message);
    else console.log("Connected to SQLite database at", dbPath);
  }
);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      classID TEXT,
      password TEXT NOT NULL,
      photo TEXT
    )`
  );

  db.get("SELECT COUNT(*) as count FROM users", (err: Error | null, row?: { count: number }) => {
    if (err) return console.error(err.message);
    if (!row || row.count === 0) {
      db.run(
        `INSERT INTO users (name, role, classID, password) VALUES 
          ('Alice', 'teacher', '10A', 'pass123'),
          ('Bob', 'student', NULL, 'studentpass')`
      );
    }
  });
});
