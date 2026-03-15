import { useAuthStore } from "@/store/authStore"
import styles from "./AccountSettings.module.css"
import { ChevronRight, Lock, Mail } from "lucide-react"

export const AccountSettings = () => {
  const { user } = useAuthStore()

  return (
    <>
      <div className={styles.settingsColumn}>
        <h3 className={styles.columnTitle}>Account Settings</h3>
        <div className={styles.settingsCard}>
          <button className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <Mail color="var(--font-color-title)" />
            </div>
            <div className={styles.settingText}>
              <p className={styles.settingLabel}>Email Address</p>
              <p className={styles.settingValue}>{user?.email}</p>
            </div>
            <ChevronRight color="var(--font-color-title)" />
          </button>
          <button className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <Lock color="var(--font-color-title)" />
            </div>
            <div className={styles.settingText}>
              <p className={styles.settingLabel}>Security</p>
              <p className={styles.settingValue}>Password and 2FA</p>
            </div>
            <ChevronRight color="var(--font-color-title)" />
          </button>
        </div>
      </div>

    </>
  )
}

