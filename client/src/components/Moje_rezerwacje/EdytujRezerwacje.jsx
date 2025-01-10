import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const EdytujRezerwacje = () => {
    const { id } = useParams()
    const [data, setData] = useState({
        pojazd: '',
        typPojazdu: '',
        typUslugi: '',
        rodzajPaliwa: '',
        instalacjaLpg: false,
        napedHybrydowy: false,
        terminData: '',
        terminGodzina: '',
        aktualnaData: '',
        aktualnaGodzina: ''
    })

    useEffect(() => {
        if(service) {
            setData((prevData) => ({ ...prevData, 
                pojazd: service.pojazd,
                typPojazdu: service.typPojazdu,
                typUslugi: service.typUslugi,
                rodzajPaliwa: service.rodzajPaliwa,
                instalacjaLpg: service.instalacjaLpg,
                napedHybrydowy: service.napedHybrydowy,
                terminData: service.terminData,
                terminGodzina: service.terminGodzina
             }))
        }
    }, [service])

    const handleSubmit = async () => {

    }

    return(
        <div className='div-body'>
            <h2>edycja rezerwacji</h2>
            <form onSubmit={handleSubmit}>
                <label>Pojazd:</label>
                <input type="text" name="pojazd" value={data.pojazd} onChange={(e) => setData((prevData) => ({ ...prevData, pojazd: e.target.value }))} required/>
                
                <label>Typ pojazdu:</label>
                <input type="text" name="typPojazdu" value={data.typPojazdu} onChange={(e) => setData((prevData) => ({ ...prevData, typPojazdu: e.target.value }))} required/>
                
                <label>Typ usługi:</label>
                <input type="text" name="typUslugi" value={data.typUslugi} onChange={(e) => setData((prevData) => ({ ...prevData, typUslugi: e.target.value }))} required/>

                <label>Rodzaj paliwa</label>
                <input type="text" name="rodzajPaliwa" value={data.rodzajPaliwa} onChange={(e) => setData((prevData) => ({ ...prevData, rodzajPaliwa: e.target.value }))} required/>
                
                <label>Instalacja LPG:</label>
                <input type="checkbox" name="instalacjaLpg" checked={data.instalacjaLpg} onChange={(e) => setData((prevData) => ({ ...prevData, instalacjaLpg: e.target.value }))} required/><span></span>
                
                <label>Napęd hybrydowy</label>
                
                <label>Zarezerwowany termin:</label>
                
                <label>Na godzinę:</label>
            </form>
	    </div>
    );
};

export default EdytujRezerwacje;