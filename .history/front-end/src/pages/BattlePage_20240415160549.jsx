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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, ProgressBar, Tabs, Tab, Accordion } from 'react-bootstrap';

// const BattlePage = () => {
//     const { opponentEmail } = useParams();
//     const [ourTeam, setOurTeam] = useState([]);
//     const [cynthiaTeam, setCynthiaTeam] = useState([]);
//     const [currentPokemon, setCurrentPokemon] = useState(null);
//     const [cynthiaPokemon, setCynthiaPokemon] = useState(null);
//     const [events, setEvents] = useState([]);
//     const [ourTeamHP, setOurTeamHP] = useState({});
//     const [cynthiaTeamHP, setCynthiaTeamHP] = useState({});

//     useEffect(() => {
//         fetchOurTeam();
//         fetchCynthiaTeam();
//     }, []);

//     const fetchOurTeam = async () => {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Token ${token}` };
//         try {
//             const response = await axios.get('http://localhost:8000/api/battle/team/', { headers });
//             const pokemonsWithSprites = await Promise.all(response.data.pokemons.map(async (pokemon) => {
//                 const spriteResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name.toLowerCase()}`);
//                 pokemon.pokemon.sprite = spriteResponse.data.sprites.front_default;
//                 return pokemon;
//             }));
//             setOurTeam(pokemonsWithSprites);
//             const hpMap = {};
//             response.data.pokemons.forEach(pokemon => {
//                 hpMap[pokemon.pokemon.pokedex_number] = pokemon.pokemon.hp;
//             });
//             setOurTeamHP(hpMap);
//         } catch (error) {
//             console.error('Failed to fetch our team:', error);
//         }
//     };

//     const fetchCynthiaTeam = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/api/teams/cynthia_team/');
//             const pokemonsWithSprites = await Promise.all(response.data.pokemons.map(async (pokemon) => {
//                 const spriteResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name.toLowerCase()}`);
//                 pokemon.pokemon.sprite = spriteResponse.data.sprites.front_default;
//                 return pokemon;
//             }));
//             setCynthiaTeam(pokemonsWithSprites);
//             const hpMap = {};
//             response.data.pokemons.forEach(pokemon => {
//                 hpMap[pokemon.pokemon.pokedex_number] = pokemon.pokemon.hp;
//             });
//             setCynthiaTeamHP(hpMap);
//         } catch (error) {
//             console.error('Failed to fetch Cynthia\'s team:', error);
//         }
//     };

//     const initialSelectPokemon = (pokemon) => {
//         setCurrentPokemon(pokemon);
//         if (cynthiaTeam.length > 0) {
//             const randomIndex = Math.floor(Math.random() * cynthiaTeam.length);
//             setCynthiaPokemon(cynthiaTeam[randomIndex]);
//         }
//     };

//     const switchPokemon = (pokemon) => {
//         const currentHP = ourTeamHP[pokemon.pokemon.pokedex_number];
    
//         if (currentPokemon && pokemon.pokemon.pokedex_number === currentPokemon.pokemon.pokedex_number) {
//             alert("This Pokémon is already in battle!");
//         } else if (currentHP === 0) {
//             alert(`${pokemon.pokemon.name} has no HP left and cannot battle!`);
//         } else {
//             setCurrentPokemon(pokemon);
//             setEvents(prevEvents => [`${pokemon.pokemon.name} is now in battle!`, ...prevEvents]);
//         }
//     };
    

//     const handleAttack = (move) => {
//         const event = `${currentPokemon.pokemon.name} uses ${move.learnable_move.name}!`;
//         setEvents([event, ...events]);
//     };
    

//     return (
//         <Container className="mt-5 text-center">
//             <h1>Battle Page</h1>
//             {currentPokemon && cynthiaPokemon ? (
//                 <>
//                     <Row className="justify-content-center">
//                         <Col md={4}>
//                             <Card>
//                                 <Card.Img variant="top" src={currentPokemon.pokemon.sprite} />
//                                 <Card.Body>
//                                     <Card.Title>{currentPokemon.pokemon.name}</Card.Title>
//                                     <ProgressBar now={100} label={`HP: ${currentPokemon.pokemon.hp}`} />
//                                     <Card.Text>Types: {currentPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
//                                     <Tabs defaultActiveKey="fight">
//                                         <Tab eventKey="fight" title="Fight">
//                                             {currentPokemon.chosen_moves.map((move, index) => (
//                                                 <Button key={index} onClick={() => handleAttack(move)}>
//                                                     {move.learnable_move.name}
//                                                 </Button>
//                                             ))}
//                                         </Tab>
//                                         <Tab eventKey="switch" title="Switch Pokémon">
//                                             {ourTeam.map((poke, index) => (
//                                                 <Accordion key={index}>
//                                                     <Accordion.Item eventKey="0">
//                                                         <Accordion.Header>{poke.pokemon.name}</Accordion.Header>
//                                                         <Accordion.Body>
//                                                             <Button onClick={() => switchPokemon(poke)}>Select</Button>
//                                                         </Accordion.Body>
//                                                     </Accordion.Item>
//                                                 </Accordion>
//                                             ))}
//                                         </Tab>
//                                     </Tabs>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={4}>
//                             <Card>
//                                 <Card.Img variant="top" src={cynthiaPokemon.pokemon.sprite} />
//                                 <Card.Body>
//                                     <Card.Title>{cynthiaPokemon.pokemon.name}</Card.Title>
//                                     <ProgressBar now={100} label={`HP: ${cynthiaPokemon.pokemon.hp}`} />
//                                     <Card.Text>Types: {cynthiaPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                     <div className="mt-3">
//                         <h2>Battle Log</h2>
//                         {events.map((event, index) => (
//                             <p key={index}>{event}</p>
//                         ))}
//                     </div>
//                 </>
//             ) : (
//                 <Row>
//                     <Col md={12}>
//                         <h2>Select Your Pokémon</h2>
//                         {ourTeam.map(pokemon => (
//                             <Card key={pokemon.pokemon.name} style={{ width: '18rem' }}>
//                                 <Card.Body>
//                                     {/* <Card.Img variant="top" src={pokemon.pokemon.sprite} /> */}
//                                     <Card.Title>{pokemon.pokemon.name}</Card.Title>
//                                     <Button variant="primary" onClick={() => initialSelectPokemon(pokemon)}>Select</Button>
//                                 </Card.Body>
//                             </Card>
//                         ))}
//                     </Col>
//                 </Row>
//             )}
//         </Container>
//     );
// };

// export default BattlePage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Tabs, Tab, Accordion } from 'react-bootstrap';

const BattlePage = () => {
    const { opponentEmail } = useParams();
    const [ourTeam, setOurTeam] = useState([]);
    const [cynthiaTeam, setCynthiaTeam] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [cynthiaPokemon, setCynthiaPokemon] = useState(null);
    const [events, setEvents] = useState([]);
    const [ourTeamHP, setOurTeamHP] = useState({});
    const [cynthiaTeamHP, setCynthiaTeamHP] = useState({});

    useEffect(() => {
        fetchOurTeam();
        fetchCynthiaTeam();
    }, []);

    const fetchOurTeam = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Token ${token}` };
        try {
            const response = await axios.get('http://localhost:8000/api/battle/team/', { headers });
            const pokemonsWithSprites = await Promise.all(response.data.pokemons.map(async (pokemon) => {
                const spriteResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name.toLowerCase()}`);
                pokemon.pokemon.sprite = spriteResponse.data.sprites.front_default;
                return pokemon;
            }));
            setOurTeam(pokemonsWithSprites);
            const hpMap = {};
            response.data.pokemons.forEach(pokemon => {
                hpMap[pokemon.pokemon.pokedex_number] = pokemon.pokemon.hp;
            });
            setOurTeamHP(hpMap);
        } catch (error) {
            console.error('Failed to fetch our team:', error);
        }
    };

    const fetchCynthiaTeam = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/teams/cynthia_team/');
            const pokemonsWithSprites = await Promise.all(response.data.pokemons.map(async (pokemon) => {
                const spriteResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name.toLowerCase()}`);
                pokemon.pokemon.sprite = spriteResponse.data.sprites.front_default;
                return pokemon;
            }));
            setCynthiaTeam(pokemonsWithSprites);
            const hpMap = {};
            response.data.pokemons.forEach(pokemon => {
                hpMap[pokemon.pokemon.pokedex_number] = pokemon.pokemon.hp;
            });
            setCynthiaTeamHP(hpMap);
        } catch (error) {
            console.error('Failed to fetch Cynthia\'s team:', error);
        }
    };

    const initialSelectPokemon = (pokemon) => {
        setCurrentPokemon(pokemon);
        if (cynthiaTeam.length > 0) {
            const randomIndex = Math.floor(Math.random() * cynthiaTeam.length);
            setCynthiaPokemon(cynthiaTeam[randomIndex]);
        }
    };

    const switchPokemon = (pokemon) => {
        const currentHP = ourTeamHP[pokemon.pokemon.pokedex_number];
        if (currentPokemon && pokemon.pokemon.pokedex_number === currentPokemon.pokemon.pokedex_number) {
            alert("This Pokémon is already in battle!");
        } else if (currentHP === 0) {
            alert(`${pokemon.pokemon.name} has no HP left and cannot battle!`);
        } else {
            setCurrentPokemon(pokemon);
            setEvents(prevEvents => [`${pokemon.pokemon.name} is now in battle!`, ...prevEvents]);
        }
    };

    const handleAttack = (move) => {
        const event = `${currentPokemon.pokemon.name} uses ${move.learnable_move.name}!`;
        setEvents([event, ...events]);
        // Here you would calculate damage and update HP accordingly
        performBattle(currentPokemon, cynthiaPokemon, move);
    };

    const getTypeEffectiveness = (attackerType, defenderType) => {
        // Placeholder for type effectiveness logic
        // Should return a multiplier like 0.5, 1, or 2
        return 1; // Default to neutral if no data available
    };
    
    const selectRandomMove = (pokemon) => {
        // Select a random move from the pokemon's available moves
        const randomIndex = Math.floor(Math.random() * pokemon.chosen_moves.length);
        return pokemon.chosen_moves[randomIndex];
    };
    

    const performBattle = (attacker, defender, move) => {
        const calculateDamage = (attacker, defender, move) => {
            const attackStat = attacker.pokemon.attack > attacker.pokemon.special_attack ? attacker.pokemon.attack : attacker.pokemon.special_attack;
            const defenseStat = defender.pokemon.defense > defender.pokemon.special_defense ? defender.pokemon.defense : defender.pokemon.special_defense;
            const power = move.learnable_move.power;
            let typeEffectiveness = 1; // Assuming default effectiveness
            
            // Calculate type effectiveness
            defender.pokemon.types.forEach(defenderType => {
                attacker.pokemon.types.forEach(attackerType => {
                    const effectiveness = getTypeEffectiveness(attackerType.name, defenderType.name);
                    typeEffectiveness *= effectiveness;
                });
            });
    
            // STAB (Same Type Attack Bonus)
            const stab = attacker.pokemon.types.some(type => type.name === move.learnable_move.move_type.name) ? 1.5 : 1;
            
            // Damage formula
            return Math.floor(((2 * 50 / 5 + 2) * power * (attackStat / defenseStat) / 50 + 2) * stab * typeEffectiveness);
        };
    
        // Who attacks first based on speed
        const userAttacksFirst = attacker.pokemon.speed >= defender.pokemon.speed;
        const firstAttacker = userAttacksFirst ? attacker : defender;
        const secondAttacker = userAttacksFirst ? defender : attacker;
        const firstMove = userAttacksFirst ? move : selectRandomMove(defender);
        const secondMove = userAttacksFirst ? selectRandomMove(defender) : move;
    
        // Perform first attack
        let damage = calculateDamage(firstAttacker, secondAttacker, firstMove);
        let newHP = Math.max(secondAttacker.pokemon.hp - damage, 0);
    
        const updateHP = userAttacksFirst ? setCynthiaTeamHP : setOurTeamHP;
        updateHP(prevHP => ({ ...prevHP, [secondAttacker.pokemon.pokedex_number]: newHP }));
    
        setEvents(prevEvents => [`${firstAttacker.pokemon.name} uses ${firstMove.learnable_move.name} and deals ${damage} damage!`, ...prevEvents]);
    
        if (newHP <= 0) {
            setEvents(prevEvents => [`${secondAttacker.pokemon.name} has fainted!`, ...prevEvents]);
            if (!userAttacksFirst) {
                // User needs to switch Pokémon
                alert("Your Pokémon has fainted, please select another to continue.");
            } else {
                // Automatically switch Cynthia's Pokémon
                const nextCynthiaPokemon = selectNextCynthiaPokemon();
                if (nextCynthiaPokemon) {
                    setCynthiaPokemon(nextCynthiaPokemon);
                }
            }
        } else {
            // If the first attacker was the user, let Cynthia attack back
            if (userAttacksFirst) {
                setTimeout(() => {
                    performBattle(secondAttacker, firstAttacker, secondMove);
                }, 1000);
            }
        }
    };
    

    return (
        <Container className="mt-5 text-center">
            <h1>Battle Page</h1>
            {currentPokemon && cynthiaPokemon ? (
                <>
                    <Row className="justify-content-center">
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src={currentPokemon.pokemon.sprite} />
                                <Card.Body>
                                    <Card.Title>{currentPokemon.pokemon.name}</Card.Title>
                                    <ProgressBar now={100} label={`HP: ${currentPokemon.pokemon.hp}`} />
                                    <Card.Text>Types: {currentPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
                                    <Tabs defaultActiveKey="fight">
                                        <Tab eventKey="fight" title="Fight">
                                            {currentPokemon.chosen_moves.map((move, index) => (
                                                <Button key={index} onClick={() => handleAttack(move)}>
                                                    {move.learnable_move.name}
                                                </Button>
                                            ))}
                                        </Tab>
                                        <Tab eventKey="switch" title="Switch Pokémon">
                                            {ourTeam.map((poke, index) => (
                                                <Accordion key={index}>
                                                    <Accordion.Item eventKey="0">
                                                        <Accordion.Header>{poke.pokemon.name}</Accordion.Header>
                                                        <Accordion.Body>
                                                            <Button onClick={() => switchPokemon(poke)}>Select</Button>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            ))}
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src={cynthiaPokemon.pokemon.sprite} />
                                <Card.Body>
                                    <Card.Title>{cynthiaPokemon.pokemon.name}</Card.Title>
                                    <ProgressBar now={100} label={`HP: ${cynthiaPokemon.pokemon.hp}`} />
                                    <Card.Text>Types: {cynthiaPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className="mt-3">
                        <h2>Battle Log</h2>
                        {events.map((event, index) => (
                            <p key={index}>{event}</p>
                        ))}
                    </div>
                </>
            ) : (
                <Row>
                    <Col md={12}>
                        <h2>Select Your Pokémon</h2>
                        {ourTeam.map(pokemon => (
                            <Card key={pokemon.pokemon.name} style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Img variant="top" src={pokemon.pokemon.sprite} />
                                    <Card.Title>{pokemon.pokemon.name}</Card.Title>
                                    <Button variant="primary" onClick={() => initialSelectPokemon(pokemon)}>Select</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default BattlePage;
