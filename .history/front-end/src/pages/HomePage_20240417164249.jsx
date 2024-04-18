import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <img src='./pbs.png' />
            <img src='./homepage.png' />
            <Container>
                <Row className="justify-content-center">
                    <Col md={4}>
                        <strong>Rules:</strong>
                        <ul>
                            <li>Assign up to 6 Pokémon to your Team</li>
                            <li>Choose up to 4 moves per Pokémon</li>

                            <li>Choose an opponent to fight</li>
                            <li>Battle it out!</li>
                            <li>*Moves in this simulator do not utilize priority, stat changes, status inflictions</li>                            

                        </ul>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}