import {
  LayoutDashboard,
  Presentation,
  Tags,
  LucideComponent,
  ArrowsUpFromLineIcon,
  User,
} from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Tags, label: "Task management", path: "/tasks" },
  { icon: ArrowsUpFromLineIcon, label: "Upcoming tasks", path: "/upcoming" },

  { icon: LucideComponent, label: "Completed tasks", path: "/completed" },
  { icon: Presentation, label: "Projects", path: "/projects" },
  { icon: User, label: "User profile", path: "/profile" },
];


