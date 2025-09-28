import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Loader from "@/components/shared/loader";
import { routes } from "@/config/route";
import AnimatedRoutes from "./animatedroute";
import { QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
