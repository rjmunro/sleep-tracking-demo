import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import FormComponent from "./FormComponent";
import UsersTableComponent from "./UsersTableComponent";
import UserChartComponent from "./UserChartComponent";

const queryClient = new QueryClient();

function SleepTracker() {
  const [selectedUserId, setSelectedUserId] = useState<number|null>(null);
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800">Cynomi Tech Task</h1>
      <FormComponent />
      <UsersTableComponent
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
      <UserChartComponent userId={selectedUserId} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SleepTracker />
    </QueryClientProvider>
  </React.StrictMode>
);
