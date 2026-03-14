import styles from "./NoProjects.module.css"

export const NoProjects = () => {
  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.pageTitle}>Task Board</h2>
        </header>
        <div className={styles.emptyState}>
          <p>You need to create a project first to manage tasks.</p>
        </div>
      </main>

    </>
  )
}

