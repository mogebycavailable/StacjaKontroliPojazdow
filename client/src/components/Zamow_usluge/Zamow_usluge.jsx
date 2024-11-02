import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './Zamow_usluge.css'
import logo from '../css/img/mechanik-alpha.png';

const Zamow_usluge = () => {
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
            <h2>zamawianie usługi</h2>
            <main>
                <div className="progress-bar">
                    <div id="first">
                        
                    </div>
                    <div id="second">
                        
                    </div>
                    <div id="third">
                        
                    </div>
                </div>
                <h3 className='zamow_usluge-h3'>krok 1/3</h3>
                <form action="zamow-usluge-step-2.html" method="POST">
                    <fieldset>
                        <legend>Informacje na temat usługi</legend>
                    
                        <label htmlFor="cars">Wybierz Twój pojazd:</label>
                        <br/>
                        <select name="cars" id="cars">
                            <option value="1">Mitsubishi Carisma</option>
                            <option value="2">Citroen Xsara</option>
                        </select>
                        <br/>
                        
                        <label htmlFor="type">Wybierz typ pojazdu:</label>
                        <br/>
                        <select name="type" id="type">
                            <option value="1" selected>Samochód osobowy</option>
                            <option value="2">Samochód ciężarowy</option>
                            <option value="3">TIR</option>
                            <option value="4">Ciągnik</option>
                            <option value="4">Autobus</option>
                            <option value="5">Inny</option>
                        </select>
                        <br/>
                        
                        <label htmlFor="services">Wybierz typ usługi:</label>
                        <br/>
                        <select name="services" id="services">
                            <option value="1">Badanie techniczne</option>
                            <option value="2">Ustawianie zbieżności</option>
                        </select>
                        <br/>
                        
                    </fieldset>
                    <fieldset>
                        <legend>Informacje na temat rodzaju paliwa</legend>
                        
                        <input type="radio" name="fuel" id="petrol" checked/>
                        <label htmlFor="petrol">Benzyna</label>
                        <br/>
                        
                        <input type="radio" name="fuel" id="diesel"/>
                        <label htmlFor="diesel">Diesel</label>
                        <br/>
                        
                        <input type="radio" name="fuel" id="ev"/>
                        <label htmlFor="ev">Pojazd elektryczny</label>
                        <br/>
                    
                        <input type="checkbox" id="lpg" name="lpg"/>
                        <label htmlFor="lpg">Czy pojazd posiada instalację LPG?</label>
                        <br/>
                        
                        <input type="checkbox" id="hybrid" name="hybrid"/>
                        <label htmlFor="hybrid">Czy pojazd jest Hybrydowy?</label>
                        <br/>
                    </fieldset>
                    <input type="submit" value="Dalej >"/>
                </form>
            </main>
	    </div>
    );
};

export default Zamow_usluge;