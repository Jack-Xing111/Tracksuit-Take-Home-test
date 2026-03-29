import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brandId: number;
  text: string;
};

export default async (input: Input): Promise<Insight> => {
  console.log("Creating new insight...");

  // 1. Generate the current timestamp in ISO format for database storage
  const createdAt = new Date().toISOString();

  // 2. Execute a safe SQL insert and use RETURNING * to get the newly created row 
  const [row] = input.db.sql<insightsTable.Row>`
    INSERT INTO insights (brandId, createdAt, text) 
    VALUES (${input.brandId}, ${createdAt}, ${input.text})
    RETURNING *
  `;

  // 3. Convert the database row to a standard Insight object
  const result: Insight = {
    ...row,
    createdAt: new Date(row.createdAt),
  };

  console.log("Insight created:", result);
  return result;
};