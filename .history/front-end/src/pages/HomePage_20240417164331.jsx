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
                            <p>Assign up to 6 Pokémon to your Team</p>
                            <p>Choose up to 4 moves per Pokémon</p>

                            <p>Choose an opponent to fight</p>
                            <p>Battle it out!</p>
                            <p>*Moves in this simulator do not utilize priority, stat changes, status inflictions</p>                            

                        </ul>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}