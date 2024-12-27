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
    const [marka, setMarka] = useState('')
    const [model, setModel] = useState('')
    const [rokProdukcji, setRokProdukcji] = useState('')
    const [nrRejestracyjny, setNrRejestracyjny] = useState('')
    const [nrVin, setNrVin] = useState('')
    const [nastepneBadanie, setNastepneBadanie] = useState('')

    useEffect(() => {
        if(vehicle) {
            setMarka(vehicle.marka || '')
            setModel(vehicle.model || '')
            setRokProdukcji(vehicle.rokProdukcji || '')
            setNrRejestracyjny(vehicle.nrRejestracyjny || '')
            setNrVin(vehicle.nrVin || '')
            setNastepneBadanie(vehicle.nastepneBadanie || '')
        }
    }, [vehicle])

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
    const updateVehicle = async () => {
        fetch('http://localhost:3000/vehicles/' + vehicle.id, {
            method: 'PATCH',
            body: JSON.stringify({ marka, model, rokProdukcji, nrRejestracyjny, nrVin, nastepneBadanie })
        }).then(() => {
            console.log("Zmodyfikowano wybrany pojazd")
            navigate('/moje_pojazdy')
        })
    }

    const handleSubmit= (e) => {
        e.preventDefault()
        updateVehicle()
    }

    return(
        <div>
            { error && <h2>{ error }</h2>}
            { vehicle && (
                <div>
                    <h2>Edycja danych pojazdu z id: {id}</h2>
                    <fieldset className='fieldset-edit'>
                        <legend>Informacje o pojeździe</legend>
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
                            <div className='edit-buttons-div' style={{display: 'inline', padding: '1em'}}>
                                <button type="submit" id="update">Zapisz zmiany</button>
                                <button id="delete" onClick={handleDelete}>Usuń pojazd</button>
                                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
                            </div>
                        </form>
                    </fieldset>
                </div>
            )}
	    </div>
    );
};

export default EdytujPojazd;