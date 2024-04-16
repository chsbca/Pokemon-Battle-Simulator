import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import App from "./App.jsx"
import Error404Page from "./pages/Error404Page.jsx";
import HomePage from "./pages/HomePage.jsx"
import PokemonListPage from "./pages/PokemonListPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OpponentsPage from "./pages/OpponentsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx"; 
import BattlePage from "./pages/BattlePage.jsx";

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
                element: <ProtectedRoute><ProfilePage/></ProtectedRoute>
            },
            {
                path: "/opponents/",
                element: <OpponentsPage/>
            },
            {
                path: "/battle/:opponentEmail",
                element: <BattlePage/>,
            },
            {
                path: "/login/",
                element: <LoginPage/>
            },
            {
                path: "/signup/",
                element: <SignUpPage/>
            }
        ],
        errorElement: <Error404Page/>
    }
])

export default router;
