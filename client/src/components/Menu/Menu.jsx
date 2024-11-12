import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import logo from '../css/img/mechanik-alpha.png';

const Menu = () => {
    const token = localStorage.getItem('authToken')

    return(
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
                    { token && <Link to="/moje_pojazdy" className="btn">Moje pojazdy</Link> }
                    { token && <Link to="/moje_rezerwacje" className="btn">Moje rezerwacje</Link> }
                    { token && <Link to="/zamow_usluge" className="btn">Zamów usługę</Link> }
                    { token && <Link to="/moje_konto" className="btn">Moje konto</Link> }
                    { !token && <Link to="/logowanie" className="btn">Zaloguj się</Link> }
                    { !token && <Link to="/rejestracja" className="btn">Zarejestruj się</Link> }
                </ul>
            </nav>
        </header>
    );
};

export default Menu;