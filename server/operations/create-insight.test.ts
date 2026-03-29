import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";

describe("Create a new insight (Create Insight)", () => {
  withDB((fixture) => {
    it("should successfully insert a record into the database", async () => {
      const testData = {
        brandId: 1,
        text: "This is a test insight"
      };

      // Execute creation logic
      const result = await createInsight({
        db: fixture.db,
        ...testData
      });

      // Verify 1: The returned object contains the correct data
      expect(result.brandId).toBe(testData.brandId);
      expect(result.text).toBe(testData.text);
      expect(result.id).toBeDefined(); // The database should have generated an ID

      // Verify 2: The data is actually stored in the database
      const allRows = fixture.insights.selectAll();
      expect(allRows.length).toBe(1);
      expect(allRows[0].text).toBe(testData.text);
    });
  });
});