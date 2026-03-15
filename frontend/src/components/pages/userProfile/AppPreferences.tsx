import { Bell, Moon } from "lucide-react"
import styles from "./AppPreferences.module.css"

export const AppPreferences = () => {
  return (
    <>
      <div className={styles.settingsColumn}>
        <h3 className={styles.columnTitle}>App Preferences</h3>
        <div className={styles.preferencesCard}>
          {/* Dark Mode */}
          <div className={styles.preferenceItem}>
            <div className={styles.preferenceInfo}>
              <Moon color="var(--font-color-title)" />
              <div>
                <p className={styles.preferenceLabel}>Dark Mode</p>
                <p className={styles.preferenceDesc}>Switch between themes</p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Push Notifications */}
          <div className={styles.preferenceItem}>
            <div className={styles.preferenceInfo}>
              <Bell color="var(--font-color-title)" />
              <div>
                <p className={styles.preferenceLabel}>Push Notifications</p>
                <p className={styles.preferenceDesc}>Alerts for task updates</p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" defaultChecked />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </div>

    </>
  )
}

