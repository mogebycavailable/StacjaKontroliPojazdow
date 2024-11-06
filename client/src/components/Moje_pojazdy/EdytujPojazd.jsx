import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import useFetch from '../../service/useFetch';

const EdytujPojazd = () => {
    const currentYear = 2024;
    const earliestYear = 1900;
    const years = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i);

    const { id } = useParams()
    const navigate = useNavigate()
    const { data: vehicle, error } = useFetch('http://localhost:3000/vehicles/' + id)

    // DELETE
    const handleDelete=() => {
        fetch('http://localhost:3000/vehicles/' + vehicle.id, {
            method: 'DELETE'
        }).then(() => {
            console.log("Usunięto wybrany pojazd")
            navigate('/moje_pojazdy')
        })
    }

    // UPDATE
    const handleUpdate=() => {
        fetch('http://localhost:3000/vehicles/' + vehicle.id, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicle)
        }).then(() => {
            console.log("Zmodyfikowano wybrany pojazd")
            navigate('/moje_pojazdy')
        })
    }

    return(
        <div>
            { error && <h2>{ error }</h2>}
            { vehicle && (
                <div>
                    <h2>Edycja danych pojazdu z id: {id}</h2>
                    <fieldset className='fieldset-edit'>
                        <legend>Informacje o pojeździe</legend>
                        <form onSubmit={handleUpdate}>
                            <label>Marka</label>
                            <input
                                type="text"
                                placeholder="Wprowadź markę pojazdu"
                                id="marka"
                                required
                                value={vehicle.marka}
                                onChange={(e) => setMarka(e.target.value)}
                            />

                            <label>Model</label>
                            <input
                                type="text"
                                placeholder="Wprowadź model pojazdu"
                                id="model"
                                required
                                value={vehicle.model}
                                onChange={(e) => setModel(e.target.value)}
                            />

                            <label>Rok produkcji</label>
                            <select
                                id="rok_prod"
                                name="rok_prod"
                                placeholder="Wprowadź rok produkcji pojazdu"
                                required value={vehicle.rokProdukcji}
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
                                value={vehicle.nrRejestracyjny}
                                onChange={(e) => setNrRejestracyjny(e.target.value)}
                            />

                            <label>VIN</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nr VIN pojazdu"
                                id="vin"
                                required
                                value={vehicle.nrVin}
                                onChange={(e) => setNrVin(e.target.value)}
                            />

                            <label>Termin następnego badania technicznego</label>
                            <input
                                type="date"
                                placeholder="Wprowadź termin badania"
                                id="termin_badania"
                                required
                                value={vehicle.nastepneBadanie}
                                onChange={(e) => setNastepneBadanie(e.target.value)}
                            />

                            <br />
                            <div className='edit-buttons-div' style={{display: 'inline', padding: '1em'}}>
                                <button id="update" onClick={handleUpdate}>Zapisz zmiany</button>
                                <button id="delete" onClick={handleDelete}>Usuń pojazd</button>
                            </div>
                        </form>
                    </fieldset>
                </div>
            )}
	    </div>
    );
};

export default EdytujPojazd;