import { useEffect, useState } from 'react';
import { Bell, Search, CheckCircle } from 'lucide-react';
import { useCompletedTasksStore } from '@/store/completedTasksStore';
import { useAuthStore } from '@/store/authStore';
import { useTasksStore } from '@/store/taskStore';
import styles from './CompletedTasks.module.css';
import { PleaseLogIn } from '@/components/common/PleaseLogIn';
import { Loading } from '@/components/common/Loading';
import { Navigation } from '@/components/pages/completedTasks/Navigation';
import { CardCompleteTask } from '@/components/pages/completedTasks/CardCompleteTask';

const CompletedTasks = () => {
  const { tasks, isLoading, fetchCompletedTasks } = useCompletedTasksStore();
  const { isAuthenticated } = useAuthStore();
  const { deleteTask } = useTasksStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompletedTasks();
    }
  }, [isAuthenticated, fetchCompletedTasks]);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.project_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'recent') {
      // Últimas 24 horas
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return matchesSearch && new Date(task.created_at) > dayAgo;
    }

    return matchesSearch;
  });

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      fetchCompletedTasks(); // Recargar
    }
  };

  // Si no está autenticado
  if (!isAuthenticated) {
    return <PleaseLogIn page="Completed tasks" message="Please log in to view your completed tasks" />
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

      </header>

      {/* Loading */}
      {isLoading && <Loading text="Loading tasks..." />}

      {/* Tabs */}
      {!isLoading &&
        <Navigation
          tasks={tasks}
          filter={filter}
          setFilter={setFilter}
        />}

      {/* Task List */}
      {!isLoading && (
        <div className={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <CheckCircle size={48} className={styles.emptyIcon} />
              <p>No completed tasks yet</p>
              <span>Complete some tasks to see them here! 🎯</span>
            </div>
          ) : (
            filteredTasks.map((task) => <CardCompleteTask task={task} handleDeleteTask={handleDeleteTask} />)
          )}
        </div>
      )}
    </main>
  );
};

export default CompletedTasks;
