import axios from 'axios'

export const fetchPokemon = async (page = 1) => {
    try {
        const url = `http://localhost:8000/api/pokemon/?page=${page}`;
        const response = await axios.get(url);
        console.log('Raw API Data:', response.data)
        return {
            pokemon_list: response.data.results,
            nextPage: response.data.next,
            previousPage: response.data.previous,
        };
    } catch (error) {
        console.error("error fetching pokemon:", error);
        return {
            pokemon_list: [],
            nextPage: null,
            previousPage: null,
        };
    }
};


