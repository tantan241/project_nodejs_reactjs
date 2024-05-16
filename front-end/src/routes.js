import BrandPage from "./container/BrandPage/BrandPage";
import BrandPageEdit from "./container/BrandPageEdit/BrandPageEdit";
import ProductEdit from "./container/ProductEdit/ProductEdit";
import Product from "./container/ProductPage/Product";
import OrderPage from "./container/OrderPage/OrderPage";
import Dashboard from "./container/Dashboard/Dashboard";
import CustomerPage from "./container/CustomerPage/CustomerPage";
import CustomerEdit from "./container/CustomerEdit/CustomerEdit";
import OrderEdit from "./container/OrderEdit/OrderEdit";
import AccountPage from "./container/AccountPage/AccountPage";

export const routes = [
  {
    path: "/brand",
    component: BrandPage,
  },
  {
    path: "/brand/:id",
    component: BrandPageEdit,
  },
  {
    path: "/product",
    component: Product,
  },
  {
    path: "/product/:id",
    component: ProductEdit,
  },
  {
    path: "/order",
    component: OrderPage,
  },
  {
    path: "/order/:id",
    component: OrderEdit,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/customer",
    component: CustomerPage,
  },
  {
    path: "/customer/:id",
    component: CustomerEdit,
  },
  {
    path: "/order/:id",
    component: OrderEdit,
  },
  {
    path: "/account",
    component: AccountPage,
  },
  {
    path: "/",
    component: Dashboard,
  },
  
];
