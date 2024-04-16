// import React from 'react';

// export default function OpponentsPage() {
//     return (
//         <div className="container mt-5">
//             <h2>Opponents</h2>
//             <div className="accordion" id="opponentsAccordion">
//                 <div className="accordion-item">
//                     <h2 className="accordion-header" id="headingCynthia">
//                         <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCynthia" aria-expanded="true" aria-controls="collapseCynthia">
//                             Cynthia - Champion of the Elite Four
//                         </button>
//                     </h2>
//                     <div id="collapseCynthia" className="accordion-collapse collapse show" aria-labelledby="headingCynthia" data-bs-parent="#opponentsAccordion">
//                         <div className="accordion-body">
//                             <strong>First Game Appearance:</strong> Pokémon Diamond and Pearl<br />
//                             <strong>Role:</strong> Champion of the Elite Four<br />
//                             <button className="btn btn-primary m-1">Pokémon Team</button>
//                             <button className="btn btn-danger m-1">Fight</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function OpponentsPage() {
    const [team, setTeam] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const fetchTeam = (email) => {
        axios.get(`http://localhost:8000/api/user_team_by_email/${encodeURIComponent(email)}/`)
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
                        First Game Appearance: Pokémon Diamond
                        Role: Champion of Elite 4
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
