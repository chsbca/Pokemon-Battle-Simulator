import React, { useEffect, useState } from "react";
import axios from 'axios';
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

import React, { useEffect, useState } from 'react';
import { fetchPokemon } from '../fetching/PokemonFetch';

const PokemonListPage = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const totalPokemons = 1025;  // Total number of Pokémon, this should ideally come from the backend
    const itemsPerPage = 20;

    useEffect(() => {
        const loadPokemon = async () => {
            setIsLoading(true);
            const data = await fetchPokemon(page);
            setPokemonDetails(data.pokemon_list || []);
            setIsLoading(false);
        };
        loadPokemon();
    }, [page]);

    const handlePagination = (newPage) => {
        setPage(newPage);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {pokemonDetails.map((pokemon, index) => (
                <div key={index}>
                    <h3>{pokemon.name} (Pokedex #{pokemon.pokedexNumber})</h3>
                    <ul>
                        {pokemon.types.map(type => <li key={type}>{type}</li>)}
                    </ul>
                </div>
            ))}
            <button disabled={page <= 1} onClick={() => handlePagination(page - 1)}>Previous</button>
            <button disabled={page * itemsPerPage >= totalPokemons} onClick={() => handlePagination(page + 1)}>Next</button>
        </div>
    );
};

export default PokemonListPage;

