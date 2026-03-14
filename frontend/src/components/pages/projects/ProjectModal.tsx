import { useState, useEffect } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useProjectsStore } from '@/store/projectStore';
import { useModalStore } from '@/store/modalStore';
import styles from './ProjectModal.module.css';

export const ProjectModal = () => {
  const { projectModalOpen, editingProject, closeProjectModal } = useModalStore();
  const { createProject, updateProject, isLoading, error, clearError } = useProjectsStore();

  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  // Reset form when modal opens/closes or editingProject changes
  useEffect(() => {
    if (projectModalOpen) {
      setName(editingProject?.name || '');
      setLocalError('');
      clearError();
    }
  }, [projectModalOpen, editingProject, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('Project name is required');
      return;
    }

    let success: boolean;

    if (editingProject) {
      success = await updateProject(editingProject.id, name.trim());
    } else {
      success = await createProject(name.trim());
    }

    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setLocalError('');
    clearError();
    closeProjectModal();
  };

  const displayError = localError || error;
  const isEditing = !!editingProject;

  return (
    <Modal
      isOpen={projectModalOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {displayError && (
          <div className={styles.error}>
            {displayError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="project-name" className={styles.label}>
            Project Name
          </label>
          <div className={styles.inputWrapper}>
            <Folder size={18} className={styles.inputIcon} />
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              className={styles.input}
              required
            />
          </div>
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
              isEditing ? 'Update Project' : 'Create Project'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
