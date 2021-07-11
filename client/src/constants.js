import Admin from "./components/admin";
import User from "./components/user";
import Alerts from "./components/alerts";

export const routes = [
  {
    path: "/admin",
    component: Admin,
  },
  {
    path: "/user",
    component: User,
  },
  {
    path: "/alerts",
    component: Alerts,
  },
];
