import { useEffect, useState } from "react";
import { fetchPokemon } from "../fetching/PokemonFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import Spinner from 'react-bootstrap/Spinner'


const PokemonListPage = () => {
    const [pokemon, setPokemon] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getPokemon = async () => {
            const data = await fetchPokemon();
            setPokemon(data)
            setIsLoading(false)
        }
        getPokemon()
    }, [])

    if (!isLoading) {
        return (
            <Spinner animation="grow" role="status">
                <span className="visually-hidden">Loading Pokemon...</span>
            </Spinner>
        )
        // <div className="text-center">Loading Pokemon...</div>
    }

    return (
        <div>
            <h2>PokemonListPage.jsx</h2>
        </div>
    )
}

export default PokemonListPage