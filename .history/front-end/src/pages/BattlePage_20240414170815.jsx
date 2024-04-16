import React from 'react';
import { useParams } from 'react-router-dom';

const BattlePage = () => {
    const { opponentEmail } = useParams(); // Destructure the opponentEmail from useParams

    

    return (
        <div className="container mt-5">
            <h1>Battle Page</h1>
            <p>Battling against: {opponentEmail}</p>
            <p>Welcome to the battle arena! Here you will face your opponent.</p>
        </div>
    );
}

export default BattlePage;
