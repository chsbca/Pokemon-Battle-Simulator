import React from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';

const BattlePage = () => {
    const { opponentEmail } = useParams();

    const formatOpponentName = (email) => {
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    };

    // Example data
    const opponentHP = 60; // Percent for HP
    const ourHP = 35; // Our Pokémon's HP for demonstration
    const opponentTypes = ["Fire", "Flying"]; // Pokémon types
    const ourMoves = ["Tackle", "Growl", "Vine Whip", "Razor Leaf"]; // Our Pokémon's moves

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
            <p>Battling against: {formatOpponentName(opponentEmail)}</p>
            <Row className="justify-content-between align-items-center">
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Your Pokémon</Card.Title>
                            <Card.Text>
                                <ProgressBar variant={getProgressBarVariant(ourHP)} now={ourHP} label={`${ourHP}%`} />
                                HP: {ourHP}%
                                <br />
                                Types: Grass, Poison
                                <div className="d-grid gap-2 d-md-flex justify-content-md-evenly mt-3">
                                    {ourMoves.map((move, index) => (
                                        <Button key={index} variant="secondary" className="mt-2">{move}</Button>
                                    ))}
                                </div>
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
                                <ProgressBar variant={getProgressBarVariant(opponentHP)} now={opponentHP} label={`${opponentHP}%`} />
                                HP: {opponentHP}%
                                <br />
                                Types: {opponentTypes.join(', ')}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BattlePage;
