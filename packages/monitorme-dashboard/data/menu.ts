import {
  CogIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
  ShareIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  AdjustmentsIcon,
  ServerIcon,
} from "@heroicons/react/outline";

export const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  {
    name: "Spans",
    href: "/spans",
    icon: AdjustmentsIcon,
    current: false,
  },
  { name: "Events", href: "/events", icon: EyeIcon, current: false },
  { name: "Sessions", href: "/sessions", icon: ShareIcon, current: false },
  {
    name: "Trigger Routes",
    href: "/trigger_routes",
    icon: ServerIcon,
    current: false,
  },
  {
    name: "Issues",
    href: "/issues",
    icon: ExclamationCircleIcon,
    current: false,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    current: false,
  },
];

export const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: CogIcon },
  { name: "Help", href: "/help", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "/privacy", icon: ShieldCheckIcon },
];

export const cards = [
  {
    id: "frontend",
    name: "Frontend Errors",
    href: "/issues",
    Icon: ExclamationCircleIcon, // Represents client-side errors
    count: "",
    type: "error",
  },
  {
    id: "backend",
    name: "HTTP Errors",
    href: "/issues",
    Icon: ShieldExclamationIcon, // Represents server-side errors
    count: "",
    type: "error",
  },
  {
    id: "traces",
    name: "Spans & Events",
    href: "/sessions",
    Icon: ChartBarIcon, // Represents analytics and tracking
    count: "",
    type: "info",
  },
];

export const statusStyles = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-gray-100 text-gray-800",
};
