import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar, Tabs, Tab, Accordion } from 'react-bootstrap';
import { capitalizeAndFormat } from '../components/formatUtils';

const BattlePage = () => {
    const [ourTeam, setOurTeam] = useState([]);
    const [cynthiaTeam, setCynthiaTeam] = useState([]);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [cynthiaPokemon, setCynthiaPokemon] = useState(null);
    const [events, setEvents] = useState([]);
    const [ourTeamHP, setOurTeamHP] = useState({});
    const [cynthiaTeamHP, setCynthiaTeamHP] = useState({});
    const [userHasAttacked, setUserHasAttacked] = useState(false);
    const [activeKey, setActiveKey] = useState(null);
    const [cynthiaActiveKey, setCynthiaActiveKey] = useState(null);

    // On page load, calls to fetch both teams
    useEffect(() => { 
        fetchOurTeam();
        fetchCynthiaTeam();
    }, []);

    // Check if Cynthia needs to switch or if she's out
    useEffect(() => { 
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

    // Check if user needs to switch or if they're out
    useEffect(() => { 
        const delayCheck = setTimeout(() => {
            const totalHP = Object.values(ourTeamHP).reduce((acc, hp) => acc + hp, 0);

            if (totalHP <= 0) {
                alert("All your Pokémon have fainted! You've lost the battle.");
            } else if (currentPokemon && ourTeamHP[currentPokemon.pokemon.pokedex_number] <= 0) {
                alert("Your current Pokémon has fainted! Please select another Pokémon.")
            }
        }, 1000)

        return () => clearTimeout(delayCheck);
    }, [ourTeamHP, currentPokemon]);

    // Fetches user's team
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

    // Fetches Cynthia's team
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

    // Prompts user to select the Pokemon they want to start with
    const initialSelectPokemon = (pokemon) => { 
        setCurrentPokemon(pokemon);
        setCynthiaPokemon(cynthiaTeam[Math.floor(Math.random() * cynthiaTeam.length)])
    };

    // Allows user to switch Pokemon mid-battle
    const switchPokemon = (pokemon) => { 
        setActiveKey(null)
        const currentHP = ourTeamHP[pokemon.pokemon.pokedex_number];
        if (currentPokemon && pokemon.pokemon.pokedex_number === currentPokemon.pokemon.pokedex_number) {
            alert("This Pokémon is already in battle!");
        } else if (currentHP === 0) {
            alert(`${capitalizeAndFormat(pokemon.pokemon.name)} has no HP left and cannot battle!`);
        } else {
            enemySwitchCounterattack(pokemon)
            setCurrentPokemon(pokemon);
            setEvents(prevEvents => [`${capitalizeAndFormat(pokemon.pokemon.name)} is now in battle!`, ...prevEvents]);
        }
    }

    // Logic used whenever an attack is selected by user
    // Checks if user and opponent's Pokemon is alive, then checks for speed to see who attacks first
    const handleAttack = (userMove) => { 
        setUserHasAttacked(true)
        if (!userHasAttacked) {
            setEvents([]);
            const userPoke = currentPokemon;
            const cynPoke = cynthiaPokemon;
            const userSpeed = userPoke.pokemon.speed;
            const cynSpeed = cynPoke.pokemon.speed;

            if (currentPokemon.pokemon.hp <= 0) {
                // alert("Your current Pokémon has fainted! Please select another Pokémon.")
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
    };

    // Finds relation of attack type vs defender's type
    const getTypeEffectiveness = (moveType, defenderTypes) => { 
        let multiplier = 1

        // Loop through each of defender's types to calculate effectiveness
        defenderTypes.forEach(defenderType => {
            // Find the effectiveness relation for this moveType against the defender's type
            let typeEffect = moveType.effectiveness_relations.find(relation => relation.target_type === defenderType.name)
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

    // Calculates type effectiveness multiplier
    const effectivenessMultipliers = { 
        super_effective: 2,
        less_effective: 0.5,
        not_effective: 0,
        normal: 1
    };

    // Random move choice for AI opponent
    const selectRandomMove = (pokemon) => {
        const randomIndex = Math.floor(Math.random() * pokemon.chosen_moves.length)
        return pokemon.chosen_moves[randomIndex];
    };

    // Logic for battle flow after an attack is selected
    const performBattle = async (firstAttacker, secondAttacker, firstMove, secondMove) => {
        // Execute the first attack and wait for it to complete
        const newHPAfterFirstAttack = await executeAttack(firstAttacker, secondAttacker, firstMove);

        // Use a delay to simulate asynchronous attack timing
        setTimeout(async () => {
            // Check if the second attacker is still able to fight before counterattacking
            if (newHPAfterFirstAttack > 0) {
                // Execute the second attack
                await executeAttack(secondAttacker, firstAttacker, secondMove);
            } else {
                // Handle the scenario where the first attacker's move was enough to make the second attacker faint
                const nextPokemon = selectNextCynthiaPokemon();
                if (!nextPokemon) {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            }
            setUserHasAttacked(false)
        }, 7000);


    };

    // Used when player switches out a Pokemon when their's has not fainted yet
    const enemySwitchCounterattack = (newPokemon) => {
        if (ourTeamHP[currentPokemon.pokemon.pokedex_number] > 0) {
            // if (currentPokemon.pokemon.hp > 0) {
            alert("The opponent triggers a counterattack as you switch in!")
            const randomMove = selectRandomMove(cynthiaPokemon)
            executeAttack(cynthiaPokemon, newPokemon, randomMove)
        }
        return
    }

    // Logic for damage calculations
    const executeAttack = async (attacker, defender, move) => {
        const attackStat = attacker.pokemon.attack > attacker.pokemon.special_attack ? attacker.pokemon.attack : attacker.pokemon.special_attack;
        const defenseStat = defender.pokemon.defense > defender.pokemon.special_defense ? defender.pokemon.defense : defender.pokemon.special_defense;
        const power = move.learnable_move.power;
        const typeEffectiveness = getTypeEffectiveness(move.learnable_move.move_type, defender.pokemon.types);
        const stab = attacker.pokemon.types.some(type => type.name === move.learnable_move.move_type.name) ? 1.5 : 1;


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
            effectivenessMessage = "It doesn't affect the target..."
        }

        await createBattleEvent(attacker, move, damage, effectivenessMessage);
        // setEvents(prevEvents => [...prevEvents, `${attacker.pokemon.name} uses ${move.learnable_move.name} and deals ${damage} damage! ${effectivenessMessage}`]);

        if (newHP <= 0) {
            setEvents(prevEvents => [...prevEvents, `${capitalizeAndFormat(defender.pokemon.name)} has fainted!`]);
            if (attacker === currentPokemon) {
                // If Cynthia's Pokémon faints, select the next Pokémon
                const nextPokemon = selectNextCynthiaPokemon();
                if (nextPokemon) {
                    // setCynthiaPokemon(nextPokemon);
                } else {
                    alert("Cynthia has no more Pokémon left! You win!");
                }
            } else {
                // alert("Your Pokémon has fainted, please select another to continue.");
                return
            }
        }
        console.log(move.learnable_move.name)
        console.log(`newHP: ${newHP}`)
        return newHP
    }

    // Posting commentary onto screen
    const createBattleEvent = async (attacker, move, damage, effectivenessMessage) => {
        const postData = {
            attacker: attacker.pokemon.name,
            move: move.learnable_move.name,
            damage: damage.toString(),
            effectiveness: effectivenessMessage
        };
        console.log("Sending battle event data:", postData);
        try {
            const response = await axios.post('http://localhost:8000/api/teams/battle_commentary/', postData);
            const actionDetail = `${capitalizeAndFormat(attacker.pokemon.name)} uses ${capitalizeAndFormat(move.learnable_move.name)} and deals ${damage} damage! ${effectivenessMessage}`;

            // Update events with the action detail first, then the commentary
            setEvents(prevEvents => [...prevEvents, actionDetail, response.data.commentary]);
        } catch (error) {
            console.error("Error fetching commentary:", error);
            alert('Failed to fetch battle commentary. Please try again.');
        }
    };

    // AI's selection for their next pokemon to put up once user has KO'd their current pokemon
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

    const handleAccordionChange = (key) => {
        // Toggle functionality: Click again to close the same accordion
        if (key === activeKey) {
            setActiveKey(null);
        } else {
            setActiveKey(key);
        }
    };

    return (
        <div className="main-content" style={{ marginTop: '20px' }}>
            <Container className="mt-5 text-center">
                {/* <h1>Battle Page</h1> */}
                {currentPokemon && cynthiaPokemon ? (
                    <>
                        <Row className="justify-content-center">
                            <Col md={4}>
                                <Card>
                                    <Card.Img variant="top" src={currentPokemon.pokemon.sprite} />
                                    <Card.Body>
                                        <Card.Title>{capitalizeAndFormat(currentPokemon.pokemon.name)}</Card.Title>
                                        <ProgressBar
                                            now={(ourTeamHP[currentPokemon.pokemon.pokedex_number] / currentPokemon.pokemon.hp) * 100}
                                            label={`HP: ${ourTeamHP[currentPokemon.pokemon.pokedex_number]} / ${currentPokemon.pokemon.hp}`}
                                            variant={progressBarColor(ourTeamHP[currentPokemon.pokemon.pokedex_number], currentPokemon.pokemon.hp)}
                                        />
                                        <Card.Text>Types: {capitalizeAndFormat(currentPokemon.pokemon.types.map(t => t.name).join(', '))}</Card.Text>
                                        <Tabs defaultActiveKey="fight">
                                            <Tab eventKey="fight" title="Fight">
                                                {/* check button disability */}
                                                <Row>
                                                    <Col>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            {currentPokemon.chosen_moves.map((move, index) => (
                                                                <Button
                                                                    key={index}
                                                                    onClick={() => handleAttack(move)}
                                                                    disabled={userHasAttacked}
                                                                    className="mb-2" // Adds margin to the bottom of each button
                                                                    style={{ width: '100%' }} // Makes each button take the full width of the flex container
                                                                >
                                                                    {capitalizeAndFormat(move.learnable_move.name)}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Tab>
                                            <Tab eventKey="switch" title="Switch Pokémon">

                                                {ourTeam.map((poke, index) => (
                                                    <Accordion key={index} activeKey={activeKey} onSelect={(key) => handleAccordionChange(key)}>
                                                        <Accordion.Item eventKey={index.toString()}>
                                                            <Accordion.Header>
                                                                {capitalizeAndFormat(poke.pokemon.name)} - HP: {ourTeamHP[poke.pokemon.pokedex_number]} / {poke.pokemon.hp}
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div>
                                                                    <strong>Moves:</strong>
                                                                    {poke.chosen_moves.map((move, idx) => (
                                                                        <p key={idx}>{capitalizeAndFormat(move.learnable_move.name)}</p>
                                                                    ))}
                                                                </div>
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
                                {/* <h2>Battle Log</h2> */}
                                <div style={{ textAlign: 'center' }}>
                                    <img src="/battle.png" alt="Opponent Page" style={{ maxWidth: '50%', height: 'auto' }} />
                                </div>
                                {events.map((event, index) => (
                                    <p key={index}>{event}</p>
                                ))}
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <Card.Img variant="top" src={cynthiaPokemon.pokemon.sprite} />
                                    <Card.Body>
                                        <Card.Title>{capitalizeAndFormat(cynthiaPokemon.pokemon.name)}</Card.Title>
                                        <ProgressBar
                                            now={(cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number] / cynthiaPokemon.pokemon.hp) * 100}
                                            label={`HP: ${cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number]} / ${cynthiaPokemon.pokemon.hp}`}
                                            variant={progressBarColor(cynthiaTeamHP[cynthiaPokemon.pokemon.pokedex_number], cynthiaPokemon.pokemon.hp)}
                                        />
                                        <Card.Text>Types: {capitalizeAndFormat(cynthiaPokemon.pokemon.types.map(t => t.name).join(', '))}</Card.Text>
                                        {cynthiaTeam.map((poke, index) => (
    <Accordion key={index} activeKey={cynthiaActiveKey} onSelect={(eventKey) => setCynthiaActiveKey(eventKey)}>
    <Accordion.Item eventKey={index.toString()}>
        <Accordion.Header>
            {capitalizeAndFormat(poke.pokemon.name)} - HP: {cynthiaTeamHP[poke.pokemon.pokedex_number]} / {poke.pokemon.hp}
        </Accordion.Header>
        <Accordion.Body>
            <strong>Moves:</strong>
            {poke.chosen_moves.map((move, idx) => (
                <p key={idx}>{capitalizeAndFormat(move.learnable_move.name)}</p>
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
                            {/* <h2>Select your Pokémon!</h2> */}
                            <div style={{ textAlign: 'center' }}>
                                <img src="/selectyourpokemon.png" alt="Opponent Page" style={{ maxWidth: '50%', height: 'auto' }} />
                            </div>
                            <h5>They will be fighting first!</h5>
                            <div className="d-flex flex-wrap justify-content-center">
                                {ourTeam.map(pokemon => (
                                    <Card key={pokemon.pokemon.name} style={{ width: '18rem', margin: '10px' }}>
                                        <Card.Body>
                                            <Card.Img variant="top" src={pokemon.pokemon.sprite} />
                                            <Card.Title>{capitalizeAndFormat(pokemon.pokemon.name)}</Card.Title>
                                            <Button variant="primary" onClick={() => initialSelectPokemon(pokemon)}>Select</Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );

}

export default BattlePage;