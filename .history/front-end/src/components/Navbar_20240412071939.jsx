import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from './UserContext'; // Adjust this import path as necessary

export default function NavbarComponent() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Assume the logout API endpoint clears the token on the server-side
      // Here we're just simulating the logout process
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null); // Update context to null
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed!');
    }
  };

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
              {user ? (
                <Button onClick={handleLogout} variant="outline-danger">Log Out</Button>
              ) : (
                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
