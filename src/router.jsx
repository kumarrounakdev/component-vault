import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard/Dashboard";
import ComponentView from "./components/ComponentView/ComponentView";
import CreateComponent from "./components/CreateComponent/CreateComponent";
import Collections from "./components/Collections/Collections";
import Trash from "./components/Trash/Trash";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "component/:id",
        element: <ComponentView />,
      },
      {
        path: "create",
        element: <CreateComponent />,
      },
      {
        path: "collections",
        element: <Collections />,
      },
      {
        path: "trash",
        element: <Trash />,
      },
    ],
  },
]);

export default router;