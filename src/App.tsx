import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalLoaderProvider } from "./contexts/GlobalLoaderContext";
import { router } from "./routes";
import GlobalLoader from "./components/ui/global-loader";
import { Toaster } from "./components/ui/toaster";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalLoaderProvider>
        <AuthProvider>
          <Suspense fallback={<GlobalLoader />}>
            <RouterProvider router={router} />
          </Suspense>
          <GlobalLoader />
          <Toaster />
        </AuthProvider>
      </GlobalLoaderProvider>
    </ThemeProvider>
  );
}

export default App;
