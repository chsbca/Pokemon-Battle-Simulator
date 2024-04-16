import React from 'react';
import { useUser } from '../components/UserContext'; // Ensure the path is correct

export default function ProfilePage() {
    const { user } = useUser(); // Using the useUser hook to access user info

    // Check if user exists and user.email is not undefined before attempting to split
    const displayEmail = user && user.email ? user.email.split('@')[0] : 'Not Logged In';

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Welcome, {displayEmail}!</p> {/* Display the formatted email or a default message */}
        </div>
    );
}
