"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "@/redux/store";
const InitializeUser = dynamic(() => import("@/Components/InitializeUser"), {
  ssr: false,
});
import dynamic from "next/dynamic";

interface ReactQueryProviderProp {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<ReactQueryProviderProp> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <InitializeUser />
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

export default ReactQueryProvider;
