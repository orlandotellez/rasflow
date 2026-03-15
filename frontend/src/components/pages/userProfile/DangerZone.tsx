import styles from "./DangerZone.module.css"

export const DangerZone = () => {
  return (
    <>
      <section className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>Danger Zone</h3>
        <div className={styles.dangerCard}>
          <div className={styles.dangerInfo}>
            <p className={styles.dangerLabel}>Delete Account</p>
            <p className={styles.dangerDesc}>
              Permanently remove all your data and access. This action cannot be undone.
            </p>
          </div>
          <button className={styles.deleteBtn}>Delete Account</button>
        </div>
      </section>
    </>
  )
}

