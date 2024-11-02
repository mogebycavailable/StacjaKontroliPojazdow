import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import '../Moje_pojazdy/Moje_pojazdy.css'
import logo from '../css/img/mechanik-alpha.png';
import notes from '../css/img/notes.png'

const Moje_rezerwacje = () => {
    return(
        <div className='div-body'>
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
            <h2>moje rezerwacje</h2>
            <div className='moje_rezerwacje-main-div'>
                <button id="add">Umów się na przegląd</button>
                <div className="rezerwacja">
                    <div className="photo">
                        <img src={notes}/>
                    </div>
                    <div className="data">
                        <h4>Pojazd: Citroen Xsara</h4>
                        <h4>Nr rej.: DEF 67890</h4>
                        <h4>Przegląd ma się odbyć: 7 czerwca 2024, godzina 12:00</h4>
                        <h4>Umówiłeś go: 2 czerwca 2024, godzina 7:12</h4>
                        <button id="edit">Przełóż przegląd</button>
                        <button id="delete">Usuń rezerwację</button>
                    </div>
                </div>
            </div>
	    </div>
    );
};

export default Moje_rezerwacje;