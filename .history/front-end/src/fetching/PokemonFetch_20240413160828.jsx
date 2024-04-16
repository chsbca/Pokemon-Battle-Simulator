import axios from 'axios'

export const fetchPokemon = async (limit = 20, offset = 0) => {
    try {
        const url = `http://localhost:8000/api/pokemon/?limit=${limit}&offset=${offset}`;
        const response = await axios.get(url);
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

