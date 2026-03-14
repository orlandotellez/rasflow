import { Folder, Plus } from "lucide-react"
import styles from "./NoProjects.module.css"
import { useModalStore } from "@/store/modalStore";

export const NoProjects = () => {
  const { openProjectModal } = useModalStore();

  return (
    <>
      <div className={styles.emptyState}>
        <Folder size={48} className={styles.emptyIcon} />
        <p>No projects found</p>
        <button
          onClick={() => openProjectModal()}
          className={styles.createFirstButton}
        >
          <Plus size={18} />
          Create your first project
        </button>
      </div>

    </>
  )
}

