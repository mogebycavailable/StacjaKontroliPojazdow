import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';

const EdytujPojazd = () => {
    const vehicleArray = [
        {id: 1, marka: 'Mitsubishi', model: 'Carisma', rokProdukcji: 2003, nrRejestracyjny: 'ABC 12345', nrVin: 'JHMFA16546S014841', nastepneBadanie: '2025-01-10'},
        {id: 2, marka: 'Citroen', model: 'Xsara', rokProdukcji: 2003, nrRejestracyjny: 'DEF 67890', nrVin: '1HGCM82633A004352', nastepneBadanie: '2024-06-02'},
        {id: 3, marka: 'Toyota', model: 'Corolla', rokProdukcji: 2005, nrRejestracyjny: 'GHI 11223', nrVin: 'FA36BVFSD33FSDDF4', nastepneBadanie: '2025-10-07'},
    ]

    return(
        <div>
            
	    </div>
    );
};

export default EdytujPojazd;