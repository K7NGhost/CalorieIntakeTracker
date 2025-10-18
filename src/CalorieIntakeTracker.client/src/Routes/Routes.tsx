import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DesignPage from "../Pages/DesignPage/DesignPage";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import DashboardPage from "../Pages/DashboardPage/DashboardPage";
import LearnMorePage from "../Pages/LearnMorePage/LearnMorePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "", element: <HomePage></HomePage> },
      { path: "login", element: <LoginPage></LoginPage> },
      { path: "register", element: <RegisterPage></RegisterPage> },
      { path: "design", element: <DesignPage></DesignPage> },
      { path: "dashboard", element: <DashboardPage></DashboardPage>},
      { path: "learnMore", element: <LearnMorePage></LearnMorePage>}
    ],
  },
]);
