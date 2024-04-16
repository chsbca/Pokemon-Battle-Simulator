import axios from 'axios'

// export const fetchPokemon = async () => {
//     try {
//         const response = await axios.get('https://pokeapi.co/api/v2/pokemon/')
//         return {
//             pokemon_list: response.data.results,
//             nextPage: response.data.next,
//             previousPage: response.data.previous
//         }
//     } catch (error) {
//         console.error("error fetching pokemon:", error)
//         return {
//             pokemon_list: [],
//             nextPage: null,
//             previousPage: null
//         }
//     }
// }

export const fetchPokemon = async (limit = 100000, offset = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
        const response = await axios.get(url);
        return {
            pokemonList: response.data.results,
            count: response.data.count, // Total number of Pokemon
        };
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        return { pokemonList: [], count: 0 };
    }
};
