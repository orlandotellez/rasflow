import styles from "./Navigation.module.css"
import type { Task, TaskStatus } from "@/types/task"

interface Navigation {
  tasks: Task[]
  totalTodo: number
  totalInProgress: number
  totalDone: number
  activeTab: "all" | "todo" | "in_progress" | "done"
  setActiveTab: (activeTab: TaskStatus | "all") => void
}

export const Navigation = ({ tasks, totalTodo, totalInProgress, totalDone, activeTab, setActiveTab }: Navigation) => {
  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'todo' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          To Do ({totalTodo})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'in_progress' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress ({totalInProgress})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'done' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('done')}
        >
          Done ({totalDone})
        </button>
      </div>
    </>
  )
}

