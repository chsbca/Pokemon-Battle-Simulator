import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser();
    const [team, setTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8000/api/user_team/', {
                        headers: { Authorization: `Token ${token}` }
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
        console.log('Adding to team:', pokemon);  // Check what the pokemon object looks like
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/user_team/', {
                pokemon_id: pokemon.id  // Ensure you're sending the correct identifier
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Added to team:', response.data);
            // Additional logic to handle response and update UI accordingly
        } catch (error) {
            console.error('Error adding to team:', error.response ? error.response.data : error);
            // Handle errors, possibly display an error message to the user
        }
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
                            </Accordion.Body>
                        </Accordion.Item>
                    )) : <p>No Pokémon assigned to your team.</p>}
                </Accordion>
            }
            {searchResults.length > 0 && <h3>Search Results:</h3>}
            <div style={{ paddingLeft: '20px' }}>
                {searchResults.map((pokemon, index) => (
                    <div key={index}>
                        {pokemon.name}<button onClick={() => addToTeam(pokemon)} className="btn btn-primary" style={{ margin: '5px' }}>Add to Team</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
