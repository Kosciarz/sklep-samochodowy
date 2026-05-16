import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

const router = createBrowserRouter([{
  path: "/",
  element: <Root />,
  children: [
    { index: true, element: <Home />},
    { path: "cart", element: <Cart />},
  ]
}]);

export default function App() {
  return <RouterProvider router={router} />;
}
