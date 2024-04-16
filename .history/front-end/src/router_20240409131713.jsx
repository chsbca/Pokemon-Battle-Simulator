import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx"
import HomePage from "./components/HomePage.jsx"
import PokemonListPage from "./components/PokemonListPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "/pokemon_list/",
                element: <PokemonListPage/>
            },
            {
                path: "/profile/",
                element: <ProfilePage/>
            }
        ],
        errorElement:
    }
])

export default router;