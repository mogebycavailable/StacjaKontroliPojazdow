import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';
import useFetch from '../../service/useFetch';

const MojePojazdy = () => {
    const { data: vehicles, error } = useFetch('http://localhost:3000/vehicles')
    const today = new Date().toISOString().split('T')[0]

    return(
        <div className='body-div'>
            { error && <h2>{ error }</h2>}
            <h2>Moje pojazdy</h2>
            <div className='moje_pojazdy-main-div'>
                <Link to="/moje_pojazdy/dodaj_pojazd">
                    <button id="add">Dodaj</button>
                </Link>
                {vehicles && vehicles.map((vehicle) => {
                    const dateStyle = { color: vehicle.nastepneBadanie < today ? 'red' : 'green' };
                    const isExpired = vehicle.nastepneBadanie < today;
                    const statusText = isExpired ? "(NIEWAŻNE)" : "(WAŻNE)";
                    return (
                    <div key={vehicle.id} className="vehicle">
                        <div className="photo">
                            <img src={vehicle_icon}/>
                        </div>
                        <div className="data">
                            <h4>Marka: {vehicle.marka}</h4>
                            <h4>Model: {vehicle.model}</h4>
                            <h4>Rok produkcji: {vehicle.rokProdukcji}</h4>
                            <h4>Nr rejestracyjny: {vehicle.nrRejestracyjny}</h4>
                            <h4>Nr VIN: {vehicle.nrVin}</h4>
                            <h4>Badania techniczne:   <span style={dateStyle}>{vehicle.nastepneBadanie} {statusText}</span></h4>
                            <Link to={`/moje_pojazdy/edytuj_pojazd/${vehicle.id}`}>
                                <button id="edit">Edytuj dane</button>
                            </Link>
                            <button id="order">Umów się na przegląd</button>
                        </div>
                    </div>
                );})}
            </div>
	    </div>
    );
};

export default MojePojazdy;