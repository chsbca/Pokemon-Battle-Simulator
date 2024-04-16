// import { useEffect, useState } from "react";
// import { fetchPokemon } from "../fetching/PokemonFetch";
// import 'bootstrap/dist/css/bootstrap.min.css'
// import Spinner from 'react-bootstrap/Spinner'


// const PokemonListPage = () => {
//     const [pokemon, setPokemon] = useState([])
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         const getPokemon = async () => {
//             const data = await fetchPokemon();
//             setPokemon(data.pokemon_list)
//             console.log("these are the pokemon:", data.pokemon_list)
//             setIsLoading(false)
//         }
//         getPokemon()
//     }, [])

//     if (isLoading) {
//         return (
//             <>
//                 <Spinner animation="border" role="status" />
//                 <div>
//                     <h1>Loading Pokemon...</h1>
//                 </div>
//             </>

//         )
//     }

//     return (
//         <>
//             <h2>PokemonListPage.jsx</h2>
//             <div>
//                 <ul>
//                     {pokemon.map((poke, index) => (
//                         <li key={index}>{poke.name}</li> // Example of rendering Pokémon names
//                     ))}
//                 </ul>
//             </div>
//         </>
//     )
// }

// export default PokemonListPage;

import { useEffect, useState } from "react";
import { fetchPokemon } from "../fetching/PokemonFetch";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import PokemonCard from "../components/PokemonCardList";

const PokemonListPage = () => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getPokemonDetails = async (pokemonList) => {
            const promises = pokemonList.map(async (poke) => {
                const response = await axios.get(poke.url);
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
        <div>
            <h2>Pokemon List</h2>
            <div>
                {pokemonDetails.map((pokemon, index) => (
                    <PokemonCard key={index} pokemon={pokemon} />
                ))}
            </div>
        </div>
    );
};

export default PokemonListPage;
