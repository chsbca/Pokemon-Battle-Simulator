import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx"
import Error404Page from "./pages/Error404Page.jsx";
import HomePage from "./pages/HomePage.jsx"
import PokemonListPage from "./pages/PokemonListPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OpponentsPage from "./pages/OpponentsPage.jsx";

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
            },
            {
                path: "/opponents/",
                element: <OpponentsPage/>
            }
        ],
        errorElement: <Error404Page/>
    }
])

export default router;