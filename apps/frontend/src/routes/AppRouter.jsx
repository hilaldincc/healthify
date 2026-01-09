// src/components/AppRouter.jsx
import React, { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { HashRouter, Routes, Route } from "react-router-dom";
import { refreshUser } from "../redux/auth/authOperations";

import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

import Loader from "../components/Loader/Loader"; //Loader import

// Lazy-loaded sayfalar
const LandingPage = React.lazy(() =>
  import("../pages/LandingPage/LandingPage")
);
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);
const Layout = React.lazy(() => import("../pages/Layout/Layout"));
const AuthCalculatorPage = React.lazy(() =>
  import("../pages/AuthCalculatorPage/AuthCalculatorPage")
);
const DiaryPage = React.lazy(() => import("../pages/DiaryPage/DiaryPage"));

const AppRouter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    // HashRouter kullanımı GH Pages üzerinde F5/yenileme 404 sorununu ortadan kaldırır.
    <HashRouter>
      <Suspense fallback={<Loader full size={60} />}>
        <Routes>
          {/* Tüm sayfalar Layout altında */}
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <RestrictedRoute>
                  <LandingPage />
                </RestrictedRoute>
              }
            />

            {/* LOGIN */}
            <Route path="login" element={<LoginPage />} />

            {/* REGISTER */}
            <Route
              path="register"
              element={
                <RestrictedRoute redirectTo="/calculator">
                  <RegistrationPage />
                </RestrictedRoute>
              }
            />

            {/* PRIVATE ROUTES */}
            <Route
              path="calculator"
              element={
                <PrivateRoute>
                  <AuthCalculatorPage />
                </PrivateRoute>
              }
            />
            <Route
              path="diary"
              element={
                <PrivateRoute>
                  <DiaryPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};
export default AppRouter;