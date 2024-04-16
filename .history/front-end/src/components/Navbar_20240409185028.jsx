// import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link, Outlet } from "react-router-dom";
import pokeballIcon from './img/Poké_Ball_icon.svg.png';


export default function Navbar() {
    // const [search]
    const handleNavClick = (path) => (event) => {
        event.preventDefault()
        navigate(path)
    }

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
              Pokédex
              </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="list-all-pokemon/">Pokemon List</Nav.Link>
                <NavDropdown title="Search By:" id='basic-nav-dropdown'>
                  <NavDropdown.Item as={Link} to="search-by-name/">Name</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="search-by-type/">Type</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="generate-6-random-pokemon/">Generate Team</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet/>
        </body>
        </>
      );
}