import React from 'react';
import { useUser } from '../components/UserContext'; // Make sure the path is correct

export default function ProfilePage() {
    const { user } = useUser(); // Using the useUser hook to access user info

    const displayEmail = user && user.email.split('@')[0]; // Safely split the email string at '@' and take the first part

    return (
        <div>
            <h2>Profile Page</h2>
            <p>Welcome, {displayEmail}!</p> {/* Display the formatted email */}
        </div>
    );
}
