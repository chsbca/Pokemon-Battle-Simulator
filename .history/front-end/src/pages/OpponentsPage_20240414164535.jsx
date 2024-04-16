import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function OpponentsPage() {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleTeamClick = () => {
        // This function could fetch and show the team of the opponent
        setShowOffcanvas(true);
    };

    const handleClose = () => setShowOffcanvas(false);

    return (
        <div className="container mt-5">
            <h2>Opponents</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Cynthia - Champion of the Elite Four</Accordion.Header>
                    <Accordion.Body>
                        <strong>First Game Appearance:</strong> Pokémon Diamond and Pearl<br />
                        <strong>Role:</strong> Champion of the Elite Four<br />
                        <button onClick={handleTeamClick} className="btn btn-primary m-1">Pokémon Team</button>
                        <button className="btn btn-danger m-1">Fight</button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Cynthia's Pokémon Team</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* Dynamically populated list of Pokémon should be displayed here */}
                    <p>Team details would be shown here.</p>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
