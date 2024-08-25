import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import store from "./store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary.jsx"; // Import the ErrorBoundary component
import { Provider } from "react-redux";
import RootLayout from "./layouts/RootLayout.jsx";
import ErrorPage from "./layouts/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
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
import ViewCompanyDetailsPage from "./pages/dashboard/ViewCompanyDetailsPage.jsx";
import ManageOrdersPage from "./pages/dashboard/ManageOrdersPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import EditOrderPage from "./pages/dashboard/EditOrderPage.jsx";
import OrderDetailsPage from "./pages/dashboard/OrderDetailsPage.jsx";
import ManageAdminTicketsPage from "./pages/dashboard/ManageAdminTicketsPage.jsx";
import AdminTicketDetailsPage from "./pages/dashboard/AdminTicketDetailsPage.jsx";
import ReportsPage from "./pages/dashboard/ReportsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// Sellers Page
import SellerProtecteRoutes from "./components/SellerProtectedRoutes.jsx";
import ManageSellerOrders from "./pages/seller/ManageSellerOrders.jsx";
import SellerOrderDetailsPage from "./pages/seller/SellerOrderDetailsPage.jsx";
import ManageSellerTicketsPage from "./pages/seller/ManageSellerTicketsPage.jsx";
import AddTicketPage from "./pages/seller/AddTicketPage.jsx";
import TicketDetailsPage from "./pages/seller/TicketDetailsPage.jsx";

//componentns
import ForgotPassword from "./components/ForgotPasswordForm.jsx";

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
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetailPage />,
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
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/order-success",
        element: <OrderSuccessPage />,
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
        path: "view-company/:id",
        element: <ViewCompanyDetailsPage />,
      },
      {
        path: "edit-company/:id",
        element: <EditCompanyPage />,
      },
      {
        path: "add-company",
        element: <AddCompanyPage />,
      },
      {
        path: "manage-orders",
        element: <ManageOrdersPage />,
      },
      {
        path: "edit-order/:id",
        element: <EditOrderPage />,
      },
      {
        path: "order-details/:id",
        element: <OrderDetailsPage />,
      },
      {
        path: "manage-tickets",
        element: <ManageAdminTicketsPage />,
      },
      {
        path: "view-ticket/:id",
        element: <AdminTicketDetailsPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/seller",
    element: <SellerProtecteRoutes />, // Wrap all dashboard routes with ProtectedRoute
    children: [
      {
        path: "manage-orders",
        element: <ManageSellerOrders />,
      },
      {
        path: "manage-tickets",
        element: <ManageSellerTicketsPage />,
      },
      {
        path: "add-ticket",
        element: <AddTicketPage />,
      },
      {
        path: "view-ticket/:id",
        element: <TicketDetailsPage />,
      },
      {
        path: "order-details/:id",
        element: <SellerOrderDetailsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </Provider>
);
