import React from 'react';

export default function OpponentsPage() {
    return (
        <div className="container mt-5">
            <h2>Opponents</h2>
            <div className="accordion" id="opponentsAccordion">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingCynthia">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCynthia" aria-expanded="true" aria-controls="collapseCynthia">
                            Cynthia - Champion of the Elite Four
                        </button>
                    </h2>
                    <div id="collapseCynthia" className="accordion-collapse collapse show" aria-labelledby="headingCynthia" data-bs-parent="#opponentsAccordion">
                        <div className="accordion-body">
                            <strong>First Game Appearance:</strong> Pokémon Diamond and Pearl<br />
                            <strong>Role:</strong> Champion of the Elite Four<br />
                            <button className="btn btn-primary m-1">Pokémon Team</button>
                            <button className="btn btn-danger m-1">Fight</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
