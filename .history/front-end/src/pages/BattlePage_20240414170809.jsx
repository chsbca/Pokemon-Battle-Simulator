import React from 'react';
import { useParams } from 'react-router-dom';

const BattlePage = () => {
    const { opponentEmail } = useParams(); // Destructure the opponentEmail from useParams

    def format_opponent_name(email):
    # Split the email at the '@' and take the first part
    name_part = email.split('@')[0]
    # Capitalize the first letter and return
    return name_part.capitalize()


    return (
        <div className="container mt-5">
            <h1>Battle Page</h1>
            <p>Battling against: {opponentEmail}</p>
            <p>Welcome to the battle arena! Here you will face your opponent.</p>
        </div>
    );
}

export default BattlePage;
