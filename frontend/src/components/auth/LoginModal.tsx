import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import styles from './AuthModal.module.css';

export const LoginModal = () => {
  const { loginModalOpen, closeLoginModal, openRegisterModal } = useModalStore();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login({ email, password });

    if (success) {
      // Limpiar y cerrar
      setEmail('');
      setPassword('');
      clearError();
      closeLoginModal();
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    clearError();
    closeLoginModal();
  };

  const switchToRegister = () => {
    handleClose();
    openRegisterModal();
  };

  return (
    <Modal isOpen={loginModalOpen} onClose={handleClose} title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            className={styles.switchButton}
          >
            Regístrate
          </button>
        </p>
      </form>
    </Modal>
  );
};
