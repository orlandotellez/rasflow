import { useDashboardStore } from "@/store/dashboardStore";
import styles from "./ProductivityChart.module.css"

export const ProductivityChart = () => {
  const { weeklyData } = useDashboardStore();

  // Calcular altura máxima para las barras (normalizar)
  const maxCompleted = Math.max(...weeklyData.map(d => d.completed), 1);

  return (
    <>
      {/* Productivity Chart - With real data */}
      <div className={styles.productivityCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Productivity Trends</h3>
            <p className={styles.cardSubtitle}>Weekly task completion activity</p>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chartBars}>
            {weeklyData.map((data) => (
              <div
                key={data.day}
                className={styles.chartBar}
                style={{ height: `${(data.completed / maxCompleted) * 100}%` }}
              >
                {data.completed > 0 && (
                  <span className={styles.chartTooltip}>{data.completed}</span>
                )}
              </div>
            ))}
          </div>
          <div className={styles.chartLabels}>
            {weeklyData.map((data) => (
              <span key={data.day}>{data.day}</span>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

