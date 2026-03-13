import { Outlet } from "react-router-dom"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import "./index.css"

function App() {
  return (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  )
}

export default App
