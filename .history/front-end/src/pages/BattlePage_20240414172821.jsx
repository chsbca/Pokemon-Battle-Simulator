import React from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, ProgressBar, Button } from 'react-bootstrap';

const BattlePage = () => {
    const { opponentEmail } = useParams();

    const formatOpponentName = (email) => {
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    };

    // Example HP and moves
    const opponentHP = 60;
    const ourHP = 35;
    const opponentTypes = ["Fire", "Flying"];
    const moves = ["Tackle", "Growl", "Vine Whip", "Razor Leaf"];

    const getProgressBarVariant = (hp) => {
        if (hp < 25) {
            return 'danger'; // Red
        } else if (hp < 50) {
            return 'warning'; // Yellow
        }
        return 'success'; // Green by default
    };

    return (
        <Container className="mt-5 text-center">
            <h1>Battle Page</h1>
            <p>Welcome to the battle arena! Here you will face your opponent.</p>
            <Row className="justify-content-between align-items-center">
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Your Pokémon</Card.Title>
                            <ProgressBar variant={getProgressBarVariant(ourHP)} now={ourHP} label={`${ourHP}%`} />
                            <Card.Text>HP: {ourHP}%</Card.Text>
                            <Card.Text>Types: Grass, Poison</Card.Text>
                        </Card.Body>
                    </Card>
                    <Row xs={2} md={2} className="mt-2 g-2">
                        {moves.map((move, index) => (
                            <Col key={index}>
                                <Button variant="outline-primary">{move}</Button>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Opponent Pokémon ({formatOpponentName(opponentEmail)})</Card.Title>
                            <ProgressBar variant={getProgressBarVariant(opponentHP)} now={opponentHP} label={`${opponentHP}%`} />
                            <Card.Text>HP: {opponentHP}%</Card.Text>
                            <Card.Text>Types: {opponentTypes.join(', ')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BattlePage;
