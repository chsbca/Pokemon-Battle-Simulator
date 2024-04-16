// import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    // const [search]
    const handleNavClick = (path) => (event) => {
        event.preventDefault()
        navigate(path)
    }

    return (
        <nav>
            {/* <h1></h1> */}
            <a Link></a>
        </nav>
    )

}