import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || "Error inesperado al cargar." };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#B8D8F8] text-[#2B1D47] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-3xl border-3 border-[#3A265E] bg-[#FDFFB6] p-6 text-center shadow-lg">
            <h1 className="font-display text-3xl font-extrabold uppercase text-[#3A265E]">
              Mente Adolescente: Explora y Juega
            </h1>
            <p className="mt-2 text-sm font-semibold">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="pastel-btn bg-[#B9FBC0] mt-4"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
