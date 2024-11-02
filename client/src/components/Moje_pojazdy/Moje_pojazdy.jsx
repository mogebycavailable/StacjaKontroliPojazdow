import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './Moje_pojazdy.css'
import logo from '../css/img/mechanik-alpha.png';
import vehicle_icon from '../css/img/vehicle.png';

const Moje_pojazdy = () => {
    return(
        <div className='body-div'>
            <header>
                <div>
                    <a href="/">
                        <img src={logo}/>
                    </a>
                    <h1>Stacja Kontroli Pojazdów</h1>
                </div>
                <nav>
                    <ul>
                        <Link to="/" className="btn">Strona główna</Link>
                        <Link to="/o_nas" className="btn">O nas</Link>
                        <Link to="/moje_konto" className="btn">Moje konto</Link>
                        <Link to="/moje_pojazdy" className="btn">Moje pojazdy</Link>
                        <Link to="/moje_rezerwacje" className="btn">Moje rezerwacje</Link>
                        <Link to="/zamow_usluge" className="btn">Zamów usługę</Link>
                        <Link to="/logowanie" className="btn">Zaloguj się</Link>
                        <Link to="/rejestracja" className="btn">Zarejestruj się</Link>
                    </ul>
                </nav>
            </header>
            <h2>Moje pojazdy</h2>
            <div className='moje_pojazdy-main-div'>
                <button id="add">Dodaj</button>
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

export default Moje_pojazdy;