import axios from 'axios'

export const fetchPokemon = async () => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/')
        return response.data.results
    } catch (error) {
        console.error("error fetching pokemon:", error)
        return []
    }
}