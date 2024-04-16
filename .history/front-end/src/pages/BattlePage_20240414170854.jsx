import React from 'react';
import { useParams } from 'react-router-dom';

const BattlePage = () => {
    const { opponentEmail } = useParams(); // Destructure the opponentEmail from useParams

    // Function to format the opponent's name
    const formatOpponentName = (email) => {
        const namePart = email.split('@')[0]; // Split the email by '@' and take the first part
        return namePart.charAt(0).toUpperCase() + namePart.slice(1); // Capitalize the first letter and return
    };

    return (
        <div className="container mt-5">
            <h1>Battle Page</h1>
            <p>Battling against: {formatOpponentName(opponentEmail)}</p>
            <p>Welcome to the battle arena! Here you will face your opponent.</p>
        </div>
    );
}

export default BattlePage;
