import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from './UserContext';  // Correct import path based on your file structure

export default function NavbarComponent() {
  const { user, setUser } = useUser(); // Correctly access user and setUser
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/poke_user/logout/', {}, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      console.log('Logout successful:', response.data);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed!');
    }
  };

  console.log("Current User in Navbar:", user); // Log the current user state

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
              {!user ? (
                <Nav.Link as={Link} to="/login/">Log In</Nav.Link>
              ) : (
                <Button onClick={handleLogout} variant="outline-danger">Log Out</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
