import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.jsx";
import "./index.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={
          <div
            className="alert alert-warning mt-3"
            role="alert"
            aria-live="polite"
          >
            An unexpected error has occurred. Please try again later.
          </div>
        }
      >
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
