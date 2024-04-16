import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser();
    const [team, setTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [learnableMoves, setLearnableMoves] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState('');

    useEffect(() => {
        const fetchTeam = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8000/api/user_team/', {
                        headers: { Authorization: `Token ${token}` }
                    });
                    setTeam(response.data.team);
                } catch (error) {
                    console.error('Failed to fetch team:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchTeam();
    }, [user, teamUpdated]); // Dependency on teamUpdated to refetch the team when it changes

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/pokemon/?q=${searchTerm}`);
            setSearchResults(response.data.results);
            setSearchTerm(''); // Clear search input after fetching results
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const clearSearchResults = () => {
        setSearchResults([]);
        setSearchTerm(''); // Clear search input when clearing results
    };

    const addToTeam = async (pokemon) => {
        if (team.length >= 6) {
            alert("You have 6 Pokémon already! Please remove at least 1 to add more.");
            return; // Exit the function if the team already has 6 Pokémon
        }

        console.log('Adding to team:', pokemon);  // This will help verify what data you have
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/user_team/', {
                pokemon_id: pokemon.pokedexNumber  // Send the pokedexNumber as pokemon_id
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Added to team:', response.data);
            setTeamUpdated(!teamUpdated); // Toggle to trigger a re-fetch of the team
        } catch (error) {
            console.error('Error adding to team:', error.response ? error.response.data : error);
        }
    };

    const removeFromTeam = async (pokemonId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:8000/api/user_team/${pokemonId}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Removed from team:', response.data);
            setTeamUpdated(!teamUpdated);  // Trigger re-fetch or update local state to reflect the change
        } catch (error) {
            console.error('Error removing from team:', error.response ? error.response.data : error);
        }
    };

    const handleShowLearnableMoves = async (pokemonId) => {
        setShowOffcanvas(true);
        const response = await axios.get(`http://localhost:8000/api/pokemon/${pokemonId}/moves`, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        setLearnableMoves(response.data);
        setSelectedPokemon(pokemon.name);
    };

    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
    };

    return (
        <div>
            <h2>Profile Page</h2>
            <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ margin: '10px' }}
            />
            <button onClick={handleSearch} className="btn btn-primary" style={{ margin: '5px' }}>Search</button>
            <button onClick={clearSearchResults} className="btn btn-secondary ms-2">Clear Search Results</button>
            <h3>Your Pokémon Team:</h3>
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
                                <button onClick={() => removeFromTeam(pokemon.pokedex_number)} className="btn btn-danger" style={{ margin: '5px' }}>
                                    Remove from Team
                                </button>
                            </Accordion.Body>
                        </Accordion.Item>
                    )) : <p>No Pokémon assigned to your team.</p>}
                </Accordion>
            }
            
            {searchResults.length > 0 && <h3>Search Results:</h3>}
            <div style={{ paddingLeft: '20px' }}>
                {searchResults.map((pokemon, index) => (
                    <div key={index}>
                        {pokemon.name}
                        <button onClick={() => addToTeam(pokemon)} className="btn btn-primary" style={{ margin: '5px' }}>
                            Add to Team
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
