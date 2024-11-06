import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'

const DodajPojazd = () => {
    const [marka, setMarka] = useState('');
    const [model, setModel] = useState('');
    const [rokProdukcji, setRokProdukcji] = useState('');
    const [nrRejestracyjny, setNrRejestracyjny] = useState('');
    const [nrVin, setNrVin] = useState('');
    const [nastepneBadanie, setNastepneBadanie] = useState('');

    const navigate = useNavigate();

    const currentYear = 2024;
    const earliestYear = 1900;
    const years = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i);

    const handleSubmit = (e) => {
        e.preventDefault()
        const vehicle = { marka, model, rokProdukcji, nrRejestracyjny, nrVin, nastepneBadanie }

        fetch('http://localhost:3000/vehicles', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicle)
        }).then(() => {
            console.log("Dodano nowy pojazd")
            navigate('/moje_pojazdy')
        })
    }

    return(
        <div>
            <h2>+ Dodawanie pojazdu +</h2>
            <form onSubmit={handleSubmit}>
                <label>Marka</label>
                <input
                    type="text"
                    placeholder="Wprowadź markę pojazdu"
                    id="marka"
                    required
                    value={marka}
                    onChange={(e) => setMarka(e.target.value)}
                />

                <label>Model</label>
                <input
                    type="text"
                    placeholder="Wprowadź model pojazdu"
                    id="model"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />

                <label>Rok produkcji</label>
                <select
                    id="rok_prod"
                    name="rok_prod"
                    placeholder="Wprowadź rok produkcji pojazdu"
                    required value={rokProdukcji}
                    onChange={(e) => setRokProdukcji(e.target.value)}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>              

                <label>Numer rejestracyjny</label>
                <input
                    type="text"
                    placeholder="Wprowadź nr rejestracyjny pojazdu"
                    id="nr_rej"
                    required
                    value={nrRejestracyjny}
                    onChange={(e) => setNrRejestracyjny(e.target.value)}
                />

                <label>VIN</label>
                <input
                    type="text"
                    placeholder="Wprowadź nr VIN pojazdu"
                    id="vin"
                    required
                    value={nrVin}
                    onChange={(e) => setNrVin(e.target.value)}
                />

                <label>Termin następnego badania technicznego</label>
                <input
                    type="date"
                    placeholder="Wprowadź termin badania"
                    id="termin_badania"
                    required
                    value={nastepneBadanie}
                    onChange={(e) => setNastepneBadanie(e.target.value)}
                />

                <br />
                <button type="submit">Dodaj pojazd</button>
                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
            </form>
	    </div>
    );
};

export default DodajPojazd;