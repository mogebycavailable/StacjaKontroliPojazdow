import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'

const DodajPojazd = () => {
    const [data, setData] = useState({
        marka: '',
        model: '',
        rokProdukcji: '',
        nrRejestracyjny: '',
        nrVin: '',
        nastepneBadanie: ''
    })

    const navigate = useNavigate();

    const currentYear = 2024;
    const earliestYear = 1900;
    const years = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i);

    const handleSubmit = (e) => {
        e.preventDefault()
        const user = JSON.parse(localStorage.getItem('userData'))
        const vehicle = { ...data, userId: user.id }

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
                    value={data.marka}
                    onChange={(e) => setData((prevData) => ({ ...prevData, marka: e.target.value }))}
                />

                <label>Model</label>
                <input
                    type="text"
                    placeholder="Wprowadź model pojazdu"
                    id="model"
                    required
                    value={data.model}
                    onChange={(e) => setData((prevData) => ({ ...prevData, model: e.target.value }))}
                />

                <label>Rok produkcji</label>
                <select
                    id="rokProdukcji"
                    placeholder="Wprowadź rok produkcji pojazdu"
                    required 
                    value={data.rokProdukcji}
                    onChange={(e) => setData((prevData) => ({ ...prevData, rokProdukcji: e.target.value }))}>
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
                    id="nrRejestracyjny"
                    required
                    value={data.nrRejestracyjny}
                    onChange={(e) => setData((prevData) => ({ ...prevData, nrRejestracyjny: e.target.value }))}
                />

                <label>VIN</label>
                <input
                    type="text"
                    placeholder="Wprowadź nr VIN pojazdu"
                    id="nrVin"
                    required
                    value={data.nrVin}
                    onChange={(e) => setData((prevData) => ({ ...prevData, nrVin: e.target.value }))}
                />

                <label>Termin następnego badania technicznego</label>
                <input
                    type="date"
                    placeholder="Wprowadź termin badania"
                    id="nastepneBadanie"
                    required
                    value={data.nastepneBadanie}
                    onChange={(e) => setData((prevData) => ({ ...prevData, nastepneBadanie: e.target.value }))}
                />

                <br />
                <button type="submit">Dodaj pojazd</button>
                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
            </form>
	    </div>
    );
};

export default DodajPojazd;