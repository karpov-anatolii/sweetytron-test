import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";
import DevicePage from "./pages/DevicePage";
import EditDevicePage from "./pages/EditDevicePage";
import Shop from "./pages/Shop";
import {
  ADMIN_ROUTE,
  ARTICLE_ROUTE,
  CART_ROUTE,
  DEVICE_ROUTE,
  LOGIN_ROUTE,
  ORDERS_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from "./utils/consts";
import ArticlePage from "./pages/ArticlePage";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Element: Admin,
  },
  {
    path: CART_ROUTE,
    Element: Cart,
  },
  {
    path: ORDERS_ROUTE,
    Element: OrdersPage,
  },

  {
    path: DEVICE_ROUTE + "/:id/edit",
    Element: EditDevicePage,
  },
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Element: Shop,
  },
  {
    path: LOGIN_ROUTE,
    Element: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Element: Auth,
  },
  {
    path: DEVICE_ROUTE + "/:id",
    Element: DevicePage,
  },
  {
    path: ARTICLE_ROUTE + "/:id",
    Element: ArticlePage,
  },
];
