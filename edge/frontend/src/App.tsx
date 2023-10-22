import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import History from "./History";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "history",
    element: <History />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
