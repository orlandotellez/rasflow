import {
  LayoutDashboard,
  Presentation,
  Tags,
  LucideComponent,
  User,
} from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Presentation, label: "Projects", path: "/projects" },
  { icon: Tags, label: "Task management", path: "/tasks" },
  { icon: LucideComponent, label: "Completed tasks", path: "/completed" },
  { icon: User, label: "User profile", path: "/profile" },
];


