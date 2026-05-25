import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { HomePage } from "@/pages/home";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* TODO: /search, /papers/:id, /trends, /reports, /dashboard */}
      </Route>
      <Route element={<AuthLayout />}>
        {/* TODO: /login, /register */}
      </Route>
    </Routes>
  );
}
