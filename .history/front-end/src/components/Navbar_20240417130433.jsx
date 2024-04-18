import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from './UserContext';  // Correct import path based on your file structure

export default function NavbarComponent() {
  const { user, setUser } = useUser(); // Correctly access user and setUser
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // This should print the actual token, not null or undefined
    try {
      const response = await axios.post('http://localhost:8000/poke_user/logout/', {}, {
        headers: { 'Authorization': `Token ${token}` }
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
      <Navbar expand="lg" className='bg-body-tertiary' >
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ justifyContent: 'center' }}>
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
          <Navbar.Collapse id='basic-navbar-nav' style={{ justifyContent: 'center' }}>
            <Nav className="me-auto" style={{ flex: 1, justifyContent: 'center' }}>
              <Nav.Link as={Link} to="/" style={{ justifyContent: 'center' }}>Home</Nav.Link>
              <Nav.Link as={Link} to="pokemon_list/" style={{ justifyContent: 'center' }}>Pokemon List</Nav.Link>
              <Nav.Link as={Link} to="profile/" style={{ justifyContent: 'center' }}>Profile/Team</Nav.Link>
              <Nav.Link as={Link} to="opponents/" style={{ justifyContent: 'center' }}>Opponents</Nav.Link>
              {!user ? (
                <Nav.Link as={Link} to="/login/" style={{ justifyContent: 'center' }}>Log In</Nav.Link>
              ) : (
                <Button onClick={handleLogout} variant="outline-danger" style={{ marginLeft: 'auto' }}>Log Out</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
