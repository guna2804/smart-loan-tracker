import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import GlobalLoader from "./components/ui/global-loader";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<GlobalLoader />}> 
        <RouterProvider router={router} />
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
