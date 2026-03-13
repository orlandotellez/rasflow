import { Bell, Plus, Search } from 'lucide-react';
import styles from './CompletedTasks.module.css';

const CompletedTasks = () => {
  const tasks = [
    {
      id: 1,
      title: 'Update Marketing Strategy',
      date: 'Oct 24, 2023',
      category: 'Marketing Team',
      status: 'verified'
    },
    {
      id: 2,
      title: 'Q3 Financial Report',
      date: 'Oct 22, 2023',
      category: 'Finance',
      status: 'verified'
    },
    {
      id: 3,
      title: 'Design System Audit',
      date: 'Oct 18, 2023',
      category: 'Design',
      status: 'pending'
    },
    {
      id: 4,
      title: 'API Documentation Review',
      date: 'Oct 15, 2023',
      category: 'Engineering',
      status: 'verified'
    },
    {
      id: 5,
      title: 'Client Presentation Prep',
      date: 'Oct 14, 2023',
      category: 'Operations',
      status: 'verified'
    }
  ];

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.pageTitle}>Completed Tasks</h2>
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
              className={styles.searchInput}
            />
          </div>
          <button className={styles.newProjectBtn}>
            <Plus />
            New Project
          </button>
        </div>

      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.tabActive}`}>
          All Done (24)
        </button>
        <button className={styles.tab}>
          Recently Verified
        </button>
        <button className={styles.tab}>
          Archived
        </button>
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskItem}>
            <div className={styles.taskLeft}>
              <div className={styles.checkbox}>
                <input type="checkbox" checked disabled />
              </div>
              <div className={styles.taskInfo}>
                <span className={styles.taskTitle}>{task.title}</span>
                <div className={styles.taskMeta}>
                  <span>Completed on {task.date}</span>
                  <span className={styles.dot}></span>
                  <span>{task.category}</span>
                </div>
              </div>
            </div>
            <div className={styles.taskRight}>
              <div className={`${styles.statusBadge} ${task.status === 'verified' ? styles.verified : styles.pending}`}>
                <span className={`material-symbols-outlined ${task.status === 'verified' ? styles.iconActive : ''}`}>
                  {task.status === 'verified' ? 'verified' : 'pending'}
                </span>
                <span>
                  {task.status === 'verified' ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <button className={styles.moreButton}>
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className={styles.loadMore}>
        <button className={styles.loadMoreBtn}>Load Older Tasks</button>
      </div>
    </main>
  );
};

export default CompletedTasks;
