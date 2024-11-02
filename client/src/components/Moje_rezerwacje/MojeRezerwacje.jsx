import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import '../Moje_pojazdy/MojePojazdy.css'
import notes from '../css/img/notes.png'

const MojeRezerwacje = () => {
    return(
        <div className='div-body'>
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

export default MojeRezerwacje;