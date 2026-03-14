import type { Project } from "@/types/project"
import styles from "./MyProjects.module.css"
import { Calendar, Folder, Plus } from "lucide-react"
import { formatDate } from "@/utils/time"
import { useModalStore } from "@/store/modalStore"

interface MyProjectsProps {
  filteredProjects: Project[]
  handleDeleteProject: (projectId: string) => void
}

export const MyProjects = ({ filteredProjects, handleDeleteProject }: MyProjectsProps) => {
  const { openProjectModal } = useModalStore();

  return (
    <>
      <div className={styles.projectsGrid}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.cardHeader}>
              <div className={styles.projectIcon}>
                <Folder size={20} />
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => openProjectModal(project)}
                  className={styles.actionButton}
                  title="Edit"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className={styles.actionButton}
                  title="Delete"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className={styles.cardBody}>
              <h4 className={styles.projectTitle}>{project.name}</h4>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.dueDate}>
                <Calendar size={14} />
                Created {formatDate(project.created_at)}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          className={styles.addProjectCard}
          onClick={() => openProjectModal()}
        >
          <div className={styles.addIcon}>
            <Plus size={24} />
          </div>
          <span className={styles.addText}>Start New Project</span>
        </button>
      </div>
    </>
  )
}

