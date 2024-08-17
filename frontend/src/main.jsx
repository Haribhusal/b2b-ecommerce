import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary.jsx"; // Import the ErrorBoundary component

import RootLayout from "./layouts/RootLayout.jsx";
import ErrorPage from "./layouts/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute

// Dashboard Page
import ManageProductsPage from "./pages/dashboard/ManageProductsPage.jsx";
import ManageCategoriesPage from "./pages/dashboard/ManageCategoriesPage.jsx";
import AddProductPage from "./pages/dashboard/AddProductPage.jsx";
import EditProductPage from "./pages/dashboard/EditProductPage.jsx";
import EditCategoryPage from "./pages/dashboard/EditCategoryPage.jsx";
import AddCategoryPage from "./pages/dashboard/AddCategoryPage.jsx";
import ManageSellersPage from "./pages/dashboard/ManageSellersPage.jsx";
import EditSellerPage from "./pages/dashboard/EditSellerPage.jsx";
import AddSellerPage from "./pages/dashboard/AddSellerPage.jsx";
import ManageCompaniesPage from "./pages/dashboard/ManageCompaniesPage.jsx";
import EditCompanyPage from "./pages/dashboard/EditCompanyPage.jsx";
import AddCompanyPage from "./pages/dashboard/AddCompanyPage.jsx";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },

      {
        path: "/categories",
        element: <CategoriesPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />, // Wrap all dashboard routes with ProtectedRoute
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "manage-products",
        element: <ManageProductsPage />,
      },
      {
        path: "add-product",
        element: <AddProductPage />,
      },
      {
        path: "edit-product/:productId",
        element: <EditProductPage />,
      },
      {
        path: "manage-categories",
        element: <ManageCategoriesPage />,
      },
      {
        path: "edit-categories/:categoryId",
        element: <EditCategoryPage />,
      },
      {
        path: "add-category",
        element: <AddCategoryPage />,
      },
      {
        path: "manage-sellers",
        element: <ManageSellersPage />,
      },
      {
        path: "edit-seller/:id",
        element: <EditSellerPage />,
      },
      {
        path: "add-seller",
        element: <AddSellerPage />,
      },
      {
        path: "manage-companies",
        element: <ManageCompaniesPage />,
      },
      {
        path: "edit-company/:id",
        element: <EditCompanyPage />,
      },
      {
        path: "add-company",
        element: <AddCompanyPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ErrorBoundary>
);
