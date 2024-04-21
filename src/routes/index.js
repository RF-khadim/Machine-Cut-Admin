import { lazy } from "react";
import Auth from "./auth";
import UnAuth from "./unauth";

const Login = lazy(() => import("../pages/login"));
const SignUp = lazy(() => import("../pages/signup"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Settings = lazy(() => import("../pages/settings"));
const Machines = lazy(() => import("../pages/machines"));
const Manufaturer = lazy(() => import("../pages/manufacturer"));
const AddEditManufaturer = lazy(() => import("../pages/manufacturer/addManufacturer"));
const Info = lazy(() => import("../pages/machines/info"));
const AddMachine = lazy(() => import("../pages/machines/addMachine"));
const EditMachine = lazy(() => import("../pages/machines/editMachine"));
const AddDistributor = lazy(() => import("../pages/members/addDistributor"));
const AddServicePoint = lazy(() => import("../pages/members/addServicePoint"));
const TransferMachine = lazy(() => import("../pages/machines/transferMachine"));
const AddFirmware = lazy(() => import("../pages/machines/addFirmware"));
const Notifications = lazy(() => import("../pages/notifications"));
const Inventory = lazy(() => import("../pages/inventory"));
const Reports = lazy(() => import("../pages/reports"));
const Products = lazy(() => import("../pages/products"));
const Members = lazy(() => import("../pages/members"));
const Users = lazy(() => import("../pages/users"));
const Category = lazy(() => import("../pages/category"));
const SingleCategory = lazy(() => import("../pages/category/singleCategory"));
const Accounts = lazy(() => import("../pages/accounts"));
const Variants = lazy(()=>import("../pages/variants"))

export const ROUTES = [
  {
    path: "/",
    component: Dashboard,
    route: Auth,
    exact: true,
  },
  {
    path: "/signup",
    component: SignUp,
    route: UnAuth,
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    route: UnAuth,
    exact: true,
  },

  {
    path: "/products",
    component: Products,
    route: Auth,
    exact: true,
  },
  {
    path: "/category",
    component: Category,
    route: Auth,
    exact: true,
  },
  {
    path: "/category/:id",
    component: SingleCategory,
    route: Auth,
    exact: true,
  },
  {
    path: "/settings",
    component: Settings,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines",
    component: Machines,
    route: Auth,
    exact: true,
  },
  {
    path: "/notifications",
    component: Notifications,
    route: Auth,
    exact: true,
  },
  {
    path: "/reports",
    component: Reports,
    route: Auth,
    exact: true,
  },
  {
    path: "/members",
    component: Members,
    route: Auth,
    exact: true,
  },
  {
    path: "/manufacturer",
    component: Manufaturer,
    route: Auth,
    exact: true,
  },
  {
    path: "/manufacturer/add",
    component: AddEditManufaturer,
    route: Auth,
    exact: true,
  },
  {
    path: "/manufacturer/:id",
    component: AddEditManufaturer,
    route: Auth,
    exact: true,
  },
  {
    path: "/members/servicePoint",
    component: AddServicePoint,
    route: Auth,
    exact: true,
  },
  {
    path: "/members/editServicePoint/:id",
    component: AddServicePoint,
    route: Auth,
    exact: true,
  },
  {
    path: "/members/distributor",
    component: AddDistributor,
    route: Auth,
    exact: true,
  },
  {
    path: "/members/editDistributor/:id",
    component: AddDistributor,
    route: Auth,
    exact: true,
  },
  {
    path: "/inventory",
    component: Inventory,
    route: Auth,
    exact: true,
  },
  {
    path: "/variants",
    component: Variants,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines",
    component: Machines,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines/:id",
    component: Info,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines/add",
    component: AddMachine,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines/edit/:id",
    component: EditMachine,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines/transfer",
    component: TransferMachine,
    route: Auth,
    exact: true,
  },
  {
    path: "/machines/firmware",
    component: AddFirmware,
    route: Auth,
    exact: true,
  },
  {
    path: "/user",
    component: Users,
    route: Auth,
    exact: true,
  },
  {
    path: "/account",
    component: Accounts,
    route: Auth,
    exact: true,
  },
];
