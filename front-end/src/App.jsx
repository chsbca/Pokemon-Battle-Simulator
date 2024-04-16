import { Outlet } from "react-router-dom"
import NavbarComponent from "./components/Navbar"

export default function App() {
  return (
    <>
      <NavbarComponent/>
      <Outlet/>
    </>
  )
}
