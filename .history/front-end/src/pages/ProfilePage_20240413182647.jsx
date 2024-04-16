import React from 'react';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser(); // Using the useUser hook to access user info

    const displayEmail = user.email.split('@')[0]

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Welcome, {displayEmail}!</p> {/* Display the formatted email or a default message */}
        </div>
    );
}
