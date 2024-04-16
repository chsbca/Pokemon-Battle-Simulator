import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext'; // Adjust the import path according to your project structure

export default function ProfilePage() {
    const { user } = useContext(UserContext); // Assuming you store user info in UserContext

    const displayEmail = user.email.split('@')[0]; // This splits the email string at '@' and takes the first part

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Welcome, {displayEmail}!</p>
        </div>
    );
}
