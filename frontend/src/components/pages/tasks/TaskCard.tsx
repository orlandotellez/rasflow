import type { Task } from "@/types/task"
import styles from "./TaskCard.module.css"
import { MoreVertical, Trash2 } from "lucide-react"
import { useModalStore } from "@/store/modalStore"

interface TaskCardProps {
  task: Task
  selectedProjectId: string | null
  handleDeleteTask: (taskId: string) => void
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => Promise<void>
}

export const TaskCard = ({ task, selectedProjectId, handleDeleteTask, handleStatusChange }: TaskCardProps) => {
  const { openTaskModal } = useModalStore()
  return (
    <>
      <div key={task.id} className={styles.taskCard}>
        <div className={styles.taskHeader}>
          <div className={styles.taskActions}>
            <button
              onClick={() => openTaskModal(selectedProjectId!, task)}
              className={styles.actionButton}
              title="Edit"
            >
              <MoreVertical size={14} />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className={styles.actionButton}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        <div className={styles.taskFooter}>
          {/* Quick status change */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            className={styles.statusSelect}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

    </>
  )
}

