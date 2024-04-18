import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <img src='./pbs.png' />
            <img src='./homepage.png' />
            <Container>
                <Row className="justify-content-center">
                    <Col md={3}>
                        <strong>Rules:</strong>
<ul>
    <li>Assign up to 6 Pokémon to your Team</li>
    <li></li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
</ul>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}