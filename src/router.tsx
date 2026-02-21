import { createHashRouter } from "react-router"
import AppLayout from "@/components/layout/AppLayout"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import ProductsPage from "@/pages/ProductsPage"
import ProductDetailPage from "@/pages/ProductDetailPage"
import CheckoutPage from "@/pages/CheckoutPage"
import PaymentPage from "@/pages/PaymentPage"
import AboutPage from "@/pages/AboutPage"

const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/checkout/payment", element: <PaymentPage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },
])

export default router
