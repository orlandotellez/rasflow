import { SideBar } from "./SideBar";
import styles from "./DashboardLayout.module.css";
import { useSideBarStore } from "@/store/sideBarStore";

interface DashboardLayout {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayout) => {
  const { collapsed } = useSideBarStore();

  return (
    <>
      <div
        className={`${styles.container} ${collapsed ? styles.collapsed : styles.expanded
          }`}
      >
        <SideBar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </>
  );
};
