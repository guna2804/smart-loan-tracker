import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Lazy load components
const Dashboard = lazy(() => import("./components/Dashboard"));
const LoanTracker = lazy(() => import("./components/LoanTracker"));
const RepaymentLog = lazy(() => import("./components/RepaymentLog"));
const EMICalculator = lazy(() => import("./components/EMICalculator"));
const Settings = lazy(() => import("./components/Settings"));
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const SignUpPage = lazy(() => import("./components/auth/SignUpPage"));
const Sidebar = lazy(() => import("./components/Sidebar"));

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
    <Sidebar />
    <div className="flex-1 ml-64">
      {children}
    </div>
  </div>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    )
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/loans",
    element: (
      <ProtectedRoute>
        <Layout>
          <LoanTracker />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/repayments",
    element: (
      <ProtectedRoute>
        <Layout>
          <RepaymentLog />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/calculator",
    element: (
      <ProtectedRoute>
        <Layout>
          <EMICalculator />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Layout>
          <Settings />
        </Layout>
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
