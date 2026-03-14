import { useDashboardStore } from "@/store/dashboardStore";
import styles from "./UpcomingTask.module.css"
import { useTasksStore } from "@/store/taskStore";
import { Circle, Clock } from "lucide-react";
import type { TaskStatus } from "@/types/task";

export const UpcomingTask = () => {
  const { recentTasks, fetchDashboardData } = useDashboardStore()
  const { updateTaskStatus } = useTasksStore();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
    fetchDashboardData(); // Recargar datos
  };

  return (
    <>
      {/* Due Today */}
      <div className={styles.dueTodayCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Upcoming Tasks</h3>
          <span className={styles.remainingBadge}>
            {recentTasks.length} Task{recentTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={styles.taskList}>
          {recentTasks.length === 0 ? (
            <p className={styles.noTasks}>No pending tasks</p>
          ) : (
            recentTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskLeft}>
                  <button className={styles.checkbox}>
                    {task.status === 'in_progress' ? (
                      <Clock size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>{task.title}</p>
                    <p className={styles.taskMeta}>
                      {task.project_name} • {task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                    </p>
                  </div>
                </div>
                <div className={styles.taskRight}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className={styles.statusSelect}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </>
  )
}

