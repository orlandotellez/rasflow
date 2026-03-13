import { Bell, Plus, Search } from 'lucide-react';
import styles from './TaskManagement.module.css';

const TaskManagement = () => {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.pageTitle}>Task Board</h2>
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
        <button className={`${styles.tab} ${styles.tabActive}`}>To Do</button>
        <button className={styles.tab}>In Progress</button>
        <button className={styles.tab}>Done</button>
        <button className={styles.tab}>Archived</button>
      </div>

      {/* Kanban Board */}
      <div className={styles.board}>
        {/* To Do Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <h3>To Do</h3>
              <span className={styles.badge}>4</span>
            </div>
            <button className={styles.moreButton}>more_horiz</button>
          </div>

          {/* Task Card 1 */}
          <div className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <span className={`${styles.priority} ${styles.priorityHigh}`}>High Priority</span>
              <span className={styles.editIcon}>edit</span>
            </div>
            <h4 className={styles.taskTitle}>Update Design System</h4>
            <p className={styles.taskDescription}>
              Refine dark mode color palette and Inter font styles for the Q4 product release.
            </p>
            <div className={styles.taskFooter}>
              <div className={styles.avatars}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlN_KHCPtZEAdc6yGJmwCg2igAUaVkgy0UtDVfiKSvbY_ibCYkc0TDS7GmQl0rWRFL75zekrxjLIpTun6AxTfqaExRda_tfwv4_AZ0ACcfvVB5aSJT3-yHKr3GvANccK6kpF7Oe1XGwrKm3mWG_nyYPuFD4PAuA3zMNxG0YDkLsCbIS-EDMGOlYtv6ER4lYtAfm_znxFjEj2K75kMLNN5wuhxW_2Qi5OZAlut1OZPn7fsYl6cN2Lzd5YlaIb4YB6PFPwfBcXwtIA4" alt="Avatar" className={styles.avatar} />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSau_KrVAT0EtbZdPpG_JF9mjfeqyKndK-b00V6ZIY1XDjpw5rvqtE6gbcrK5ySIrdRyDpbaTV0KsNDT1z5P25i5p-6grd1KR1fiL8oZoxfPknlYpn0jyd1xHEqWhIzDYOeYyMxpv7V8c-mzUO9963B4zqaMZ9-_Opex8C8KTJjEKuc-YOC4BhrWD8E_tfuzcXyjTxU5HuNm8rg3DoPYvyAZuBZobzbx1z0Bd3kbwuMNjXDdA3TtbXKl3ln-W3TK33h2J7lIBLBqw" alt="Avatar" className={styles.avatar} />
              </div>
              <div className={styles.comments}>
                <span>chat_bubble</span>
                <span>8</span>
              </div>
            </div>
          </div>

          {/* Task Card 2 */}
          <div className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <span className={`${styles.priority} ${styles.priorityLow}`}>Low Priority</span>
            </div>
            <h4 className={styles.taskTitle}>Documentation Cleanup</h4>
            <p className={styles.taskDescription}>
              Review and archive old meeting notes and outdated specification documents.
            </p>
            <div className={styles.taskFooter}>
              <div className={styles.avatars}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuANB_Jy-zIi5hjCzaLL-wDG5qy0iXgEAWvbguUOWEZwY-x8MKLQ-C434sLcZry5Su3Kcy-0043fUovBCibGl4Qv10RwJ1DCnKnVuNi05n87po7mhyMkuTE2vcn05IzcdXxtYsLQhlWjda-xcNGh4tdxChik8wZIfYyf-TUTBCmsc3GEiqJRj8TCltnWNQK3VqUXl3PpWzT0btiHdxjQ_2ueXK0DKSJpSyoS8ldKzVnXMbFD9eoj-2lln-Erp8883N0yM9XVvGaP5qc" alt="Avatar" className={styles.avatar} />
              </div>
              <div className={styles.comments}>
                <span>attach_file</span>
                <span>2</span>
              </div>
            </div>
          </div>

          <button className={styles.addTaskButton}>+ Add Task</button>
        </div>

        {/* In Progress Column */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <h3>In Progress</h3>
              <span className={styles.badge}>2</span>
            </div>
            <button className={styles.moreButton}>more_horiz</button>
          </div>

          {/* Task Card 3 */}
          <div className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <span className={`${styles.priority} ${styles.priorityMedium}`}>Medium Priority</span>
            </div>
            <h4 className={styles.taskTitle}>Fix API Integration</h4>
            <p className={styles.taskDescription}>
              Resolve 404 errors on the project dashboard endpoint and optimize query speeds.
            </p>
            <div className={styles.taskFooter}>
              <div className={styles.avatars}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRKdw31DPD7qdZ-CVkFBMlYG1liwye4itDI4cbC2v3_rWHWID678r_520jfW52fHUzlQX-FYsGNx0m_u0glAyZrGJ9vvanakf94q0ptdQdEKaCoUH-mbmcb1V0Hqr-29sNdLc3vlcm5oSjBz-l94v8wBN0-7a1AMWgRpaXPTF0rNRdtnef_fcv1YQxWU5LcC8Z_TMqYx7uco3ikdl5pZ_quoD2s33A48fGWUwx62xB-DbpUs1n0v9PtkPPismWlNaaryyYCmgJK4A" alt="Avatar" className={styles.avatar} />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiKmgv2JGkhuxnmwMWhkvzVfrojD-4HHI_aTW0Iax973LWCPMCSuUF3un65p1SsnNwTqq1lbrM8FDAAwSKyWf4aCSKaGA88stiBl-An6L0q8TrMTgIKGTfdkObDCFrTtFtk6TMJ1Vt72q9dNuoOtu9eiRvDmacF6KdL8deWuCQhi3uj4NJche8z92m0hr9jL5Y_Ct4SDgdJ6K3lwCnLovaYSTO-4C-bsigzcyx0kY2wvlkVFl-WUeU5_mjxI9OKl8Y61n2-8qZsM0" alt="Avatar" className={styles.avatar} />
              </div>
              <div className={styles.schedule}>
                <span>schedule</span>
                <span>2d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Done Column */}
        <div className={`${styles.column} ${styles.columnDone}`}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitle}>
              <h3>Done</h3>
              <span className={styles.badge}>1</span>
            </div>
            <button className={styles.moreButton}>more_horiz</button>
          </div>

          {/* Task Card 4 */}
          <div className={`${styles.taskCard} ${styles.taskCardDone}`}>
            <div className={styles.taskHeader}>
              <span className={styles.archived}>Archived</span>
            </div>
            <h4 className={styles.taskTitleDone}>User Interview Series</h4>
            <p className={styles.taskDescriptionDone}>
              Completed 10 interviews with current beta testers for feedback on the new UI.
            </p>
            <div className={styles.taskFooter}>
              <div className={styles.verified}>
                <span>check_circle</span>
                <span>VERIFIED</span>
              </div>
              <div className={styles.avatars}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmgk--V6BbITRZeliep8aOjCH_JW3Qb5CZnsM4OD8kQnOFAEbtsoR4SKiRxNNYES-BTXnqvJ_u6yqio5yJ7iZ-2Ax2dZlGAKghMV95RGHZthQmmBWRkiBLe--0oflCYWHuRQstclEfDitYL4jfe2k1USMnNp8wy3wr81bfyrn-90eyKAlq2Gfurmvzb03Fnw5Asm_MxfCXNm8qxRHguwBo45itSSomSCpMxCy2r7DnvFBRTbW-b8PE6345oB8-yHlBv1LbBROv-Us" alt="Avatar" className={styles.avatar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TaskManagement;
