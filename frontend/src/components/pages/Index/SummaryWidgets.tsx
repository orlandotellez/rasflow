import { ClipboardCheck, ClipboardClock, ClipboardList, Hourglass } from "lucide-react"
import styles from "./SummaryWidgets.module.css"
import { useDashboardStore } from "@/store/dashboardStore";

export const SummaryWidgets = () => {
  const { stats } = useDashboardStore();
  return (
    <>
      {/* Summary Widgets */}
      <div className={styles.widgetsGrid}>
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <ClipboardList color="var(--font-color-title)" />
          </div>
          <p className={styles.widgetLabel}>Total Tasks</p>
          <h3 className={styles.widgetValue}>{stats.totalTasks}</h3>
        </div>
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <ClipboardClock color="var(--font-color-title)" />
          </div>
          <p className={styles.widgetLabel}>In Progress</p>
          <h3 className={styles.widgetValue}>{stats.inProgressTasks}</h3>
        </div>
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <ClipboardCheck color="var(--font-color-title)" />
          </div>
          <p className={styles.widgetLabel}>Completed This Week</p>
          <h3 className={styles.widgetValue}>{stats.completedThisWeek}</h3>
        </div>
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <Hourglass color="var(--font-color-title)" />
          </div>
          <p className={styles.widgetLabel}>Total Projects</p>
          <h3 className={styles.widgetValue}>{stats.totalProjects}</h3>
        </div>
      </div>
    </>
  )
}
