import { Bell, Plus, Search } from 'lucide-react';
import styles from './Projects.module.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Mobile App Redesign',
      description: 'Creating a new design system for the core mobile application and user interface components.',
      progress: 74,
      status: 'onTrack',
      icon: 'design_services',
      dueDate: 'Nov 24',
      teamSize: 5
    },
    {
      id: 2,
      title: 'Backend Infrastructure',
      description: 'Migrating core services to a more scalable architecture and database optimization.',
      progress: 32,
      status: 'atRisk',
      icon: 'terminal',
      dueDate: 'Dec 12',
      teamSize: 2
    },
    {
      id: 3,
      title: 'Q4 Market Report',
      description: 'Analytical study of market trends and performance metrics for the final quarter.',
      progress: 90,
      status: 'inReview',
      icon: 'analytics',
      dueDate: 'Tomorrow',
      teamSize: 1
    },
    {
      id: 4,
      title: 'Brand Awareness Ad',
      description: 'Social media campaign focused on new user acquisition and brand storytelling.',
      progress: 58,
      status: 'onTrack',
      icon: 'campaign',
      dueDate: 'Jan 15',
      teamSize: 3
    },
    {
      id: 5,
      title: 'Customer Support Portal',
      description: 'Revamping the help center and ticketing system integration for better user support.',
      progress: 15,
      status: 'onHold',
      icon: 'support_agent',
      dueDate: 'Feb 10',
      teamSize: 1
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'onTrack': return styles.statusOnTrack;
      case 'atRisk': return styles.statusAtRisk;
      case 'inReview': return styles.statusInReview;
      case 'onHold': return styles.statusOnHold;
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'onTrack': return 'On Track';
      case 'atRisk': return 'At Risk';
      case 'inReview': return 'In Review';
      case 'onHold': return 'On Hold';
      default: return status;
    }
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <h2 className={styles.pageTitle}>Projects</h2>
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

      {/* View Controls */}
      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>All Projects</button>
          <button className={styles.tab}>Active</button>
          <button className={styles.tab}>Completed</button>
          <button className={styles.tab}>Archived</button>
        </div>
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${styles.viewBtnActive}`}>
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className={styles.viewBtn}>
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Active Projects</h3>
          <p className={styles.sectionSubtitle}>You have 8 active projects this month</p>
        </div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <div className={styles.projectIcon}>
                  <span className="material-symbols-outlined">{project.icon}</span>
                </div>
                <span className={`${styles.status} ${getStatusClass(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h4 className={styles.projectTitle}>{project.title}</h4>
                <p className={styles.projectDesc}>{project.description}</p>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressValue}>{project.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.teamAvatars}>
                  {project.teamSize <= 3 ? (
                    Array.from({ length: project.teamSize }).map((_, i) => (
                      <div key={i} className={styles.teamAvatar}></div>
                    ))
                  ) : (
                    <>
                      <div className={styles.teamAvatar}></div>
                      <div className={styles.teamAvatar}></div>
                      <div className={`${styles.teamAvatar} ${styles.teamAvatarMore}`}>
                        +{project.teamSize - 2}
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.dueDate}>
                  <span className="material-symbols-outlined">calendar_today</span>
                  Due {project.dueDate}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button className={styles.addProjectCard}>
            <div className={styles.addIcon}>
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className={styles.addText}>Start New Project</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Projects;
