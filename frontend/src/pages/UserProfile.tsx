import { useAuthStore } from '@/store/authStore';
import styles from './UserProfile.module.css';
import { PleaseLogIn } from '@/components/common/PleaseLogIn';
import { ProfileSection } from '@/components/pages/userProfile/ProfileSection';
import { AccountSettings } from '@/components/pages/userProfile/AccountSettings';
import { AppPreferences } from '@/components/pages/userProfile/AppPreferences';
import { DangerZone } from '@/components/pages/userProfile/DangerZone';

const UserProfile = () => {
  const { isAuthenticated } = useAuthStore();

  // Si no está autenticado, mostrar mensaje para iniciar sesión
  if (!isAuthenticated) {
    return <PleaseLogIn page="Settings" message="Please log in to view your profile" />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Settings</h2>
          <p className={styles.pageSubtitle}>Manage your account and app preferences</p>
        </header>

        {/* Profile Section */}
        <ProfileSection />

        <div className={styles.settingsGrid}>
          {/* Account Settings */}
          <AccountSettings />

          {/* App Preferences */}
          <AppPreferences />

        </div>

        {/* Danger Zone */}
        <DangerZone />
      </div>
    </main>
  );
};

export default UserProfile;
