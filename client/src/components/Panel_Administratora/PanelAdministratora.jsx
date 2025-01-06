import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import './PanelAdministratora.css'
import useRefresh from '../../service/useRefresh'

const PanelAdministratora = () => {
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Panel administratora</h2>

            <div className='panel-admin-div'>
                <div className='admin-options'>
                    <Link to='/panel_administratora/stanowiska' className='option'>Zarządzaj stanowiskami &gt;</Link>
                    <Link to='/panel_administratora/tydzien_pracy' className='option'>Zarządzaj tygodniem pracy &gt;</Link>
                    <Link to='/panel_administratora/kalendarz' className='option'>Zarządzaj kalendarzem &gt;</Link>
                    <Link to='/panel_administratora/pracownicy' className='option'>Zarządzaj pracownikami &gt;</Link>
                    <Link to='/panel_administratora/klienci' className='option'>Zarządzaj klientami &gt;</Link>
                    <Link to='/panel_administratora/rezerwacje' className='option'>Zarządzaj rezerwacjami &gt;</Link>
                </div>
            </div>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default PanelAdministratora;