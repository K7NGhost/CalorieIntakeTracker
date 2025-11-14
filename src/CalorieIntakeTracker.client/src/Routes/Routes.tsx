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
import ProtectedRoute from "./ProtectedRoute";
import SetupPage from "../Pages/SetupPage/SetupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "", element: <HomePage></HomePage> },
      { path: "login", element: <LoginPage></LoginPage> },
      { path: "register", element: <RegisterPage></RegisterPage> },
      { path: "design", element: <DesignPage></DesignPage> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage></DashboardPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "aiScan",
        element: (
          <ProtectedRoute>
            <AiPage></AiPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "barcodeScan",
        element: (
          <ProtectedRoute>
            <BarcodeScanPage></BarcodeScanPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "foodSearch",
        element: (
          <ProtectedRoute>
            <FoodSearchPage></FoodSearchPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "setup",
        element: (
          <ProtectedRoute>
            <SetupPage></SetupPage>
          </ProtectedRoute>
        ),
      },
      { path: "learnMore", element: <LearnMorePage></LearnMorePage> },
    ],
  },
]);
