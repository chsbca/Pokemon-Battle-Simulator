import React from 'react';

export default function OpponentsPage() {
    return (
        <div className="container mt-5">
            <h2>Opponents</h2>
            <div className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title">Cynthia</h5>
                    <h6 className="card-subtitle mb-2 text-muted">First Game Appearance: Pokémon Diamond</h6>
                    <p className="card-text">Role: Champion of the Elite Four</p>
                    <button className="btn btn-primary m-1">Pokémon Team</button>
                    <button className="btn btn-danger m-1">Fight</button>
                </div>
            </div>
        </div>
    );
}
