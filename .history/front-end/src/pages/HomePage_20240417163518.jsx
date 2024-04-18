import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <img src='./pbs.png'/>
            <img src='./homepage.png'/>
            <Container>
            <Row>
            <Col md={4}>
            Test 
            test
            </Col>
            </Row>
            </Container>

        </div>
    )
}