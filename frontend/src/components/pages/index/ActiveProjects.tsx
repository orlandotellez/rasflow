import { useDashboardStore } from "@/store/dashboardStore";
import styles from "./ActiveProjects.module.css"
import { useNavigate } from "react-router-dom";

export const ActiveProjects = () => {
  const { projects } = useDashboardStore();
  const navigate = useNavigate()

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  return (
    <>
      {/* Active Projects */}
      <div className={styles.projectsCard}>
        <h3 className={styles.cardTitle}>Active Projects</h3>
        <div className={styles.projectsList}>
          {projects.length === 0 ? (
            <p className={styles.noProjects}>No projects yet</p>
          ) : (
            projects.slice(0, 3).map((project) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectName}>{project.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {projects.length > 0 && (
          <button onClick={handleViewAllProjects} className={styles.viewAllBtn}>
            View All Projects
          </button>
        )}
      </div>
    </>
  )
}
