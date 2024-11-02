import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';

const DodajPojazd = () => {
    const currentYear = 2024;
    const earliestYear = 1900;

    const years = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i);

    return(
        <div>
            <h2>+ Dodawanie pojazdu +</h2>
            <form action="#" method="get">
                <label>Marka</label><input type="text" placeholder="Wprowadź markę pojazdu" id="marka"/>
                <label>Model</label><input type="text" placeholder="Wprowadź model pojazdu" id="model"/>
                <label>Rok produkcji</label>
                <select id="rok_prod" name="rok_prod" defaultValue="" placeholder="Wprowadź rok produkcji pojazdu">
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>              

                <label>Numer rejestracyjny</label><input type="text" placeholder="Wprowadź nr rejestracyjny pojazdu" id="nr_rej"/>
                <label>VIN</label><input type="text" placeholder="Wprowadź nr VIN pojazdu" id="vin"/>
                <label>Termin następnego badania technicznego</label><input type="date" placeholder="Wprowadź termin badania" id="termin_badania"/>

                <br />
                <button type="submit">Dodaj pojazd</button>
            </form>
	    </div>
    );
};

export default DodajPojazd;