import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <img src='./pbs.png'/>
            <img src='./homepage.png'/>
            <Container>
            <Row className="justify-content-center">
            <Col md={120}>
            Test 
            test
            </Col>
            </Row>
            </Container>

        </div>
    )
}