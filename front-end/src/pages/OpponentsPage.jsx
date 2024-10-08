import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Offcanvas, Accordion } from 'react-bootstrap';
import { capitalizeAndFormat } from '../components/formatUtils';

export default function OpponentsPage() {
    const [team, setTeam] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const navigate = useNavigate();  // Hook to programmatically navigate

    const fetchTeam = (email) => {
        axios.get(`http://localhost:8000/api/teams/user_team_by_email/${encodeURIComponent(email)}/`)
            .then(response => {
                setTeam(response.data);
                setShowOffcanvas(true);  // Show the offcanvas when data is loaded
            })
            .catch(error => {
                console.error('Error fetching team:', error);
            });
    };

    // Function to navigate to the battle page
    const handleFightClick = (email) => {
        navigate(`/battle/${encodeURIComponent(email)}`);
    };
    return (
<div className="main-content" style={{ marginTop: '20px' }}>
        <Container>
            <div style={{ textAlign: 'center' }}>
                <img src="/chooseyouropponent.png" alt="Opponent Page" style={{ maxWidth: '50%', height: 'auto' }} />
            </div>
            <Row className="justify-content-center">
                <Col md={4} className="d-flex flex-column align-items-center">
                    {/* <h2 style={{ textAlign: 'center', width: '100%' }}>Opponents Page</h2> */}

                    <Accordion style={{ width: '100%' }}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Cynthia</Accordion.Header>
                            <Accordion.Body>
                                <div className="text-center">
                                    <img src='https://archives.bulbagarden.net/media/upload/8/83/Spr_B2W2_Cynthia.png' alt="Cynthia" /> <br />
                                    <strong>First Game Appearance:</strong> <br />
                                    Pokémon Diamond and Pearl<br />
                                    <strong>Role:</strong> <br />
                                    Champion of the Elite Four<br />
                                    <button onClick={() => fetchTeam('cynthia@champion.com')} className="btn btn-primary mx-1 mb-2">
                                        Pokémon Team
                                    </button>
                                    <button onClick={() => handleFightClick('cynthia@champion.com')} className="btn btn-danger mx-1 mb-2">
                                        Fight
                                    </button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Cynthia's Pokémon Team</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {team.length > 0 ? (
                                <ul>
                                    {team.map((pokemon, index) => (
                                        <li key={index}>{capitalizeAndFormat(pokemon.pokemon_name)} - Types: {capitalizeAndFormat(pokemon.types.join(', '))}</li>
                                    ))}
                                </ul>
                            ) : <p>No Pokémon found.</p>}
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
            </Row>
        </Container>
        </div>
    );

}
