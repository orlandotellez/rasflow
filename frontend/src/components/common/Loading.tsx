import styles from "./Loading.module.css"
import { Loader2 } from "lucide-react";

interface LoadingProps {
  text: string;
  subtext?: string;
}

export const Loading = ({ text, subtext }: LoadingProps) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Loader2 className={styles.spinner} />
          <span>{text}</span>
          <span>{subtext}</span>
        </div>
      </div>

    </>
  )
}
