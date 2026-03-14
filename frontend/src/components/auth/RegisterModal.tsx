import { useState } from 'react';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import styles from './AuthModal.module.css';

export const RegisterModal = () => {
  const { registerModalOpen, closeRegisterModal, openLoginModal } = useModalStore();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await register({ email, username, password });

    if (success) {
      // Limpiar y cerrar
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("")
      clearError();
      closeRegisterModal();
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLocalError('');
    clearError();
    closeRegisterModal();
  };

  const switchToLogin = () => {
    handleClose();
    openLoginModal();
  };

  const displayError = localError || error;

  return (
    <Modal isOpen={registerModalOpen} onClose={handleClose} title="Crear Cuenta">
      <form onSubmit={handleSubmit} className={styles.form}>
        {displayError && (
          <div className={styles.error}>
            {displayError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="reg-email" className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              id="reg-email"
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
          <label htmlFor="reg-username" className={styles.label}>Username</label>
          <div className={styles.inputWrapper}>
            <User size={18} className={styles.inputIcon} />
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="miusuario"
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="reg-password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
              minLength={6}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="reg-confirm-password" className={styles.label}>Confirmar Password</label>
          <div className={styles.inputWrapper}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              id="reg-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            className={styles.switchButton}
          >
            Inicia Sesión
          </button>
        </p>
      </form>
    </Modal>
  );
};
