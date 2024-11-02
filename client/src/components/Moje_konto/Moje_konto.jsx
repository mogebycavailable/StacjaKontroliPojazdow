import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './Moje_konto.css'
import logo from '../css/img/mechanik-alpha.png';
import user_icon from '../css/img/user.png';

const Moje_konto = () => {
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
            <h2>Witaj, Piotrek i Tomasz!</h2>
            <div className='moje_konto-main-div'>
                <div>
                    <img className='user_icon-img' src={user_icon}/>
                </div>
                <div>
                    <h3>Nazwa użytkownika: Piotrek</h3>
                    <h3>E-mail: brzozikotek@abc.def</h3>
                    <h3>Numer telefonu: +48 123-456-789</h3>
                    <span>
                        <button id="password">Zmień hasło</button>
                        <button id="logout">Wyloguj się</button>
                        <button id="delete">Usuń konto</button>
                    </span>
                </div>
            </div>
	    </div>
    );
};

export default Moje_konto;