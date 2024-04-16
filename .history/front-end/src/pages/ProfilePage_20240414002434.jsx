import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser();
    const [team, setTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8000/api/user_team/', {
                        headers: { Authorization: `Token ${token}` }
                    });
                    const teamData = response.data.team;
                    for (let pokemon of teamData) {
                        const movesResponse = await axios.get(`http://localhost:8000/api/team_pokemon/${pokemon.id}/learned_moves`, {
                            headers: { Authorization: `Token ${token}` }
                        });
                        pokemon.learnedMoves = movesResponse.data; // Assuming this returns an array of moves
                    }
                    setTeam(teamData);
                } catch (error) {
                    console.error('Failed to fetch team:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchTeam();
    }, [user]);

    return (
        <div>
            <h2>Profile Page</h2>
            {isLoading ? <p>Loading...</p> :
                <Accordion>
                    {team.length > 0 ? team.map((pokemon, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>Pokémon {index + 1} - {pokemon.name}</Accordion.Header>
                            <Accordion.Body>
                                <div>Pokédex #{pokemon.pokedex_number}</div>
                                <div>Types: {pokemon.types.join(', ')}</div>
                                <div>HP: {pokemon.stats.hp}</div>
                                <div>Attack: {pokemon.stats.attack}</div>
                                <div>Defense: {pokemon.stats.defense}</div>
                                <div>Special Attack: {pokemon.stats.special_attack}</div>
                                <div>Special Defense: {pokemon.stats.special_defense}</div>
                                <div>Speed: {pokemon.stats.speed}</div>
                                <div>Learned Moves:</div>
                                <ul>
                                    {pokemon.learnedMoves && pokemon.learnedMoves.length > 0 ? (
                                        pokemon.learnedMoves.map((move, idx) => <li key={idx}>{move.name}</li>)
                                    ) : (
                                        <li>No moves learned!</li>
                                    )}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    )) : <p>No Pokémon assigned to your team.</p>}
                </Accordion>
            }
        </div>
    );
}
