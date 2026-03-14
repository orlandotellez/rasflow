import { useModalStore } from "@/store/modalStore";
import styles from "./PleaseLogIn.module.css"

interface PleaseLogInProps {
  page: string
  message: string
}

export const PleaseLogIn = ({ page, message }: PleaseLogInProps) => {
  const { openLoginModal } = useModalStore();

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>{page}</h2>
            <p className={styles.pageSubtitle}>{message}</p>
          </header>

          <div className={styles.loginPrompt}>
            <p>You need to be logged in to access your {page}</p>
            <button onClick={openLoginModal} className={styles.loginButton}>
              Log In
            </button>
          </div>
        </div>
      </main>

    </>
  )
}

