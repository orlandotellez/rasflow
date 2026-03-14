import styles from "./Navigation.module.css"

interface Navigation {
  viewMode: 'grid' | 'list'
  activeTab: string
  setViewMode: (viewMode: 'grid' | 'list') => void
  setActiveTab: (activeTab: string) => void
}

export const Navigation = ({ viewMode, activeTab, setViewMode, setActiveTab }: Navigation) => {
  return (
    <>
      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Projects
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'completed' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('list')}
          >
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

    </>
  )
}

