import { useState, useEffect } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useTasksStore } from '@/store/taskStore';
import { useModalStore } from '@/store/modalStore';
import type { TaskStatus } from '@/types/task';
import styles from './TaskModal.module.css';

export const TaskModal = () => {
  const { taskModalOpen, editingTask, taskProjectId, closeTaskModal } = useModalStore();
  const { createTask, updateTask, isLoading, error, clearError } = useTasksStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (taskModalOpen) {
      setTitle(editingTask?.title || '');
      setDescription(editingTask?.description || '');
      setStatus(editingTask?.status || 'todo');
      setLocalError('');
      clearError();
    }
  }, [taskModalOpen, editingTask, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!title.trim()) {
      setLocalError('Task title is required');
      return;
    }

    if (!taskProjectId) {
      setLocalError('No project selected');
      return;
    }

    let success: boolean;

    if (editingTask) {
      success = await updateTask(
        editingTask.id,
        title.trim(),
        description.trim() || undefined,
        status
      );
    } else {
      success = await createTask(
        taskProjectId,
        title.trim(),
        description.trim() || undefined,
        status
      );
    }

    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setLocalError('');
    clearError();
    closeTaskModal();
  };

  const displayError = localError || error;
  const isEditing = !!editingTask;

  return (
    <Modal
      isOpen={taskModalOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {displayError && (
          <div className={styles.error}>
            {displayError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="task-title" className={styles.label}>
            Task Title
          </label>
          <div className={styles.inputWrapper}>
            <CheckSquare size={18} className={styles.inputIcon} />
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome task"
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="task-description" className={styles.label}>
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="task-status" className={styles.label}>
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={styles.select}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
