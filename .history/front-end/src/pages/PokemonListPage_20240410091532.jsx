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
import Pagination from 'react-bootstrap/Pagination';

const PokemonListPage = () => {
    const [pokemon, setPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const getPokemon = async () => {
            const data = await fetchPokemon();
            setPokemon(data.pokemonList); // Assuming data.pokemonList is the array of pokemon
            setIsLoading(false);
        };
        getPokemon();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pokemon.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(pokemon.length / itemsPerPage);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>,
            );
        }
        return (
            <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

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
            {/* Display currentItems here */}
            {currentItems.map((pokemon, index) => (
                <div key={index}>{pokemon.name}</div> // Example; adjust based on your data structure
            ))}
            <div>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            {renderPagination()}
        </div>
    );
};

export default PokemonListPage;
