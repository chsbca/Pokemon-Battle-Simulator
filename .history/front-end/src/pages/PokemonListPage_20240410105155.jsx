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
    const [totalPokemons, setTotalPokemons] = useState(0); // Total number of Pokémon for pagination

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

    useEffect(() => {
        console.log(`Fetching with offset: ${offset}`);
        const getPokemon = async () => {
            setIsLoading(true);
            const data = await fetchPokemon(limit, offset);
            const detailedPokemon = await getPokemonDetails(data.pokemon_list);
            setPokemonDetails(detailedPokemon);
            setTotalPokemons(data.count); // Assuming `fetchPokemon` also returns the total count
            setIsLoading(false);
        };
        getPokemon();
    }, [offset]);

    const handleNext = () => {
        if ((offset + limit) < totalPokemons) {
            setOffset(prevOffset => prevOffset + limit);
        }
    };

    const handlePrevious = () => {
        if (offset > 0) {
            setOffset(prevOffset => Math.max(0, prevOffset - limit));
        }
    };

    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status" />
                <div><h1>Loading Pokemon...</h1></div>
            </>
        );
    }

    return (
        <div className="container">
            <h2>Pokemon List</h2>
            <div className="row">
                {pokemonDetails.map((pokemon, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">Pokedex #: {pokemon.pokedexNumber}</p>
                                <p className="card-text">Type/s: {pokemon.types.join(', ')}</p>
                                {/* Display other details as needed */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevious} disabled={offset === 0}>Previous</button>
                <button onClick={handleNext} disabled={(offset + limit) >= totalPokemons}>Next</button>
            </div>
        </div>
    );
};

export default PokemonListPage;
