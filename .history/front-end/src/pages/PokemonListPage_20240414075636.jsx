import React, { useEffect, useState } from "react";
import axios from 'axios';
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

const PokemonListPage = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 20; // Number of items per page
    const totalPokemons = 1025; // Total number of Pokémon
    const lastPage = Math.ceil(totalPokemons / limit);

    useEffect(() => {
        const getPokemon = async () => {
            setIsLoading(true);
            const data = await fetchPokemon(page);
            setPokemonDetails(data.pokemon_list || []);
            console.log('Pokemon Details:', data.pokemon_list);
            setIsLoading(false);
        };
        getPokemon();
    }, [page]);

    const handleFirstPage = () => setPage(1);
    const handleNext = () => setPage(prev => (prev < lastPage ? prev + 1 : prev));
    const handlePrevious = () => setPage(prev => (prev > 1 ? prev - 1 : prev));
    const handleLastPage = () => setPage(lastPage);

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
                <button onClick={handleFirstPage} disabled={page === 1} className="btn btn-primary" style={{ margin: '1px' }}>First Page</button>
                <button onClick={handlePrevious} disabled={page === 1} className="btn btn-primary" style={{ margin: '1px' }}>Previous</button>
                <button onClick={handleNext} disabled={page >= lastPage} className="btn btn-primary" style={{ margin: '1px' }}>Next</button>
                <button onClick={handleLastPage} disabled={page >= lastPage} className="btn btn-primary" style={{ margin: '1px' }}>Last Page</button>
            </div>
            <div className="row">
                {pokemonDetails.map((pokemon, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            {/* Uncomment and use if sprites are available */}
                            {/* <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} /> */}
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">PokeDex #{pokemon.pokedexNumber}</p>
                                <p className="card-text">Type/s: {pokemon.types.join(', ')}</p>
                                <p className="card-text">HP: {pokemon.stats.hp}</p>
                                <p className="card-text">Attack: {pokemon.stats.attack}</p>
                                <p className="card-text">Defense: {pokemon.stats.defense}</p>
                                <p className="card-text">Special Attack: {pokemon.stats["special_attack"]}</p>
                                <p className="card-text">Special Defense: {pokemon.stats["special_defense"]}</p>
                                <p className="card-text">Speed: {pokemon.stats.speed}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handleFirstPage} disabled={page === 1} className="btn btn-primary">First Page</button>
                <button onClick={handlePrevious} disabled={page === 1} className="btn btn-primary">Previous</button>
                <button onClick={handleNext} disabled={page >= lastPage} className="btn btn-primary">Next</button>
                <button onClick={handleLastPage} disabled={page >= lastPage} className="btn btn-primary">Last Page</button>
            </div>
        </div>
    );
}

export default PokemonListPage;
