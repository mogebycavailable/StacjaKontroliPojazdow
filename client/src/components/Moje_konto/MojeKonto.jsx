import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojeKonto.css'
import user_icon from '../css/img/user.png';

const MojeKonto = ({ onLogout }) => {
    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

    return(
        <div className='body-div'>
            <h2>Witaj {loggedInUser.imie}</h2>
            <div className='moje_konto-main-div'>
                <div>
                    <img className='user_icon-img' src={user_icon}/>
                </div>
                <div>
                    <h3>Imię i nazwisko: {loggedInUser.imie} {loggedInUser.nazwisko}</h3>
                    <h3>E-mail: {loggedInUser.email}</h3>
                    <h3>Numer telefonu: +48 {loggedInUser.nrTel}</h3>
                    <span>
                        <button id="password">Zmień hasło</button>
                        <Link to='/'><button id="logout" onClick={onLogout}>Wyloguj się</button></Link>
                        <button id="delete">Usuń konto</button>
                    </span>
                </div>
            </div>
	    </div>
    );
};

export default MojeKonto;