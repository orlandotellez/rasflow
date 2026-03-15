import { formatDate } from "@/utils/time"
import styles from "./ProfileSection.module.css"
import { getInitials } from "@/utils/text"
import { useAuthStore } from "@/store/authStore";

export const ProfileSection = () => {
  const { user } = useAuthStore();

  return (
    <>
      <section className={styles.profileSection}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {getInitials(user?.email || '')}
            </div>
          </div>
          <div className={styles.profileDetails}>
            <h3 className={styles.profileName}>{user?.email}</h3>
            <p className={styles.profileEmail}>{user?.email}</p>
            <div className={styles.badges}>
              <span className={styles.badge}>
                Member since {formatDate(user?.created_at || new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

