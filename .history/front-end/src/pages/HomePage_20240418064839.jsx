import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <img src='./pbs.png' alt="PBS" />
            <img src='./homepage.png' alt="Homepage" />
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div>
                            <strong>Rules:</strong>
                            <ul>
                                <li>Assign up to 6 Pokémon to your Team</li>
                                <li>Choose up to 4 moves per Pokémon</li>
                                <li>Choose an opponent to fight</li>
                                <li>Battle it out!</li>
                                <p>*Moves in this simulator do not utilize priority, stat changes, status inflictions</p>
                                <p>*Physical/Special move properties have not been applied yet, calculations take in the highest attack/special attack and defense/special defense stat</p>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
