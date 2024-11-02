import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './StronaGlowna.css'
import foto1 from '../css/img/foto1.jpg';
import foto2 from '../css/img/foto2.jpg';

const StronaGlowna = () => {
    return(
        <div className='div-body'>
            <h2>Strona główna</h2>
            <main>
                <article>
                    <p>
                        Po co czekać na wolny termin badania technicznego i tracić cenny czas?
                        Kiedy będzie możliwy najbliższy termin na ustawianie zbieżności kół?
                        Na naszej stronie internetowej znajdziesz odpowiedź na te pytania i nie tylko.
                        
                        U nas wykonasz badanie techniczne pojazdu.
                        Umów się już teraz na wizytę przez <Link to="/zamow_usluge" className="btn">formularz</Link>!
                    </p>
                    <span>Motoryzacja to możliwość przemieszczania się. Dla nas to przede wszystkim pasja!</span>
                    <div className="flex-tiles">
                        <div className="tile">Stan opon a bezpieczeństwo na drodze &gt;</div>
                        <div className="tile">Zagrożenia związane z użytkowaniem instalacji LPG w złym stanie technicznym &gt;</div>
                        <div className="tile">Zmiany przepisów o ruchu drogowym &gt;</div>
                        <div className="tile">Korekcja zbieżności - na czym polega i co można zyskać? &gt;</div>
                    </div>
                </article>
                <div className='photos'>
                    <img src={foto1}/>
                    <img src={foto2}/>
                </div>
		    </main>
        </div>
    );
};

export default StronaGlowna;