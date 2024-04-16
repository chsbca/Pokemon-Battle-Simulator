import axios from 'axios'

export const fetchPokemon = async (limit = 100000, offset = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    try {
        const response = await axios.get(url)
        return {
            pokemonList: response.data.results,
            count: response.data.count
        }
    } catch (error) {
        console.error("Error fetching Pokémon:", error)
        return { pokemonList: [], count: 0 }
    }
}