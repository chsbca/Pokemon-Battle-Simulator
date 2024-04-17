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
    // const [cynHasAttacked, setCynHasAttacked] = useState(false);

    useEffect(() => { // initial fetch of both teams
        fetchOurTeam();
        fetchCynthiaTeam();
    }, []);

    useEffect(() => { // Check if Cynthia needs to switch or if she's out
        // Check if the currently active Cynthia's Pokémon has zero HP
        if (cynthiaPokemon && cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number] <= 0) {
            const nextPokemon = selectNextCynthiaPokemon();
            if (nextPokemon) {
                setCynthiaPokemon(nextPokemon);
            } else {
                alert("Cynthia has no more Pokémon left! You win!");
            }
        }
    }, [cynthiaPokemon, cynthiaTeamHP])
    

    useEffect(() => { // Check if player is wiped out
        const totalHP = Object.values(ourTeamHP).reduce((acc, hp) => acc + hp, 0);
    
        if (totalHP <= 0) {
            alert("All your Pokémon have fainted! You've lost the battle.");
        }
    }, [ourTeamHP]);
    

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
            // console.log(ourTeamHP)
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
        setCynthiaPokemon(cynthiaTeam[Math.floor(Math.random() * cynthiaTeam.length)])
    };

    const switchPokemon = (pokemon) => {
        const currentHP = ourTeamHP[pokemon.pokemon.pokedex_number];
        if (currentPokemon && pokemon.pokemon.pokedex_number === currentPokemon.pokemon.pokedex_number) {
            alert("This Pokémon is already in battle!");
        } else if (currentHP === 0) {
            alert(`${pokemon.pokemon.name} has no HP left and cannot battle!`);
        } else {
            enemySwitchCounterattack(pokemon)
            setCurrentPokemon(pokemon);
            setEvents(prevEvents => [`${pokemon.pokemon.name} is now in battle!`, ...prevEvents]);
        }
    }

    const handleAttack = (userMove) => {
        setUserHasAttacked(true)
        if (!userHasAttacked) {
            const userPoke = currentPokemon;
            const cynPoke = cynthiaPokemon;
            const userSpeed = userPoke.pokemon.speed;
            const cynSpeed = cynPoke.pokemon.speed;

            if (currentPokemon.pokemon.hp <= 0) {
                alert("Your current Pokémon has fainted! Please select another Pokémon.")
                return; // Stop the function if the user's Pokémon has fainted
            }

            if (cynthiaPokemon.pokemon.hp <= 0) {
                const nextPokemon = selectNextCynthiaPokemon()
                if (nextPokemon) {
                    setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!")
                    return; // Stop the function if no Pokémon are left for Cynthia
                }
            }

            if (userSpeed > cynSpeed) {
                // User's Pokémon is faster and attacks first
                performBattle(userPoke, cynPoke, userMove, selectRandomMove(cynPoke))
            } else {
                // Cynthia's Pokémon is faster and attacks first
                performBattle(cynPoke, userPoke, selectRandomMove(cynPoke), userMove)
            }
        }
        setTimeout(() => {
            (setUserHasAttacked(false))
        }, 2000)
    };
    
    const executeAttack = (attacker, defender, move) => {
        const attackStat = attacker.pokemon.attack > attacker.pokemon.special_attack ? attacker.pokemon.attack : attacker.pokemon.special_attack;
        const defenseStat = defender.pokemon.defense > defender.pokemon.special_defense ? defender.pokemon.defense : defender.pokemon.special_defense;
        const power = move.learnable_move.power;
        const typeEffectiveness = getTypeEffectiveness(move.learnable_move.move_type, defender.pokemon.types);
        const stab = attacker.pokemon.types.some(type => type.name === move.learnable_move.move_type.name) ? 1.5 : 1;

        console.log(attacker.pokemon.name)
        console.log("attack: ", attackStat)
        console.log("defense: ", defenseStat)
        console.log("power: ", power)
        console.log("typeEffect: ", typeEffectiveness)
        console.log("STAB: ", stab)

        const defenderCurrentHP = (attacker === currentPokemon) ? cynthiaTeamHP[defender.pokemon.pokedex_number] : ourTeamHP[defender.pokemon.pokedex_number];
        const damage = Math.floor(((2 * 50 / 5 + 2) * power * (attackStat / defenseStat) / 50 + 2) * stab * typeEffectiveness);
        const newHP = Math.max(defenderCurrentHP - damage, 0);

        const updateHP = (attacker === currentPokemon) ? setCynthiaTeamHP : setOurTeamHP;
        updateHP(prevHP => ({ ...prevHP, [defender.pokemon.pokedex_number]: newHP }));

        let effectivenessMessage = '';
        if (typeEffectiveness > 1) {
            effectivenessMessage = "It's super effective!";
        } else if (typeEffectiveness < 1 && typeEffectiveness > 0) {
            effectivenessMessage = "It's not very effective...";
        } else if (typeEffectiveness === 0) {
            effectivenessMessage = "It doesn't affect the target...";
        }

        setEvents(prevEvents => [`${attacker.pokemon.name} uses ${move.learnable_move.name} and deals ${damage} damage! ${effectivenessMessage}`, ...prevEvents]);

        if (newHP <= 0) {
            setEvents(prevEvents => [`${defender.pokemon.name} has fainted!`, ...prevEvents]);
            if (attacker === currentPokemon) {
                // If Cynthia's Pokémon faints, select the next Pokémon
                const nextPokemon = selectNextCynthiaPokemon();
                if (nextPokemon) {
                    setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            } else {
                alert("Your Pokémon has fainted, please select another to continue.");
            }
        }
        console.log(move.learnable_move.name)
        console.log(`newHP: ${newHP}`)
        return newHP
    }
    
    const performBattle = (firstAttacker, secondAttacker, firstMove, secondMove) => {
        // Execute the first attack
        const newHPAfterFirstAttack = executeAttack(firstAttacker, secondAttacker, firstMove)


        // Check if the second attacker is still able to fight before counterattacking
        setTimeout(() => {
            //if secondAttacker.hp === 0, selectNextCynthiaPokemon()
            if (newHPAfterFirstAttack > 0) {
                executeAttack(secondAttacker, firstAttacker, secondMove);
            } else {
                selectNextCynthiaPokemon()
            }
        }, 1000);

        // if (secondAttacker.pokemon.hp === 0) {
        //     selectNextCynthiaPokemon()
        }
    

    const getTypeEffectiveness = (moveType, defenderTypes) => {
        let multiplier = 1
        
        // Loop through each of defender's types to calculate effectiveness
        defenderTypes.forEach(defenderType => {
            // Find the effectiveness relation for this moveType against the defender's type
            let typeEffect = moveType.effectiveness_relations.find(relation => relation.target_type === defenderType.name)
            // let typeEffect = defenderType.effectiveness_relations.find(relation => relation.target_type === defenderTypes)
            // let typeEffect = defenderType.affected_by_relations.find(relation => relation.target_type === moveType)
            if (typeEffect) {
                // Apply the multiplier from the effectiveness relation found
                multiplier *= effectivenessMultipliers[typeEffect.effectiveness] // Default to 1 if no matching typeEffect is found
                console.log(`Effectiveness for move type ${moveType.name} against ${defenderType.name}: ${typeEffect.effectiveness} (${effectivenessMultipliers[typeEffect.effectiveness]})`);
                console.log(`TypeEffect found:`, typeEffect)
            } else {
                // Log when no specific effectiveness relation is found
                console.log(`No specific effectiveness relation found for move type ${moveType} against ${defenderType.name}`);
            }
            console.log(`Current multiplier for ${moveType.name} against [${defenderTypes.map(t => t.name).join(', ')}]: ${multiplier}`)
        })
        console.log(`Final overall multiplier for move type ${moveType.name} against all types [${defenderTypes.map(t => t.name).join(', ')}]: ${multiplier}`);
        return multiplier
    };

    const effectivenessMultipliers = {
        super_effective: 2,
        less_effective: 0.5,
        not_effective: 0,
        normal: 1
    };

    const selectRandomMove = (pokemon) => {
        const randomIndex = Math.floor(Math.random() * pokemon.chosen_moves.length)
        return pokemon.chosen_moves[randomIndex];
    };


    const enemySwitchCounterattack = (newPokemon) => {
        if (ourTeamHP[currentPokemon.pokemon.pokedex_number] > 0) {
    // if (currentPokemon.pokemon.hp > 0) {
            alert("enemy triggers a counterattack!")
            const randomMove = selectRandomMove(cynthiaPokemon)
            executeAttack(cynthiaPokemon, newPokemon, randomMove)
        }
        return
    }


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

    const progressBarColor = (currentHP, maxHP) => {
        const percentage = (currentHP / maxHP) * 100
        if (percentage > 50) return 'success'
        if (percentage > 25) return 'warning'
        return 'danger'
    }

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
                                    <ProgressBar
                                        now={(ourTeamHP[currentPokemon.pokemon.pokedex_number] / currentPokemon.pokemon.hp) * 100}
                                        label={`HP: ${ourTeamHP[currentPokemon.pokemon.pokedex_number]} / ${currentPokemon.pokemon.hp}`}
                                        variant={progressBarColor(ourTeamHP[currentPokemon.pokemon.pokedex_number], currentPokemon.pokemon.hp)}
                                    />
                                    <Card.Text>Types: {currentPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
                                    <Tabs defaultActiveKey="fight">
                                        <Tab eventKey="fight" title="Fight">
                                            {currentPokemon.chosen_moves.map((move, index) => (
                                                <Button key={index} onClick={() => handleAttack(move)} disabled={userHasAttacked}>
                                                    {move.learnable_move.name}
                                                </Button>
                                            ))}
                                        </Tab>
                                        <Tab eventKey="switch" title="Switch Pokémon">

                                            {ourTeam.map((poke, index) => (
                                                <Accordion key={index}>
                                                    <Accordion.Item eventKey="0">
                                                        <Accordion.Header>
                                                            {poke.pokemon.name} - HP: {ourTeamHP[poke.pokemon.pokedex_number]} / {poke.pokemon.hp}
                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <div>
                                                                <p>Moves:</p>
                                                                {poke.chosen_moves.map((move, idx) => (
                                                                    <p key={idx}>{move.learnable_move.name}</p>
                                                                ))}
                                                            </div>
                                                            {/* if currentPokemon.pokemon.hp <= 0, nothing
                                                                if > 0, enemySwitchCounterattack */}
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
                        <Col md={3} className="mb-4">
                            <h2>Battle Log</h2>
                            {events.map((event, index) => (
                                <p key={index}>{event}</p>
                            ))}
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src={cynthiaPokemon.pokemon.sprite} />
                                <Card.Body>
                                    <Card.Title>{cynthiaPokemon.pokemon.name}</Card.Title>
                                    <ProgressBar
                                        now={(cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number] / cynthiaPokemon.pokemon.hp) * 100}
                                        label={`HP: ${cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number]} / ${cynthiaPokemon.pokemon.hp}`}
                                        variant={progressBarColor(cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number], cynthiaPokemon.pokemon.hp)}
                                    />
                                    <Card.Text>Types: {cynthiaPokemon.pokemon.types.map(t => t.name).join(', ')}</Card.Text>
                                    {cynthiaTeam.map((poke, index) => (
                                        <Accordion key={index}>
                                            <Accordion.Item eventKey={index.toString()}>
                                                <Accordion.Header>
                                                    {poke.pokemon.name} - HP: {cynthiaTeamHP[poke.pokemon.pokedex_number]} / {poke.pokemon.hp}
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <p>Moves:</p>
                                                    {poke.chosen_moves.map((move, idx) => (
                                                        <p key={idx}>{move.learnable_move.name}</p>
                                                    ))}

                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <Row className="justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
                    <Col md={12}>
                        <h2>Select your Pokémon!</h2>
                        <h5>They will be fighting first</h5>
                        <div className="d-flex flex-wrap justify-content-center">
                            {ourTeam.map(pokemon => (
                                <Card key={pokemon.pokemon.name} style={{ width: '18rem', margin: '10px' }}>
                                    <Card.Body>
                                        <Card.Img variant="top" src={pokemon.pokemon.sprite} />
                                        <Card.Title>{pokemon.pokemon.name}</Card.Title>
                                        <Button variant="primary" onClick={() => initialSelectPokemon(pokemon)}>Select</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );

}

export default BattlePage;
