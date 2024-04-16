import React from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';

const BattlePage = () => {
    const { opponentEmail } = useParams();

    const formatOpponentName = (email) => {
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    };

    return (
        <Container className="mt-5">
            <h1>Battle Page</h1>
            <p>Welcome to the battle arena! Here you will face your opponent.</p>
            <Row className="justify-content-between align-items-center">
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Your Pokémon</Card.Title>
                            <Card.Text>
                                Some details about your Pokémon.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Opponent Pokémon ({formatOpponentName(opponentEmail)})</Card.Title>
                            <Card.Text>
                                Some details about the opponent's Pokémon.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BattlePage;
