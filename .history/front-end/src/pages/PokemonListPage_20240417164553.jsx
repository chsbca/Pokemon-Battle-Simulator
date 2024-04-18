import React, { useEffect, useState } from "react";
import axios from 'axios';
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { capitalizeAndFormat } from "../components/formatUtils";
import { Container } from "react-bootstrap";


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
            const pokemonList = data.pokemon_list || [];
            setPokemonDetails(pokemonList);
            console.log('Pokemon Details:', pokemonList);

            // Fetch sprites for each Pokémon
            const sprites = await Promise.all(pokemonList.map(pokemon => fetchPokemonSprite(pokemon.name)));
            const pokemonWithSprites = pokemonList.map((pokemon, index) => ({
                ...pokemon,
                sprite: sprites[index]
            }));
            setPokemonDetails(pokemonWithSprites);

            setIsLoading(false);
        };
        getPokemon();
    }, [page]);


    const handleFirstPage = () => setPage(1);
    const handleNext = () => setPage(prev => (prev < lastPage ? prev + 1 : prev));
    const handlePrevious = () => setPage(prev => (prev > 1 ? prev - 1 : prev));
    const handleLastPage = () => setPage(lastPage);

    const fetchPokemonSprite = async (pokemonName) => {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.sprites.front_default;  // or any other sprite link you need
        } catch (error) {
            console.error('Failed to fetch Pokémon sprite:', error);
            return null;
        }
    };


    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status" />
                <div><h1>Loading Pokémon...</h1></div>
            </>
        );
    }

    return (
        
        <Container>
        <div className="container">
            {/* <h2>Pokémon List</h2> */}
            <div style={{ textAlign: 'center' }}>
                <img src="/pokemonlist.png" alt="Pokémon List" style={{ maxWidth: '50%', height: 'auto' }} />
            </div>
            <div className="pagination-controls d-flex justify-content-center">
                <button onClick={handleFirstPage} disabled={page === 1} className="btn btn-primary mx-1 mb-2">First Page</button>
                <button onClick={handlePrevious} disabled={page === 1} className="btn btn-primary mx-1 mb-2">Previous</button>
                <button onClick={handleNext} disabled={page >= lastPage} className="btn btn-primary mx-1 mb-2">Next</button>
                <button onClick={handleLastPage} disabled={page >= lastPage} className="btn btn-primary mx-1 mb-2">Last Page</button>
            </div>
            <div className="row">
                {pokemonDetails.map((pokemon, index) => (
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{capitalizeAndFormat(pokemon.name)}</h5>
                                <p className="card-text">Pokédex #{pokemon.pokedexNumber}</p>
                                <p className="card-text">Type/s: {capitalizeAndFormat(pokemon.types.join(', '))} <br />
                                HP: {pokemon.stats.hp}
                                </p>
                                <p className="card-text"></p>
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
                <button onClick={handleFirstPage} disabled={page === 1} className="btn btn-primary" style={{ margin: '2px' }}>First Page</button>
                <button onClick={handlePrevious} disabled={page === 1} className="btn btn-primary" style={{ margin: '2px' }}>Previous</button>
                <button onClick={handleNext} disabled={page >= lastPage} className="btn btn-primary" style={{ margin: '2px' }}>Next</button>
                <button onClick={handleLastPage} disabled={page >= lastPage} className="btn btn-primary" style={{ margin: '2px' }}>Last Page</button>
            </div>
        </div>
        </Container>
    );
}

export default PokemonListPage;
