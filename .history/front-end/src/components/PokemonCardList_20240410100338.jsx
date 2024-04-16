import React from 'react';
import Card from 'react-bootstrap/Card';

const PokemonCardList = ({ pokemon }) => {
    // Destructure pokemon properties for easier access
    const { name, pokedexNumber, sprite, types, stats } = pokemon;

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={sprite} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                    Pokedex #: {pokedexNumber}
                    <br />
                    Types: {types.join(', ')}
                    <br />
                    HP: {stats.hp}
                    <br />
                    Attack: {stats.attack}
                    <br />
                    Defense: {stats.defense}
                    <br />
                    Special Attack: {stats.special-attack}
                    <br />
                    Special Defense: {stats.special-defense}
                    <br />
                    Speed: {stats.speed}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default PokemonCardList;
