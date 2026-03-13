import { Bell, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import styles from './UpcomingTasks.module.css';

const UpcomingTasks = () => {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.pageTitle}>Upcoming Tasks</h2>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton}>
            <Bell />
          </button>

          <div className={styles.searchBox}>
            <Search color='var(--font-color-text)' width={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search projects..."
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
        {/* Calendar Sidebar */}
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarNav}>
              <ChevronLeft color="var(--font-color-text)" />
            </button>
            <span className={styles.calendarMonth}>October 2023</span>
            <button className={styles.calendarNav}>
              <ChevronRight color="var(--font-color-text)" />
            </button>
          </div>

          <div className={styles.calendarWeekdays}>
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          <div className={styles.calendarGrid}>
            <span className={styles.dayDisabled}>28</span>
            <span className={styles.dayDisabled}>29</span>
            <span className={styles.dayDisabled}>30</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
            <span>11</span>
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span>15</span>
            <span>16</span>
            <span>17</span>
            <span>18</span>
            <span>19</span>
            <span>20</span>
            <span>21</span>
            <span>22</span>
            <span>23</span>
            <span className={styles.dayToday}>24</span>
            <span>25</span>
            <span>26</span>
            <span>27</span>
            <span>28</span>
            <span className={styles.dayCurrent}>29</span>
            <span>30</span>
            <span>31</span>
            <span className={styles.dayDisabled}>1</span>
          </div>
        </div>

        {/* Task List */}
        <div className={styles.taskList}>
          <div className={styles.taskTabs}>
            <button className={`${styles.taskTab} ${styles.taskTabActive}`}>All Tasks</button>
            <button className={styles.taskTab}>Work</button>
            <button className={styles.taskTab}>Personal</button>
          </div>

          {/* Today Section */}
          <section className={styles.taskSection}>
            <h3 className={styles.sectionTitle}>Today, Oct 24</h3>

            <div className={styles.taskItem}>
              <button className={styles.checkbox}>
                <span className="material-symbols-outlined">check</span>
              </button>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>Finalize quarterly presentation</h4>
                <p className={styles.taskMeta}>Q3 Review • 4:00 PM</p>
              </div>
              <div className={styles.taskActions}>
                <span className={`${styles.tag} ${styles.tagWork}`}>Work</span>
                <span className={styles.moreIcon}>more_vert</span>
              </div>
            </div>

            <div className={styles.taskItem}>
              <button className={styles.checkbox}>
                <span className="material-symbols-outlined">check</span>
              </button>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>Pick up dry cleaning</h4>
                <p className={styles.taskMeta}>Personal • 6:30 PM</p>
              </div>
              <div className={styles.taskActions}>
                <span className={`${styles.tag} ${styles.tagErrand}`}>Errand</span>
                <span className={styles.moreIcon}>more_vert</span>
              </div>
            </div>
          </section>

          {/* Tomorrow Section */}
          <section className={styles.taskSection}>
            <h3 className={styles.sectionTitle}>Tomorrow, Oct 25</h3>

            <div className={styles.taskItem}>
              <button className={styles.checkbox}>
                <span className="material-symbols-outlined">check</span>
              </button>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>Weekly team sync</h4>
                <p className={styles.taskMeta}>Team Management • 10:00 AM</p>
              </div>
              <div className={styles.taskIcons}>
                <span className="material-symbols-outlined">attach_file</span>
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>

            <div className={styles.taskItem}>
              <button className={styles.checkbox}>
                <span className="material-symbols-outlined">check</span>
              </button>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>Update project roadmap</h4>
                <p className={styles.taskMeta}>Design Ops • 2:00 PM</p>
              </div>
              <div className={styles.taskActions}>
                <span className={`${styles.tag} ${styles.tagInternal}`}>Internal</span>
              </div>
            </div>
          </section>

          {/* Later Section */}
          <section className={styles.taskSection}>
            <h3 className={styles.sectionTitle}>Monday, Oct 29</h3>

            <div className={`${styles.taskItem} ${styles.taskEvent}`}>
              <span className="material-symbols-outlined">event</span>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitleItalic}>Project Launch: Nova Beta</h4>
                <p className={styles.taskMeta}>All day event</p>
              </div>
            </div>

            <div className={styles.taskItem}>
              <button className={styles.checkbox}>
                <span className="material-symbols-outlined">check</span>
              </button>
              <div className={styles.taskContent}>
                <h4 className={styles.taskTitle}>Monthly subscription audit</h4>
                <p className={styles.taskMeta}>Finance • 9:00 AM</p>
              </div>
              <div className={styles.taskActions}>
                <span className={`${styles.tag} ${styles.tagRecurring}`}>Recurring</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UpcomingTasks;
