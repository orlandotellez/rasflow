import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { LoginModal } from "./components/auth/LoginModal"
import { RegisterModal } from "./components/auth/RegisterModal"
import { ProjectModal } from "./components/pages/projects/ProjectModal"
import { TaskModal } from "./components/pages/tasks/TaskModal"
import { useAuthStore } from "./store/authStore"
import { setOnUnauthorizedCallback } from "./api/client"
import "./index.css"

function App() {
  const { checkAuth, logout } = useAuthStore()

  useEffect(() => {
    // Verificar auth al iniciar la app
    checkAuth()

    // Configurar callback para logout por 401
    setOnUnauthorizedCallback(() => {
      logout()
    })

    // Cleanup al desmontar
    return () => {
      setOnUnauthorizedCallback(null)
    }
  }, [checkAuth, logout])

  return (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>

      {/* Modales de Auth */}
      <LoginModal />
      <RegisterModal />

      {/* Modal de Proyectos */}
      <ProjectModal />

      {/* Modal de Tareas */}
      <TaskModal />
    </>
  )
}

export default App
