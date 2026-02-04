import ProtectedLayout from "@/layouts/ProtectedLayout";
import PublicLayout from "@/layouts/PublicLayout";
import { Routes, Route } from "react-router";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import {
  protectedRoute,
  publicRoute,
  type AppRoute,
} from "@/app/routes/config";
import { Suspense } from "react";

const renderRoutes = (routes: AppRoute[]) => {
  return routes.map((route) => {
    const Component = route.element;
    
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={Component ? <Component /> : null}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          Component ? (
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          ) : null
        }
      />
    );
  });
};

export default function AppRouter() {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<PublicRoutes />}>
        <Route element={<PublicLayout />}>
          {renderRoutes(publicRoute as AppRoute[])}
        </Route>
      </Route>

      {/* protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<ProtectedLayout />}>
          {renderRoutes(protectedRoute as AppRoute[])}
        </Route>
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<h2>no route found</h2>} />
    </Routes>
  );
}
