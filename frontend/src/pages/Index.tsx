import { Bell, ClipboardCheck, ClipboardClock, ClipboardList, Hourglass, Plus, Search } from 'lucide-react';
import styles from './Index.module.css';

const Index = () => {
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
              className={styles.searchInput}
            />
          </div>
          <button className={styles.newProjectBtn}>
            <Plus />
            New Project
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Summary Widgets */}
        <div className={styles.widgetsGrid}>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <ClipboardList color="var(--font-color-title)" />

              <span className={styles.widgetBadge}>+12.5%</span>
            </div>
            <p className={styles.widgetLabel}>Total Tasks</p>
            <h3 className={styles.widgetValue}>128</h3>
          </div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <ClipboardClock color="var(--font-color-title)" />
              <span className={`${styles.widgetBadge} ${styles.badgeStable}`}>Stable</span>
            </div>
            <p className={styles.widgetLabel}>In Progress</p>
            <h3 className={styles.widgetValue}>12</h3>
          </div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <ClipboardCheck color="var(--font-color-title)" />
              <span className={styles.widgetBadge}>+5%</span>
            </div>
            <p className={styles.widgetLabel}>Completed Week</p>
            <h3 className={styles.widgetValue}>45</h3>
          </div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <Hourglass color="var(--font-color-title)" />
              <span className={`${styles.widgetBadge} ${styles.badgeNegative}`}>-2%</span>
            </div>
            <p className={styles.widgetLabel}>Average Time</p>
            <h3 className={styles.widgetValue}>4.2h</h3>
          </div>
        </div>

        {/* Middle Section */}
        <div className={styles.middleGrid}>
          {/* Productivity Chart */}
          <div className={styles.productivityCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Productivity Trends</h3>
                <p className={styles.cardSubtitle}>Weekly task completion activity</p>
              </div>
              <div className={styles.cardTabs}>
                <button className={`${styles.cardTab} ${styles.cardTabActive}`}>Week</button>
                <button className={styles.cardTab}>Month</button>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <div className={styles.chartBars}>
                <div className={styles.chartBar} style={{ height: '60%' }}>
                  <span className={styles.chartTooltip}>12</span>
                </div>
                <div className={styles.chartBar} style={{ height: '40%' }}></div>
                <div className={styles.chartBar} style={{ height: '85%' }}></div>
                <div className={styles.chartBar} style={{ height: '55%' }}></div>
                <div className={styles.chartBar} style={{ height: '95%' }}></div>
                <div className={styles.chartBar} style={{ height: '70%' }}></div>
                <div className={styles.chartBar} style={{ height: '45%' }}></div>
              </div>
              <div className={styles.chartLabels}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span className={styles.labelActive}>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className={styles.projectsCard}>
            <h3 className={styles.cardTitle}>Active Projects</h3>
            <div className={styles.projectsList}>
              <div className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectName}>Brand Identity</span>
                  <span className={styles.projectPercent}>85%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectName}>Mobile App UI</span>
                  <span className={styles.projectPercent}>42%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressMedium}`} style={{ width: '42%' }}></div>
                </div>
              </div>
              <div className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectName}>Marketing Website</span>
                  <span className={styles.projectPercent}>12%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={`${styles.progressFill} ${styles.progressLow}`} style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            <button className={styles.viewAllBtn}>View All Projects</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomGrid}>
          {/* Due Today */}
          <div className={styles.dueTodayCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Due Today</h3>
              <span className={styles.remainingBadge}>4 Tasks Remaining</span>
            </div>
            <div className={styles.taskList}>
              <div className={styles.taskItem}>
                <div className={styles.taskLeft}>
                  <button className={styles.checkbox}>
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>Review Design System</p>
                    <p className={styles.taskMeta}>Project: Brand Identity • 2:00 PM</p>
                  </div>
                </div>
                <div className={styles.taskRight}>
                  <div className={styles.taskTeam}>
                    <div className={styles.teamAvatar}></div>
                    <div className={`${styles.teamAvatar} ${styles.teamMore}`}>+2</div>
                  </div>
                  <span className={styles.moreIcon}>more_horiz</span>
                </div>
              </div>
              <div className={styles.taskItem}>
                <div className={styles.taskLeft}>
                  <button className={styles.checkbox}>
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>Client Meeting - Kickoff</p>
                    <p className={styles.taskMeta}>Internal • 4:30 PM</p>
                  </div>
                </div>
                <div className={styles.taskRight}>
                  <span className={styles.priorityTag}>High Priority</span>
                  <span className={styles.moreIcon}>more_horiz</span>
                </div>
              </div>
              <div className={styles.taskItem}>
                <div className={styles.taskLeft}>
                  <button className={styles.checkbox}>
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>Prepare Q3 Report</p>
                    <p className={styles.taskMeta}>Admin • 6:00 PM</p>
                  </div>
                </div>
                <div className={styles.taskRight}>
                  <span className={styles.moreIcon}>more_horiz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.activityCard}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={`${styles.activityDot} ${styles.dotActive}`}></span>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Updated Mobile App Specs</p>
                  <p className={styles.activityTime}>Today, 10:24 AM by Sarah K.</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityDot}></span>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Project "Website Redesign" Completed</p>
                  <p className={styles.activityTime}>Yesterday, 4:12 PM</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityDot}></span>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Added 4 new tasks to Brand Audit</p>
                  <p className={styles.activityTime}>Yesterday, 2:45 PM by John M.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
