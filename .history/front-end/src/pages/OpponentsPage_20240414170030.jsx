import React, { useState } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function OpponentsPage() {
    const [team, setTeam] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

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

    return (
        <div>
            <h2>Opponents Page</h2>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Cynthia</Accordion.Header>
                    <Accordion.Body>
                                             <strong>First Game Appearance:</strong> Pokémon Diamond and Pearl<br />
                         <strong>Role:</strong> Champion of the Elite Four<br />
                        <button onClick={() => fetchTeam('cynthia@champion.com')} className="btn btn-primary">
                            Pokémon Team
                        </button>
                        <button className="btn btn-danger">
                            Fight
                        </button>
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
                                <li key={index}>{pokemon.pokemon_name} - Types: {pokemon.types.join(', ')}</li>
                            ))}
                        </ul>
                    ) : <p>No Pokémon found.</p>}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
