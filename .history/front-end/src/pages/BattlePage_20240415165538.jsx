import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar, Tabs, Tab, Accordion } from 'react-bootstrap';

const BattlePage = () => {
    const [ourTeam, setOurTeam] = useState([]);
    const [cynthiaTeam, setCynthiaTeam] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [cynthiaPokemon, setCynthiaPokemon] = useState(null);
    const [events, setEvents] = useState([]);
    const [ourTeamHP, setOurTeamHP] = useState({});
    const [cynthiaTeamHP, setCynthiaTeamHP] = useState({});
    const [userHasAttacked, setUserHasAttacked] = useState(false);
    const [cynHasAttacked, setCynHasAttacked] = useState(false);

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
        setCynthiaPokemon(cynthiaTeam[Math.floor(Math.random() * cynthiaTeam.length)]);
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
        if (!userHasAttacked) {
            performBattle(currentPokemon, cynthiaPokemon, move);
        }
    };

    const effectivenessMultipliers = {
        super_effective: 2.0,
        less_effective: 0.5,
        not_effective: 0,
        normal: 1
    };


    const getTypeEffectiveness = (attackerType, defenderTypes) => {
        let multiplier = 1;

        defenderTypes.forEach(defenderType => {
            let typeEffect = defenderType.effectiveness_relations.find(relation => relation.target_type === attackerType);
            multiplier *= typeEffect ? effectivenessMultipliers[typeEffect.effectiveness] : 1;
        });

        return multiplier;
    };

    const selectRandomMove = (pokemon) => {
        const randomIndex = Math.floor(Math.random() * pokemon.chosen_moves.length);
        return pokemon.chosen_moves[randomIndex];
    };

    const performBattle = (attacker, defender, move) => {
        if ((attacker === currentPokemon && userHasAttacked) || (attacker !== currentPokemon && cynHasAttacked)) {
            return;  // Prevent further action if they've already attacked this round
        }

        const isUserAttacker = attacker === currentPokemon;
        if (isUserAttacker) {
            setUserHasAttacked(true);
        } else {
            setCynHasAttacked(true);
        }

        const attackStat = attacker.pokemon.attack > attacker.pokemon.special_attack ? attacker.pokemon.attack : attacker.pokemon.special_attack;
        const defenseStat = defender.pokemon.defense > defender.pokemon.special_defense ? defender.pokemon.defense : defender.pokemon.special_defense;
        const power = move.learnable_move.power;
        const typeEffectiveness = getTypeEffectiveness(move.learnable_move.move_type.name, defender.pokemon.types);
        const stab = attacker.pokemon.types.some(type => type.name === move.learnable_move.move_type.name) ? 1.5 : 1;

        // Determine current HP of the defender
        const defenderCurrentHP = attacker === currentPokemon ? cynthiaTeamHP[defender.pokemon.pokedex_number] : ourTeamHP[defender.pokemon.pokedex_number];
        const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attackStat / defenseStat) / 50 + 2) * stab * typeEffectiveness);
        const newHP = Math.max(defenderCurrentHP - damage, 0);

        // Update HP of the defender
        const updateHP = attacker === currentPokemon ? setCynthiaTeamHP : setOurTeamHP;
        updateHP(prevHP => ({ ...prevHP, [defender.pokemon.pokedex_number]: newHP }));
        setEvents(prevEvents => [`${attacker.pokemon.name} uses ${move.learnable_move.name} and deals ${damage} damage!`, ...prevEvents]);

        // Check if defender is fainted
        if (newHP <= 0) {
            setEvents(prevEvents => [`${defender.pokemon.name} has fainted!`, ...prevEvents]);
            if (attacker === currentPokemon) {
                // Defender is Cynthia's Pokémon, select the next Pokémon for her
                const nextPokemon = selectNextCynthiaPokemon();
                if (nextPokemon) {
                    setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            } else {
                // Defender is user's Pokémon, prompt to select another Pokémon
                alert("Your Pokémon has fainted, please select another to continue.");
            }
        } else {
            // Perform counterattack only if the current attacker was the last to perform an action
            if (isUserAttacker) {
                setTimeout(() => performBattle(defender, attacker, selectRandomMove(defender)), 1000);
        }

        if (userHasAttacked && cynHasAttacked) {
            resetBattleRound(); // Reset flags for the next round
        }
    };

    const resetBattleRound = () => {
        setUserHasAttacked(false);
        setCynHasAttacked(false);
    };

    const selectNextCynthiaPokemon = () => {
        // Filter out any Pokémon that has no HP left
        const availablePokemon = cynthiaTeam.filter(p => cynthiaTeamHP[p.pokemon.pokedex_number] > 0);
        if (availablePokemon.length > 0) {
            // Randomly select one of the available Pokémon
            return availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
        } else {
            // If no Pokémon are left, Cynthia has been defeated
            alert("Cynthia has no more Pokémon left! You win!");
            return null; // Indicate game over
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
                                    <ProgressBar now={(ourTeamHP[currentPokemon.pokemon.pokedex_number] / currentPokemon.pokemon.hp) * 100} label={`HP: ${ourTeamHP[currentPokemon.pokemon.pokedex_number]} / ${currentPokemon.pokemon.hp}`} />
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
                                    <ProgressBar now={(cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number] / cynthiaPokemon.pokemon.hp) * 100} label={`HP: ${cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number]} / ${cynthiaPokemon.pokemon.hp}`} />
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
