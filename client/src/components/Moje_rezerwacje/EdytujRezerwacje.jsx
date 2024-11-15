import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const EdytujRezerwacje = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { data: service, error } = useFetch('http://localhost:3000/services/' + id)
    const [data, setData] = useState({
        userId: user.id,
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
            console.log('Edycja rezerwacji...')
        }
    }, [service])

    return(
        <div className='div-body'>
            <h2>edycja rezerwacji</h2>
	    </div>
    );
};

export default EdytujRezerwacje;