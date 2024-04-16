// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom"
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link, Outlet } from "react-router-dom";
import pokeballIcon from './img/Poké_Ball_icon.svg.png';


export default function Navbar() {
    return (
        <>
        <body>
        <Navbar expand="lg" className='bg-body-tertiary'>
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img
                alt=""
                src={pokeballIcon}
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
                <Nav.Link as={Link} to="pokemon_list/">Pokemon List</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet/>
        </body>
        </>
      );
}