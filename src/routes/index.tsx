import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import Layout from "./Layout";

const Dashboard = lazy(() => import("../components/Dashboard"));
const LoanTracker = lazy(() => import("../components/LoanTracker"));
const RepaymentLog = lazy(() => import("../components/RepaymentLog"));
const EMICalculator = lazy(() => import("../components/EMICalculator"));
const Settings = lazy(() => import("../components/Settings"));
const LoginPage = lazy(() => import("../components/auth/LoginPage"));
const SignUpPage = lazy(() => import("../components/auth/SignUpPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/loans",
    element: (
      <ProtectedRoute>
        <Layout>
          <LoanTracker />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/repayments",
    element: (
      <ProtectedRoute>
        <Layout>
          <RepaymentLog />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/calculator",
    element: (
      <ProtectedRoute>
        <Layout>
          <EMICalculator />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Layout>
          <Settings />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);
