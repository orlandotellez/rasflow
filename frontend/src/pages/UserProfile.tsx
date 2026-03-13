import styles from './UserProfile.module.css';

const UserProfile = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Settings</h2>
          <p className={styles.pageSubtitle}>Manage your account and app preferences</p>
        </header>

        {/* Profile Section */}
        <section className={styles.profileSection}>
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              <div 
                className={styles.avatar}
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCxQWLSpUTXNIuma_fR9CDceqFeakPzqJxhDo3xQYxYva_RQFlYry0H8dpuedQFCXLNdXguSVIIfT1dAbEp_rlpqB0djLg3Z8kNgwjzRcEr3yC9XdMViyL-1YrqSmkZxp9RjfTGWYQp1DchphPp8IKgZjwIloWtR6lP9j0zbPah-3exY9TqYZFvWiuJv7KZzJsTsS3TtWGcBxRdLdQ8kr2q2cfGt0rSKO7U3XoF3Lb_B9G2tIZhUzPAh__twGaJ5-jlDhZAr4gbcAI")' }}
              />
              <button className={styles.editAvatarBtn}>
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
            <div className={styles.profileDetails}>
              <h3 className={styles.profileName}>Alex Morgan</h3>
              <p className={styles.profileEmail}>alex.morgan@taskflow.com</p>
              <div className={styles.badges}>
                <span className={styles.badge}>Member since Oct 2023</span>
                <span className={`${styles.badge} ${styles.badgePro}`}>Pro Plan</span>
              </div>
            </div>
            <button className={styles.editProfileBtn}>Edit Profile</button>
          </div>
        </section>

        <div className={styles.settingsGrid}>
          {/* Account Settings */}
          <div className={styles.settingsColumn}>
            <h3 className={styles.columnTitle}>Account Settings</h3>
            <div className={styles.settingsCard}>
              <button className={styles.settingItem}>
                <div className={styles.settingIcon}>
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className={styles.settingText}>
                  <p className={styles.settingLabel}>Email Address</p>
                  <p className={styles.settingValue}>alex.morgan@taskflow.com</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button className={styles.settingItem}>
                <div className={styles.settingIcon}>
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className={styles.settingText}>
                  <p className={styles.settingLabel}>Security</p>
                  <p className={styles.settingValue}>Password and 2FA</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button className={styles.settingItem}>
                <div className={styles.settingIcon}>
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className={styles.settingText}>
                  <p className={styles.settingLabel}>Billing</p>
                  <p className={styles.settingValue}>Manage subscription</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* App Preferences */}
          <div className={styles.settingsColumn}>
            <h3 className={styles.columnTitle}>App Preferences</h3>
            <div className={styles.preferencesCard}>
              {/* Dark Mode */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <span className="material-symbols-outlined">dark_mode</span>
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
                  <span className="material-symbols-outlined">notifications</span>
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

              {/* Email Digest */}
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <span className="material-symbols-outlined">alternate_email</span>
                  <div>
                    <p className={styles.preferenceLabel}>Email Digest</p>
                    <p className={styles.preferenceDesc}>Weekly summary of tasks</p>
                  </div>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
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
      </div>
    </main>
  );
};

export default UserProfile;
