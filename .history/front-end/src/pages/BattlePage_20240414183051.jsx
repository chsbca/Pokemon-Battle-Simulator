import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Tabs, Tab, Accordion, Button } from 'react-bootstrap';

const BattlePage = () => {
    const { opponentEmail } = useParams();

    const formatName = (email) => {
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    };

    const [events, setEvents] = useState([]);

    const addEvent = (event) => {
        setEvents(prevEvents => [...prevEvents, event]);
    };

    const opponentHP = 60;
    const ourHP = 35;
    const moves = ["Tackle", "Growl", "Vine Whip", "Razor Leaf"];

    const handleAttack = (move) => {
        addEvent(`Your Pokémon used ${move}! It was super effective!`);
    };

    return (
        <Container className="mt-5 text-center">
            <h1>Battle Page</h1>
            <p>Welcome to the battle arena! Here you will face {formatName(opponentEmail)}.</p>
            <Row className="justify-content-between align-items-start">
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Your Pokémon</Card.Title>
                            <ProgressBar now={ourHP} label={`${ourHP}%`} />
                            <Card.Text>{ourHP} / 150 HP</Card.Text>
                            <Card.Text>Types: Grass, Poison</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="d-flex flex-column align-items-center">
                    <div className="event-log" style={{ width: '100%', height: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', padding: '10px', marginBottom: '20px' }}>
                        {events.map((event, index) => (
                            <div key={index}>{event}</div>
                        ))}
                    </div>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />
                        <Card.Body>
                            <Card.Title>Opponent Pokémon</Card.Title>
                            <ProgressBar now={opponentHP} label={`${opponentHP}%`} />
                            <Card.Text>{opponentHP} / 150 HP</Card.Text>
                            <Card.Text>Types: Fire, Flying</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BattlePage;