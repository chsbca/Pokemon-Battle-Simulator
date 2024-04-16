import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx"
import HomePage from "./components/HomePage.jsx"

export default router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            }
        ]
    }
])