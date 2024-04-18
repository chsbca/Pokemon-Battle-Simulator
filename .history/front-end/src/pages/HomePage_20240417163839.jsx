import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <img src='./pbs.png' />
            <img src='./homepage.png' />
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <strong>Rules:</strong>
<ul>
    <li>1</li>
    <li>2</li>
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