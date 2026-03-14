import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tags, LogOut, LogIn, UserPlus } from "lucide-react";
import { navItems } from "@/routes/NavItems";
import styles from "./SideBar.module.css";
import { useSideBarStore } from "@/store/sideBarStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

export const SideBar = () => {
  const { collapsed, setCollapsed } = useSideBarStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { openLoginModal, openRegisterModal } = useModalStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : styles.expanded
          }`}
      >
        {/* Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Tags className={styles.iconLarge} />
          </div>

          {!collapsed && (
            <div className={styles.logoText}>
              <h1>Rasflow</h1>
              <p>Gestión de tareas</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${styles.navItem} ${isActive ? styles.active : ""} ${collapsed ? styles.isCollapsedIcon : ""}`}
              >
                <Icon />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className={styles.collapseContainer}>
          <button onClick={setCollapsed} className={styles.collapseButton}>
            {collapsed ? (
              <ChevronRight className={styles.icon} />
            ) : (
              <>
                <ChevronLeft className={styles.icon} />
                <span className={styles.collapseText}>Colapsar</span>
              </>
            )}
          </button>
        </div>

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className={styles.authSection}>
            <button onClick={logout} className={styles.logoutButton}>
              <LogOut size={24} />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <button
              onClick={openLoginModal}
              className={styles.loginButton}
            >
              <LogIn />
              {!collapsed && "Iniciar Sesión"}
            </button>
            <button
              onClick={openRegisterModal}
              className={styles.registerButton}
            >
              <UserPlus />
              {!collapsed && "Registrarse"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
