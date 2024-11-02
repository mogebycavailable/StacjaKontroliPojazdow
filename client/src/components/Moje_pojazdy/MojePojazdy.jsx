import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';

const MojePojazdy = () => {
    return(
        <div className='body-div'>
            <h2>Moje pojazdy</h2>
            <div className='moje_pojazdy-main-div'>
                <button id="add"><Link to="/moje_pojazdy/dodaj_pojazd" className="btn">Dodaj</Link></button>
                <div className="vehicle">
                    <div className="photo">
                        <img src={vehicle_icon}/>
                    </div>
                    <div className="data">
                        <h4>Marka: Mitsubishi</h4>
                        <h4>Model: Carisma</h4>
                        <h4>Rok produkcji: 2003</h4>
                        <h4>Numer rejestracyjny: ABC 12345</h4>
                        <h4>VIN: JHMFA16546S014841</h4>
                        <h4>Badanie techniczne: <span className="wazne">ważne do 10.01.2025</span></h4>
                        <button id="edit">Edytuj dane</button>
                        <button id="delete">Usuń pojazd</button>
                        <button id="order">Umów się na przegląd</button>
                    </div>
                </div>			
                <div className="vehicle">
                    <div className="photo">
                        <img src={vehicle_icon}/>
                    </div>
                    <div className="data">
                        <h4>Marka: Citroen</h4>
                        <h4>Model: Xsara</h4>
                        <h4>Rok produkcji: 2003</h4>
                        <h4>Numer rejestracyjny: DEF 67890</h4>
                        <h4>VIN: 1HGCM82633A004352</h4>
                        <h4>Badanie techniczne: <span className="niewazne">nie ważne od 02.06.2024</span></h4>
                        <button id="edit">Edytuj dane</button>
                        <button id="delete">Usuń pojazd</button>
                        <button id="order">Umów się na przegląd</button>
                    </div>
                </div>
            </div>
	    </div>
    );
};

export default MojePojazdy;