import React, { useEffect, useState } from "react";
import axios from 'axios';
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

const PokemonListPage = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const limit = 20; // Number of items per page

    console.log(`Current offset outside useEffect: ${offset}`); // Directly log state updates

    useEffect(() => {
        console.log(`Fetching with offset: ${offset}`); // Confirm offset is being updated

        const getPokemonDetails = async (pokemonList) => {
            const promises = pokemonList.map(async (pokemon) => {
                const response = await axios.get(pokemon.url);
                const details = response.data;

                return {
                    name: details.name,
                    pokedexNumber: details.id,
                    sprite: details.sprites.front_default,
                    types: details.types.map(typeInfo => typeInfo.type.name),
                    stats: details.stats.reduce((acc, stat) => {
                        acc[stat.stat.name] = stat.base_stat;
                        return acc;
                    }, {})
                };
            });

            return await Promise.all(promises);
        };

        const getPokemon = async () => {
            setIsLoading(true);
            const data = await fetchPokemon(limit, offset);
            const detailedPokemon = await getPokemonDetails(data.pokemon_list);
            setPokemonDetails(detailedPokemon);
            setIsLoading(false);
        };
        getPokemon();
    }, [offset]); // Dependency array includes offset

    const handleNext = () => {
        console.log(`Next clicked, current offset: ${offset}`); // Debug log
        const newOffset = offset + limit;
        console.log(`New offset should be: ${newOffset}`); // Check the calculation
        setOffset(newOffset); // Directly set new offset for debugging
    };

    const handlePrevious = () => {
        console.log(`Previous clicked, current offset: ${offset}`);
        const newOffset = Math.max(0, offset - limit);
        console.log(`New offset should be: ${newOffset}`);
        setOffset(newOffset);
    };

    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status"/>
                <div><h1>Loading Pokemon...</h1></div>
            </>
        );
    }

    return (
        <div className="container">
            <h2>Pokemon List</h2>
            <div className="row">
                {pokemonDetails.map((pokemon, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4"> {/* Consider using a more stable key */}
                        <div className="card">
                            <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                {/* Additional details */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevious}>Previous</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default PokemonListPage;
