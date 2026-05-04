import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Customers } from "./pages/Customers";
import { Orders } from "./pages/Orders";
import { OrderStatus } from "./pages/OrderStatus";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { SecuritySettings } from "./pages/SecuritySettings";
import { DemoEncryption } from "./pages/DemoEncryption";
import { MainLayout } from "./components/MainLayout";

export const router = createBrowserRouter([
  { path: "/", Component: Login },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "customers", Component: Customers },
      { path: "orders", Component: Orders },
      { path: "status", Component: OrderStatus },
      { path: "reports", Component: Reports },
      { path: "security", Component: SecuritySettings },
      { path: "demo-enkripsi", Component: DemoEncryption },
      { path: "settings", Component: Settings },
    ],
  },
]);
