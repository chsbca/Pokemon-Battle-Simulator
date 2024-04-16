import { useEffect, useState } from "react";
import axios from 'axios';
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

const PokemonListPage = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getPokemonDetails = async (pokemonList) => {
            const promises = pokemonList.map(async (pokemon) => {
                const response = await axios.get(pokemon.url);
                const details = response.data;

                return {
                    name: details.name,
                    pokedexNumber: details.id,
                    sprite: details.sprites.front_default,
                    types: details.types.map(typeInfo => typeInfo.type.name),
                    // Consider filtering or transforming stats as needed
                    stats: details.stats.reduce((acc, stat) => {
                        acc[stat.stat.name] = stat.base_stat;
                        return acc;
                    }, {})
                };
            });

            return await Promise.all(promises);
        };

        const getPokemon = async () => {
            const data = await fetchPokemon();
            const detailedPokemon = await getPokemonDetails(data.pokemon_list);
            setPokemonDetails(detailedPokemon);
            setIsLoading(false);
        };
        getPokemon();
    }, []);

    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status"/>
                <div>
                    <h1>Loading Pokemon...</h1>
                </div>
            </>
        );
    }

    return (
        <div className="container">
            <h2>Pokemon List</h2>
            <div className="row">
                {pokemonDetails.map((pokemon) => (
                    <div key={pokemon.pokedexNumber} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card">
                            <img src={pokemon.sprite} className="card-img-top" alt={pokemon.name} />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">PokeDex #{pokemon.pokedexNumber}</p>
                                <p className="card-text">Types: {pokemon.types.join(', ')}</p>
                                {/* Implement additional details and stats as needed */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonListPage;
