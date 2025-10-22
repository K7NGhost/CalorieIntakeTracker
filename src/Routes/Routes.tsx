import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DesignPage from "../Pages/DesignPage/DesignPage";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import DashboardPage from "../Pages/DashboardPage/DashboardPage";
import LearnMorePage from "../Pages/LearnMorePage/LearnMorePage";
import AiPage from "../Pages/AiPage/AiPage";
import BarcodeScanPage from "../Pages/BarcodeScanPage/BarcodeScanPage";
import FoodSearchPage from "../Pages/FoodSearchPage/FoodSearchPage";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "", element: <HomePage></HomePage> },
      { path: "login", element: <LoginPage></LoginPage> },
      { path: "register", element: <RegisterPage></RegisterPage> },
      { path: "design", element: <DesignPage></DesignPage> },
      { path: "dashboard", element: <DashboardPage></DashboardPage> },
      { path: "aiScan", element: <AiPage></AiPage> },
      { path: "barcodeScan", element: <BarcodeScanPage></BarcodeScanPage> },
      { path: "foodSearch", element: <FoodSearchPage></FoodSearchPage> },
      { path: "learnMore", element: <LearnMorePage></LearnMorePage> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage></NotFoundPage>,
  },
]);
