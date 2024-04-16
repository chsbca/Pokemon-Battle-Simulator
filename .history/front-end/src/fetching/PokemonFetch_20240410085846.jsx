import axios from 'axios'

export const fetchPokemon = async () => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/')
        return {
            pokemon_list: response.data.results,
            nextPage: response.data.next,
            previousPage: response.data.previous
        }
    } catch (error) {
        console.error("error fetching pokemon:", error)
        return {
            pokemon_list: [],
            nextPage: null,
            previousPage: null
        }
    }
}