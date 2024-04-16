// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom"
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";
import
// import pokeballIcon from 'pokeball_icon.svg.png';


export default function NavbarComponent() {
  const handleUserLogout = async () => {
    const loggedOut = await handleUserLogout()
    if(loggedOut) {
      setUser(null)
    }
  }
  
    return (
        <>
        <Navbar expand="lg" className='bg-body-tertiary'>
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img
                alt=""
                src="/pokeball_icon.svg.png"
                width="30"
                height="30"
                className='d-inline-block align-top'
                />{' '}
              Pokémon Battle Simulator
              </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="pokemon_list/">Pokemon List</Nav.Link>
                <Nav.Link as={Link} to="profile/">Profile/Team</Nav.Link>
                <Nav.Link as={Link} to="opponents/">Opponents</Nav.Link>
                {/* { user ? null : <Nav.Link as={Link} to="login/">Log In</Nav.Link>}
                { !user ? null : <Button onClick={() => handleUserLogout()} variant="outline-danger">Log Out</Button>} */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </>
      );
}