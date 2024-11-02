import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Logowanie = () => {
    return(
        <div className='div-body'>
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