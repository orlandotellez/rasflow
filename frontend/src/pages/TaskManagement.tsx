import { useEffect, useState } from 'react';
import { Bell, Loader2, Plus, CheckSquare, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useTasksStore } from '@/store/taskStore';
import { useProjectsStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import type { Task, TaskStatus } from '@/types/task';
import styles from './TaskManagement.module.css';
import { PleaseLogIn } from '@/components/common/PleaseLogIn';
import { NoProjects } from '@/components/pages/tasks/NoProjects';
import { TaskCard } from '@/components/pages/tasks/TaskCard';
import { Navigation } from '@/components/pages/tasks/Navigation';

const TaskManagement = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, deleteTask } = useTasksStore();
  const { projects, fetchProjects } = useProjectsStore();
  const { isAuthenticated } = useAuthStore();
  const { openTaskModal } = useModalStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [selectedProjectId, fetchTasks]);

  // Seleccionar primer proyecto automáticamente si hay uno
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // NO filtrar por tab para los contadores - siempre usar todas las tareas
  const allTasks = tasks;

  // Contadores totales (sin filtrar por tab)
  const totalTodo = allTasks.filter(t => t.status === 'todo').length;
  const totalInProgress = allTasks.filter(t => t.status === 'in_progress').length;
  const totalDone = allTasks.filter(t => t.status === 'done').length;

  // Agrupar tareas por status (filtradas por el tab activo)
  const filteredTasks = activeTab === 'all'
    ? allTasks
    : allTasks.filter(t => t.status === activeTab);

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  // Si no está autenticado
  if (!isAuthenticated) {
    return <PleaseLogIn page="Task Management" message="Please log in to view your task management" />
  }

  // Si no hay proyectos
  if (projects.length === 0) {
    return <NoProjects />
  }

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.pageTitle}>Task Board</h2>

          {/* Project Selector */}
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className={styles.projectSelect}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton}>
            <Bell />
          </button>
          <button
            className={styles.newTaskBtn}
            onClick={() => openTaskModal(selectedProjectId!)}
            disabled={!selectedProjectId}
          >
            <Plus />
            New Task
          </button>
        </div>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p>Loading tasks...</p>
        </div>
      )}

      {/* Tabs */}
      {!isLoading &&
        <Navigation
          tasks={tasks}
          totalDone={totalDone}
          totalInProgress={totalInProgress}
          totalTodo={totalTodo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />}

      {/* Kanban Board */}
      {!isLoading && (
        <div className={styles.board}>
          {/* To Do Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <CheckSquare size={16} />
                <h3>To Do</h3>
                <span className={styles.badge}>{todoTasks.length}</span>
              </div>
            </div>

            {
              todoTasks.map((task: Task) => (
                <TaskCard
                  task={task}
                  selectedProjectId={selectedProjectId}
                  handleStatusChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  handleDeleteTask={handleDeleteTask}
                />
              ))
            }

            <button
              className={styles.addTaskButton}
              onClick={() => openTaskModal(selectedProjectId!)}
            >
              + Add Task
            </button>
          </div>

          {/* In Progress Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <Clock size={16} />
                <h3>In Progress</h3>
                <span className={styles.badge}>{inProgressTasks.length}</span>
              </div>
            </div>
            {inProgressTasks.map((progessTask) => (
              <TaskCard
                task={progessTask}
                selectedProjectId={selectedProjectId}
                handleStatusChange={(e) => handleStatusChange(progessTask.id, e.target.value as TaskStatus)}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          {/* Done Column */}
          <div className={`${styles.column} ${styles.columnDone}`}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <CheckCircle size={16} />
                <h3>Done</h3>
                <span className={styles.badge}>{doneTasks.length}</span>
              </div>
            </div>
            {doneTasks.map(task => (
              <div key={task.id} className={`${styles.taskCard} ${styles.taskCardDone}`}>
                <h4 className={styles.taskTitleDone}>{task.title}</h4>
                <div className={styles.taskFooter}>
                  <div className={styles.verified}>
                    <CheckCircle size={14} />
                    <span>COMPLETED</span>
                  </div>
                  <div className={styles.taskFooter}>
                    {/* Quick status change */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className={styles.statusSelect}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={styles.actionButton}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default TaskManagement;
