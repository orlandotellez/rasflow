import { create } from 'zustand';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';

interface ModalState {
  loginModalOpen: boolean;
  registerModalOpen: boolean;

  // Project modal
  projectModalOpen: boolean;
  editingProject: Project | null;

  // Task modal
  taskModalOpen: boolean;
  editingTask: Task | null;
  taskProjectId: string | null;

  // Auth modals
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  closeAllModals: () => void;

  // Project modals
  openProjectModal: (project?: Project) => void;
  closeProjectModal: () => void;

  // Task modals
  openTaskModal: (projectId: string, task?: Task) => void;
  closeTaskModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  loginModalOpen: false,
  registerModalOpen: false,
  projectModalOpen: false,
  editingProject: null,
  taskModalOpen: false,
  editingTask: null,
  taskProjectId: null,

  openLoginModal: () => set({ loginModalOpen: true, registerModalOpen: false }),
  closeLoginModal: () => set({ loginModalOpen: false }),
  openRegisterModal: () => set({ registerModalOpen: true, loginModalOpen: false }),
  closeRegisterModal: () => set({ registerModalOpen: false }),
  closeAllModals: () => set({
    loginModalOpen: false,
    registerModalOpen: false,
    projectModalOpen: false,
    editingProject: null,
    taskModalOpen: false,
    editingTask: null,
    taskProjectId: null,
  }),

  openProjectModal: (project?: Project) => set({
    projectModalOpen: true,
    editingProject: project || null
  }),
  closeProjectModal: () => set({
    projectModalOpen: false,
    editingProject: null
  }),

  openTaskModal: (projectId: string, task?: Task) => set({
    taskModalOpen: true,
    editingTask: task || null,
    taskProjectId: projectId,
  }),
  closeTaskModal: () => set({
    taskModalOpen: false,
    editingTask: null,
    taskProjectId: null,
  }),
}));
