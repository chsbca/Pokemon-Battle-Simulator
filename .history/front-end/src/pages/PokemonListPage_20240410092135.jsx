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

import { useEffect, useState } from "react";
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import ResponsivePagination from "../components/PaginationComponent";

const PokemonListPage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 per page

    useEffect(() => {
        const getPokemon = async () => {
            // Adjust fetchPokemon if needed to fetch all or a large number of Pokémon
            const data = await fetchPokemon();
            setPokemon(data.pokemonList); // Assuming data.pokemonList is an array
            setIsLoading(false);
        };
        getPokemon();
    }, []);

    // Calculate the currently displayed Pokémon based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pokemon.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <div>
                    <h1>Loading Pokemon...</h1>
                </div>
            </>
        );
    }

    return (
        <div>
            <h2>Pokemon List</h2>
            {/* Render the list of Pokémon */}
            {currentItems.map((poke, index) => (
                <div key={index}>{poke.name}</div> // Example rendering; adjust as needed
            ))}
            <ResponsivePagination
                totalItems={pokemon.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                paginate={setCurrentPage} // Passing setCurrentPage as paginate function
            />
            {/* Items per page selector */}
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    );
};

export default PokemonListPage;

