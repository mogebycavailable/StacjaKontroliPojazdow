import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import styles from './PanelAdministratora.module.css'

const PanelAdministratora = () => {
    const [isBlocked, setIsBlocked] = useState(false)

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Panel administratora</h2>

            <div className={styles['panel-admin-div']}>
                <div className={styles['admin-options']}>
                    <Link to='/panel_administratora/stanowiska' className={styles.option}>Zarządzaj stanowiskami &gt;</Link>
                    <Link to='/panel_administratora/tydzien_pracy' className={styles.option}>Zarządzaj tygodniem pracy &gt;</Link>
                    <Link to='/panel_administratora/kalendarz' className={styles.option}>Zarządzaj kalendarzem &gt;</Link>
                    <Link to='/panel_administratora/pracownicy' className={styles.option}>Zarządzaj pracownikami &gt;</Link>
                    <Link to='/panel_administratora/klienci' className={styles.option}>Zarządzaj klientami &gt;</Link>
                    <Link to='/panel_administratora/rezerwacje' className={styles.option}>Zarządzaj rezerwacjami &gt;</Link>
                </div>
            </div>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    )
}

export default PanelAdministratora