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
                try {
                    const response = await axios.get('http://localhost:8000/api/user_team/', {
                        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                    });
                    setTeam(response.data.team);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to fetch team:', error);
                    setIsLoading(false);
                }
            }
        };

        fetchTeam();
    }, [user]);

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Welcome, {user && user.email.split('@')[0]}!</p>
            <h3>Your Pokémon Team:</h3>
            {isLoading ? <p>Loading...</p> :
                <Accordion>
                    {team.length > 0 ? team.map((pokemon, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>Pokemon {index + 1} - {pokemon.name}</Accordion.Header>
                            <Accordion.Body>
                                <div>Pokedex Number: {pokemon.pokedex_number}</div>
                                <div>Types: {pokemon.types.join(', ')}</div>
                                <div>HP: {pokemon.stats.hp}</div>
                                <div>Attack: {pokemon.stats.attack}</div>
                                <div>Defense: {pokemon.stats.defense}</div>
                                <div>Special Attack: {pokemon.stats.special_attack}</div>
                                <div>Special Defense: {pokemon.stats.special_defense}</div>
                                <div>Speed: {pokemon.stats.speed}</div>
                            </Accordion.Body>
                        </Accordion.Item>
                    )) : <p>No Pokémon assigned to your team.</p>}
                </Accordion>
            }
        </div>
    );
}
