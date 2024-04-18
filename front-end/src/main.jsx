import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/UserContext"; // Make sure this path is correct
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router}/>
  </UserProvider>
);
