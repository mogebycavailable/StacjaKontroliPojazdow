import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojeKonto.css'
import user_icon from '../css/img/user.png';

const MojeKonto = ({ onLogout }) => {
    return(
        <div className='body-div'>
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
                        <Link to='/logowanie'><button id="logout" onClick={onLogout}>Wyloguj się</button></Link>
                        <button id="delete">Usuń konto</button>
                    </span>
                </div>
            </div>
	    </div>
    );
};

export default MojeKonto;