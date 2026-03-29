import type { Database } from "@db/sqlite";

export const createTable = `
  CREATE TABLE insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brandId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

export type Row = {
  id: number;
  brandId: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  brandId: number;
  createdAt: string;
  text: string;
};

export const insertInsight = (db: Database, item: Insert) => {
  return db.sql`INSERT INTO insights (brandId, createdAt, text) VALUES (${item.brandId}, ${item.createdAt}, ${item.text})`;
};
