import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onInsightDeleted: () => void;
};

export const Insights = ({ insights, className, onInsightDeleted }: InsightsProps) => {
  const deleteInsight = async (id: number) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;

    try {
      const response = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onInsightDeleted();
      } else {
        alert("Failed to delete insight");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>品牌 ID: {brandId}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
