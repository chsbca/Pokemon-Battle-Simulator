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
    const totalPokemons = 1025; // Total number of Pokémon
    const lastPageOffset = totalPokemons - (totalPokemons % limit);


    console.log(`Current offset outside useEffect: ${offset}`); // Directly log state updates

    useEffect(() => {
        console.log(`Fetching with offset: ${offset}`); // Confirm offset is being updated

        const getPokemonDetails = async (pokemonList) => {
            const cacheKey = `pokemonDetails-${offset}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                return JSON.parse(cachedData);
            }

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

            const detailedPokemon = await Promise.all(promises);
            sessionStorage.setItem(cacheKey, JSON.stringify(detailedPokemon)); // Cache the fetched data
            return detailedPokemon;
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

    const handleFirstPage = () => {
        setOffset(0); // Set offset to 0 to fetch the first page
    };

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

    const handleLastPage = () => {
        setOffset(lastPageOffset);
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
            <div className="pagination-controls">
                <button onClick={handleFirstPage} disabled={offset === 0} className="btn btn-primary">First Page</button>
                <button onClick={handlePrevious} disabled={offset === 0} className="btn btn-primary">Previous</button>
                <button onClick={handleNext} className="btn btn-primary">Next</button>
            </div>
            <div className="row">
                {pokemonDetails.map((pokemon, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">PokeDex #{pokemon.pokedexNumber}</p>
                                <p className="card-text">Type/s: {pokemon.types.join(', ')}</p>
                                <p className="card-text">HP: {pokemon.stats.hp}</p>
                                <p className="card-text">Attack: {pokemon.stats.attack}</p>
                                <p className="card-text">Defense: {pokemon.stats.defense}</p>
                                <p className="card-text">Special Attack: {pokemon.stats["special-attack"]}</p>
                                <p className="card-text">Special Defense: {pokemon.stats["special-defense"]}</p>
                                <p className="card-text">Speed: {pokemon.stats.speed}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handleFirstPage} disabled={offset === 0} className="btn btn-primary">First Page</button>
                <button onClick={handlePrevious} disabled={offset === 0} className="btn btn-primary">Previous</button>
                <button onClick={handleNext} className="btn btn-primary">Next</button>
                <button onClick={handleLastPage} disabled={offset >= lastPageOffset} className="btn btn-primary">Last Page</button>
            </div>
        </div>
    );
}

export default PokemonListPage;
