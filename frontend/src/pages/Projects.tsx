import { useEffect, useState } from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import { useProjectsStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import styles from './Projects.module.css';
import { PleaseLogIn } from '@/components/common/PleaseLogIn';
import { Loading } from '@/components/common/Loading';
import { Navigation } from '@/components/pages/projects/Navigation';
import { NoProjects } from '@/components/pages/projects/NoProjects';
import { MyProjects } from '@/components/pages/projects/MyProjects';

const Projects = () => {
  const { projects, isLoading, error, pagination, fetchProjects, deleteProject } = useProjectsStore();
  const { isAuthenticated } = useAuthStore();
  const { openProjectModal } = useModalStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, fetchProjects]);

  // Filtrar proyectos por búsqueda
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear fecha

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return <PleaseLogIn page="Projects" message="Please log in to view your projects" />
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.newProjectBtn}
            onClick={() => openProjectModal()}
          >
            <Plus />
            New Project
          </button>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && <Loading text='Loading projects...' />}

      {/* Error State */}
      {error && !isLoading && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={() => fetchProjects()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {/* View Controls */}
      {!isLoading && !error && (
        <>
          <Navigation
            activeTab={activeTab}
            viewMode={viewMode}
            setActiveTab={setActiveTab}
            setViewMode={setViewMode}
          />

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                {activeTab === 'all' ? 'All Projects' :
                  activeTab === 'active' ? 'Active Projects' : 'Completed Projects'}
              </h3>
              <p className={styles.sectionSubtitle}>
                You have {pagination.total} project{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <NoProjects />
            ) : (
              <MyProjects filteredProjects={filteredProjects} handleDeleteProject={handleDeleteProject} />
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default Projects;
