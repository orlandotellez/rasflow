import type { Task } from "@/types/task"
import styles from "./CardCompleteTask.module.css"
import { CheckCircle, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/time"

interface CardCompleteTaskProps {
  task: Task
  handleDeleteTask: (taskId: string) => void
}

export const CardCompleteTask = ({ task, handleDeleteTask }: CardCompleteTaskProps) => {
  return (
    <>
      <div key={task.id} className={styles.taskItem}>
        <div className={styles.taskLeft}>
          <div className={styles.checkbox}>
            <CheckCircle size={20} />
          </div>
          <div className={styles.taskInfo}>
            <span className={styles.taskTitle}>{task.title}</span>
            <div className={styles.taskMeta}>
              <span>Completed on {formatDate(task.created_at)}</span>
              <span className={styles.dot}></span>
              <span>{task.project_name || 'No Project'}</span>
            </div>
          </div>
        </div>
        <div className={styles.taskRight}>
          <div className={`${styles.statusBadge} ${styles.verified}`}>
            <CheckCircle size={16} />
            <span>Completed</span>
          </div>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className={styles.moreButton}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

    </>
  )
}

