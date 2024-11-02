import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'
import logo from '../css/img/mechanik-alpha.png';

const Logowanie = () => {
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
            <h2>Logowanie do serwisu</h2>
            <form action="#" method="get">
                <div className='form'>
                    <label htmlFor="email">E-mail</label>
                        <input type="text" placeholder="Wprowadź e-mail" id="email"/>		

                    <label htmlFor="pass">Hasło</label>
                    <input type="password" placeholder="Wprowadź hasło" id="pass"/>
                    
                    <br/>
                    <a href="https://pl.wikipedia.org/wiki/Has%C5%82o" target="_blank">Zapomniałem hasła</a>

                    <input type="submit" value="Zaloguj się"/>
                </div>
            </form>
	    </div>
    );
};

export default Logowanie;