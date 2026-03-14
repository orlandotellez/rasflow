import { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAuthStore } from '@/store/authStore';
import styles from './Index.module.css';
import { PleaseLogIn } from '@/components/common/PleaseLogIn';
import { Loading } from '@/components/common/Loading';
import { SummaryWidgets } from '@/components/pages/Index/SummaryWidgets';
import { ProductivityChart } from '@/components/pages/Index/ProductivityChart';
import { ActiveProjects } from '@/components/pages/Index/ActiveProjects';
import { UpcomingTask } from '@/components/pages/Index/UpcomingTask';
import { QuickStats } from '@/components/pages/Index/QuickStats';

const Index = () => {
  const { isLoading, fetchDashboardData } = useDashboardStore();
  const { isAuthenticated } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  // Si no está autenticado
  if (!isAuthenticated) {
    return <PleaseLogIn page="Dashboard" message="Please log in to view the dashboard panel" />;
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.pageTitle}>Dashboard</h2>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton}>
            <Bell />
          </button>

          <div className={styles.searchBox}>
            <Search color='var(--font-color-text)' width={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div >
        </div >
      </header >

      {/* Loading */}
      {isLoading && <Loading text="Loading dashboard..." />}

      <SummaryWidgets />
      <div className={styles.content}>
        {/* Middle Section */}
        <div className={styles.middleGrid}>
          <ProductivityChart />
          <ActiveProjects />
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomGrid}>
          <UpcomingTask />
          <QuickStats />
        </div>
      </div>
      )
    </main >
  );
};

export default Index;
