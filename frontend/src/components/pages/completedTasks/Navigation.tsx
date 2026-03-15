import type { Task } from "@/types/task"
import styles from "./Navigation.module.css"

interface NavigationProps {
  tasks: Task[]
  filter: "all" | "recent"
  setFilter: (filter: "all" | "recent") => void
}

export const Navigation = ({ tasks, filter, setFilter }: NavigationProps) => {
  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All Done ({tasks.length})
        </button>
        <button
          className={`${styles.tab} ${filter === 'recent' ? styles.tabActive : ''}`}
          onClick={() => setFilter('recent')}
        >
          Recently Completed
        </button>
      </div>

    </>
  )
}

