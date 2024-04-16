import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser();
    const [team, setTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [teamUpdated, setTeamUpdated] = useState(false); // State to track team updates
    const [showOffcanvas, setShowOffcanvas] = useState(false); // To control the visibility of the offcanvas
    const [learnableMoves, setLearnableMoves] = useState([]); // To store learnable moves
    const [selectedPokemon, setSelectedPokemon] = useState('');
    const [learnedMoves, setLearnedMoves] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8000/api/user_team/', {
                        headers: { Authorization: `Token ${token}` }
                    });
                    console.log("Team data:", response.data.team); // Log the complete team data

                    const teamWithMoves = await Promise.all(response.data.team.map(async (teamMember) => {
                        if (!teamMember.id) {
                            console.error("No valid identifier for team member:", teamMember);
                            return { ...teamMember, learnedMoves: [{ name: 'Identifier missing!' }] };
                        }
                        const movesResponse = await axios.get(`http://localhost:8000/api/team_pokemon/${teamMember.id}/chosen_moves/`, {
                            headers: { Authorization: `Token ${token}` }
                        });
                        return { ...teamMember, learnedMoves: movesResponse.data.length ? movesResponse.data : [{ name: 'No moves learned!' }] };
                    }));

                    setTeam(teamWithMoves);
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

    // //current working code, dk what the 3rd fetchlearnablemoves is
    // const fetchLearnableMoves = async (pokemonId, pokemonName) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:8000/api/pokemon/${pokemonId}/moves/`, {
    //             headers: { Authorization: `Token ${token}` }
    //         });
    //         console.log('API response for moves:', response.data);
    //         // const sortedMoves = response.data.sort((a, b) => a.name.localeCompare(b.name)); // Sorting moves alphabetically
    //         // setLearnableMoves(sortedMoves);
    //         setLearnableMoves(response.data.map(move => ({
    //             id: move.id,
    //             name: move.name,
    //             description: move.description
    //         })));
    //         setSelectedPokemon({ id: pokemonId, name: pokemonName }); // Set the selected Pokémon's name for the offcanvas header
    //         setShowOffcanvas(true); // Open the offcanvas to show the moves
    //     } catch (error) {
    //         console.error('Failed to fetch learnable moves:', error);
    //         setLearnableMoves([]); // Reset to empty if there's an error
    //     }
    // };

    const fetchLearnableMoves = async (pokemonId, pokemonName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/pokemon/${pokemonId}/moves/`, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('API response for moves:', response.data);
            setLearnableMoves(response.data.moves.map(move => ({
                id: move.id,
                name: move.name,
                description: move.description
            })));
            setSelectedPokemon({ id: pokemonId, name: pokemonName }); // Set the selected Pokémon's name for the offcanvas header
            setShowOffcanvas(true); // Open the offcanvas to show the moves
        } catch (error) {
            console.error('Failed to fetch learnable moves:', error);
            setLearnableMoves([]); // Reset to empty if there's an error
        }
    };
    


    // React to updates in `selectedPokemon`
    useEffect(() => {
        if (selectedPokemon.id && selectedPokemon.name) {
            console.log('Updated selectedPokemon.id: ', selectedPokemon.id);
            console.log('Updated selectedPokemon.name: ', selectedPokemon.name);
            console.log('learnableMoves data: ', learnableMoves)
        }
    }, [selectedPokemon, learnableMoves]); // Only re-run the effect if `selectedPokemon` changes

    const addChosenMove = async (moveId, teamPokemonId) => {
        console.log('Attempting to add move:', moveId, 'to teamPokemonId:', teamPokemonId); // Debug: Check these values
        if (!moveId) {
            console.error('No moveId provided');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/api/team_pokemon/${teamPokemonId}/chosen_moves/`, {
                move_id: moveId  // Ensure this payload structure matches the backend's expectation
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            console.log('Move added successfully:', response.data);
            // Optionally update the state or re-fetch data to reflect the change in UI
        } catch (error) {
            console.error('Error adding chosen move:', error.response ? error.response.data : error);
        }
    };





    const fetchChosenMoves = async (teamPokemonId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/team_pokemon/${teamPokemonId}/chosen_moves/`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            });
            setLearnedMoves(response.data); // Assuming you have a state variable to store these
        } catch (error) {
            console.error('Failed to fetch chosen moves:', error);
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
                            <Accordion.Header>Pokémon {index + 1} - {pokemon.name}
                            </Accordion.Header>
                            <Accordion.Body>
                                <button className="btn btn-info mb-3"
                                    onClick={() => {
                                        console.log(`Fetching learnable moves for Pokémon ID: ${pokemon.id} with Pokédex Number: ${pokemon.pokedex_number}`);
                                        fetchLearnableMoves(pokemon.id, pokemon.pokedex_number)
                                    }}>
                                    View Learnable Moves
                                </button>
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
                                        pokemon.learnedMoves.map((move, idx) => (
                                            <li key={idx}>{move.name}</li>
                                        ))
                                    ) : (
                                        <li>No moves learned!</li>
                                    )}
                                </ul>
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
            <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{selectedPokemon.name} Moves</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {learnableMoves.length ? (
                        learnableMoves.map((move, idx) => (
                            // console.log(`Rendering move: ${move.name} with ID: ${move.id}`),
                            <p key={idx}>
                                <button
                                    onClick={() => {
                                        console.log(`move.id: ${move.id} and selectedPokemon.id: ${selectedPokemon.id}`);
                                        addChosenMove(move.id, selectedPokemon.id);
                                    }}
                                    className="btn btn-primary"
                                    style={{ margin: '5px' }}
                                >
                                    +
                                </button>

                                {move.name}
                            </p>
                        ))

                    ) : (
                        <p>No learnable moves available.</p>
                    )}

                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}


