import { useDashboardStore } from "@/store/dashboardStore";
import styles from "./QuickStats.module.css"
import { CheckCircle, ClipboardList, Clock } from "lucide-react";

export const QuickStats = () => {
  const { stats } = useDashboardStore();
  return (
    <>
      {/* Quick Stats */}
      <div className={styles.activityCard}>
        <h3 className={styles.cardTitle}>Quick Stats</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <CheckCircle size={18} className={styles.activityIcon} />
            <div className={styles.activityContent}>
              <p className={styles.activityTitle}>{stats.completedThisWeek} tasks completed this week</p>
            </div>
          </div>
          <div className={styles.activityItem}>
            <Clock size={18} className={styles.activityIcon} />
            <div className={styles.activityContent}>
              <p className={styles.activityTitle}>{stats.inProgressTasks} tasks in progress</p>
            </div>
          </div>
          <div className={styles.activityItem}>
            <ClipboardList size={18} className={styles.activityIcon} />
            <div className={styles.activityContent}>
              <p className={styles.activityTitle}>{stats.totalTasks} total tasks</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
