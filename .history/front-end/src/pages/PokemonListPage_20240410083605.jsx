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
            console.log(data)
            setIsLoading(false)
        }
        getPokemon()
    }, [])

    if (isLoading) {
        return (
            <>
                <Spinner animation="border" role="status"/>
                <div>
                    <h1>Loading Pokemon...</h1>
                </div>
            </>
            
        )
    }

    return (
        <div>
            <h2>PokemonListPage.jsx</h2>
        </div>
    )
}

export default PokemonListPage