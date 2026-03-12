import { Route, Routes } from "react-router-dom"
import App from "@/App"
import Index from "@/pages/Index"
import TaskManagement from "@/pages/TaskManagement"
import UpcomingTasks from "@/pages/UpcomingTasks"
import UserProfile from "@/pages/UserProfile"
import CompletedTasks from "@/pages/CompletedTasks"
import Projects from "@/pages/Projects"

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/upcoming" element={<UpcomingTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  )
} 
