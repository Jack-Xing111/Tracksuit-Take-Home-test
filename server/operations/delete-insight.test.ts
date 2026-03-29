import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("delete insight (Delete Insight)", () => {
  withDB((fixture) => {
    // Before the test runs, insert a record that we will attempt to delete
    beforeAll(() => {
      fixture.insights.insert([{
        brandId: 5,
        createdAt: new Date().toISOString(),
        text: "Data to be deleted"
      }]);
    });

    it("should delete the specified record by ID", async () => {
      // First, confirm the data is present (ID should be 1)
      const beforeRows = fixture.insights.selectAll();
      expect(beforeRows.length).toBe(1);
      const targetId = beforeRows[0].id;

      // Execute deletion
      await deleteInsight({
        db: fixture.db,
        id: targetId
      });

      // Verify: The database is now empty
      const afterRows = fixture.insights.selectAll();
      expect(afterRows.length).toBe(0);
    });
  });
});