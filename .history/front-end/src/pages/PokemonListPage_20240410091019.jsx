import { useEffect, useState } from "react";
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import Spinner from 'react-bootstrap/Spinner'


// const PokemonListPage = () => {
//     const [pokemon, setPokemon] = useState([])
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         const getPokemon = async () => {
//             const data = await fetchPokemon();
//             setPokemon(data)
//             console.log(data)
//             setIsLoading(false)
//         }
//         getPokemon()
//     }, [])

//     if (isLoading) {
//         return (
//             <>
//                 <Spinner animation="border" role="status"/>
//                 <div>
//                     <h1>Loading Pokemon...</h1>
//                 </div>
//             </>
            
//         )
//     }

//     return (
//         <div>
//             <h2>PokemonListPage.jsx</h2>
//         </div>
//     )
// }

const PokemonListPage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 per page

    useEffect(() => {
        const getPokemon = async () => {
            const data = await fetchPokemon();
            setPokemon(data.pokemonList);
            setIsLoading(false);
        };
        getPokemon();
    }, []);

    // Calculate the currently displayed Pokémon based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pokemon.slice(indexOfFirstItem, indexOfLastItem);

    // Change page handler
    const paginate = pageNumber => setCurrentPage(pageNumber);

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
            {/* Display currentItems here */}
            // Inside your return statement, after displaying currentItems

// Items per page selector
<select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
    <option value="20">20</option>
    <option value="50">50</option>
    <option value="100">100</option>
</select>

// Pagination controls
<div>
    {/* Create buttons or links for each page number based on total count */}
    {/* Use the paginate function to set the current page */}
</div>
        </div>
    );
};


export default PokemonListPage