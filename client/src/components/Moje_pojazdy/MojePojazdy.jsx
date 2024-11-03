import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';

const MojePojazdy = () => {
    const vehicleArray = [
        {id: 1, marka: 'Mitsubishi', model: 'Carisma', rokProdukcji: 2003, nrRejestracyjny: 'ABC 12345', nrVin: 'JHMFA16546S014841', nastepneBadanie: '2025-01-10'},
        {id: 2, marka: 'Citroen', model: 'Xsara', rokProdukcji: 2003, nrRejestracyjny: 'DEF 67890', nrVin: '1HGCM82633A004352', nastepneBadanie: '2024-06-02'},
        {id: 3, marka: 'Toyota', model: 'Corolla', rokProdukcji: 2005, nrRejestracyjny: 'GHI 11223', nrVin: 'FA36BVFSD33FSDDF4', nastepneBadanie: '2025-10-07'},
    ]

    const today = new Date().toISOString().split('T')[0]

    return(
        <div className='body-div'>
            <h2>Moje pojazdy</h2>
            <div className='moje_pojazdy-main-div'>
                <Link to="/moje_pojazdy/dodaj_pojazd">
                    <button id="add">Dodaj</button>
                </Link>
                {vehicleArray.map((vehicle) => {
                    const dateStyle = { color: vehicle.nastepneBadanie < today ? 'red' : 'green' };
                    const isExpired = vehicle.nastepneBadanie < today;
                    const statusText = isExpired ? "(NIEWAŻNE)" : "(WAŻNE)";
                    return (
                    <div className="vehicle">
                        <div className="photo">
                            <img src={vehicle_icon}/>
                        </div>
                        <div key={vehicle.id} className="data">
                            <h4>Marka: {vehicle.marka}</h4>
                            <h4>Model: {vehicle.model}</h4>
                            <h4>Rok produkcji: {vehicle.rokProdukcji}</h4>
                            <h4>Nr rejestracyjny: {vehicle.nrRejestracyjny}</h4>
                            <h4>Nr VIN: {vehicle.nrVin}</h4>
                            <h4>Badania techniczne:   <span style={dateStyle}>{vehicle.nastepneBadanie} {statusText}</span></h4>
                            <Link to={`/moje_pojazdy/edytuj_pojazd/${vehicle.id}`}>
                                <button id="edit">Edytuj dane</button>
                            </Link>
                            <button id="delete">Usuń pojazd</button>
                            <button id="order">Umów się na przegląd</button>
                        </div>
                    </div>
                );})}
            </div>
	    </div>
    );
};

export default MojePojazdy;