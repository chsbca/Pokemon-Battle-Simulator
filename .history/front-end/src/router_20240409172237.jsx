import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx"
import Error404Page from "./components/Error404Page.jsx";
import HomePage from "./components/HomePage.jsx"
import PokemonListPage from "./components/PokemonListPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import OpponentsPage from "./components/OpponentsPage.jsx";

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