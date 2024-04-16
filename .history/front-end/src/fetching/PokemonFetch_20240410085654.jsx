import axios from 'axios'

export const fetchPokemon = async () => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/')
        return {
            pokemon_list: response.data.results,
            nextPageUrl: response.data.next,
        }
    } catch (error) {
        console.error("error fetching pokemon:", error)
        return []
    }
}