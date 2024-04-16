// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card, ProgressBar, Tabs, Tab, Accordion, Button } from 'react-bootstrap';
// import axios from 'axios';

// const BattlePage = () => {
//     const { opponentEmail } = useParams();
//     const [ourPokemon, setOurPokemon] = useState(null);
//     const [opponentPokemon, setOpponentPokemon] = useState(null);
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         // Simulated fetch for our and opponent's Pokémon
//         axios.get(`/api/pokemon/our`).then(res => {
//             setOurPokemon(res.data);
//         });
//         axios.get(`/api/pokemon/opponent/${opponentEmail}`).then(res => {
//             setOpponentPokemon(res.data);
//         });
//     }, [opponentEmail]);


//     const formatName = (email) => {
//         const namePart = email.split('@')[0];
//         return namePart.charAt(0).toUpperCase() + namePart.slice(1);
//     };

//     const opponentHP = 100;
//     const ourHP = 40;
//     const moves = ["Tackle", "Growl", "Vine Whip", "Razor Leaf"];
//     const otherPokemons = [
//         { name: "Bulbasaur", moves: ["Tackle", "Growl"] },
//         { name: "Charmander", moves: ["Scratch", "Ember"] },
//         { name: "Squirtle", moves: ["Tackle", "Water Gun"] },
//         { name: "Pikachu", moves: ["Quick Attack", "Thunderbolt"] },
//         { name: "Eevee", moves: ["Tackle", "Swift"] }
//     ];

//     const getProgressBarVariant = (hp) => {
//         if (hp < 25) return 'danger';
//         else if (hp < 50) return 'warning';
//         return 'success';
//     };

//     const addEvent = (event) => {
//         setEvents(prevEvents => [...prevEvents, event]);
//     };
    

//     return (
//         <Container className="mt-5 text-center">
//             <h1>Battle Page</h1>
//             <p>Welcome to the battle arena! Here you will face {formatName(opponentEmail)}.</p>
//             <Row className="justify-content-between align-items-start">
//                 <Col md={4}>
//                     <Card>
//                         <Card.Img variant="top" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/303.png" />
//                         <Card.Body>
//                             <Card.Title>Mawile</Card.Title>
//                             <ProgressBar variant={getProgressBarVariant(ourHP)} now={(ourHP / 150) * 100} label={`${Math.round((ourHP / 150) * 100)}%`} />
//                             <Card.Text>HP: {ourHP} / 150</Card.Text>
//                             <Card.Text>Types: Steel, Psychic</Card.Text>
//                         </Card.Body>
//                     </Card>
//                     <Tabs defaultActiveKey="fight" id="battle-options" className="mb-3">
//                         <Tab eventKey="fight" title="Fight">
//                             <Row xs={2} md={2} className="mt-2 g-2">
//                                 {moves.map((move, index) => (
//                                     <Col key={index}>
//                                         <button className="btn btn-outline-primary">{move}</button>
//                                     </Col>
//                                 ))}
//                             </Row>
//                         </Tab>
//                         <Tab eventKey="items" title="Items">
//                             <p>Feature not implemented yet.</p>
//                         </Tab>
//                         <Tab eventKey="switch" title="Switch Pokémon">
//                             <Accordion defaultActiveKey="0">
//                                 {otherPokemons.map((poke, idx) => (
//                                     <Accordion.Item eventKey={idx.toString()} key={idx}>
//                                         <Accordion.Header>{poke.name}</Accordion.Header>
//                                         <Accordion.Body>
//                                             {poke.moves.join(', ')}
//                                             <Button variant="primary" className="mt-2">Switch to {poke.name}</Button>
//                                         </Accordion.Body>
//                                     </Accordion.Item>
//                                 ))}
//                             </Accordion>
//                         </Tab>
//                     </Tabs>
//                 </Col>
//                 <Col md={4} className="d-flex flex-column align-items-center">
//                     <div className="event-log" style={{ width: '100%', height: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', padding: '10px', marginBottom: '20px' }}>
//                         {events.map((event, index) => (
//                             <div key={index}>{event}</div>
//                         ))}
//                     </div>
//                 </Col>

//                 <Col md={4}>
//                     <Card>
//                         <Card.Img variant="top" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" />
//                         <Card.Body>
//                             <Card.Title>Charizard</Card.Title>
//                             <ProgressBar variant={getProgressBarVariant(opponentHP)} now={(opponentHP / 150) * 100} label={`${Math.round((opponentHP / 150) * 100)}%`} />
//                             <Card.Text>HP: {opponentHP} / 150</Card.Text>
//                             <Card.Text>Types: {['Fire', 'Flying'].join(', ')}</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default BattlePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Tabs, Tab, Accordion, Button } from 'react-bootstrap';

const BattlePage = () => {
    const { opponentEmail } = useParams();
    const [ourTeam, setOurTeam] = useState([]);
    const [cynthiaTeam, setCynthiaTeam] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [cynthiaPokemon, setCynthiaPokemon] = useState(null);

    useEffect(() => {
        const fetchOurTeam = async () => {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            const headers = {
                Authorization: `Token ${token}`
            };
            try {
                const response = await axios.get('http://localhost:8000/api/battle/team/', { headers });
                setOurTeam(response.data.pokemons);
            } catch (error) {
                console.error('Error fetching our team:', error);
            }
        };

        fetchOurTeam();
        const fetchCynthiaTeam = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/teams/cynthia_team/');
                setCynthiaTeam(response.data.pokemons);
            } catch (error) {
                console.error('Failed to load Cynthia’s team:', error);
            }
        };

        fetchCynthiaTeam();
    }, []);

    const initialSelectPokemon = (pokemon) => {
        setCurrentPokemon(pokemon);
        // Randomly select a Pokémon from Cynthia's team
        if (cynthiaTeam.length > 0) {
            const randomIndex = Math.floor(Math.random() * cynthiaTeam.length);
            setCynthiaPokemon(cynthiaTeam[randomIndex]);
        }
    };

    return (
        <Container className="mt-5 text-center">
            <h1>Battle Page</h1>
            <Row>
                <Col>
                    <h2>Our Team</h2>
                    {ourTeam.map(pokemon => (
                        <Card key={pokemon.pokemon.name} className="mb-2">
                            <Card.Body>
                                <Card.Title>{pokemon.pokemon.name}</Card.Title>
                                <Card.Text>
                                    Types: {pokemon.pokemon.types.map(type => type.name).join(', ')}
                                </Card.Text>
                                <Button variant="primary" onClick={() => initialSelectPokemon(pokemon)}>Select</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                <Col>
                    <h2>Cynthia's Team</h2>
                    {cynthiaTeam.map(pokemon => (
                        <Card key={pokemon.pokemon.name} className="mb-2">
                            <Card.Body>
                                <Card.Title>{pokemon.pokemon.name}</Card.Title>
                                <Card.Text>
                                    Types: {pokemon.pokemon.types.map(type => type.name).join(', ')}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    {currentPokemon && (
                        <div>
                            <h3>Current Battle Pokémon</h3>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{currentPokemon.pokemon.name}</Card.Title>
                                    <Card.Text>Types: {currentPokemon.pokemon.types.map(type => type.name).join(', ')}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Col>
                <Col>
                    {cynthiaPokemon && (
                        <div>
                            <h3>Cynthia’s Pokémon</h3>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{cynthiaPokemon.pokemon.name}</Card.Title>
                                    <Card.Text>Types: {cynthiaPokemon.pokemon.types.map(type => type.name).join(', ')}</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default BattlePage;
