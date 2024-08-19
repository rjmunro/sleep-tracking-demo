import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import FormComponent from "./FormComponent";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <h1 className="text-4xl font-bold text-gray-800">Cynomi Tech Task</h1>
      <FormComponent />
    </QueryClientProvider>
  </React.StrictMode>
);
