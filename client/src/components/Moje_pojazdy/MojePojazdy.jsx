import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import styles from './MojePojazdy.module.css'
import vehicle_icon from '../css/img/vehicle.png';
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const MojePojazdy = () => {
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0]

    const [data, setData] = useState([])
    const refreshTokens = useRefresh()

    const vehicleTypeTranslations = {
        CAR: "Samochód osobowy",
        TRUCK: "Samochód ciężarowy",
        MOTORCYCLE: "Motocykl",
        VINTAGE: "Samochód zabytkowy",
        SLOW_MOVING: "Pojazd wolnobieżny",
      }

    useEffect(() => {
        getAllVehicles()
    }, [])

    // GET
    const getAllVehicles = async () => {
        const url = "http://localhost:8080/api/vehicles"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setData(data)
            }),
            refreshTokens,
        })
    }

    return(
        // <div className='body-div'>
        <div>
            <h2>Moje pojazdy</h2>
            {/* <div className='moje_pojazdy-main-div'> */}
            <main>
                <Link className='link-react-router' to="/moje_pojazdy/dodaj_pojazd">
                    {/* <button id="add">Dodaj</button> */}
                    <div className='plus-add-btn'>&#x2b;</div>
                </Link>
                {data && data.map((vehicle) => {
                    const dateStyle = { color: vehicle.validityPeriod < today ? 'red' : 'green' };
                    const isExpired = vehicle.validityPeriod < today;
                    const statusText = isExpired ? "(NIEWAŻNE)" : "(WAŻNE)";
                    return (
                    <div key={vehicle.id} className={styles.vehicle}>
                        <div className={styles.photo}>
                            <img className={styles['vehicle-img']} src={vehicle_icon}/>
                        </div>
                        <div className={styles['vehicle-container']}>
                            <div className={styles['vehicle-data']}>
                                <div>Marka:</div><div>{vehicle.brand}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Model:</div><div>{vehicle.model}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Rok produkcji:</div><div>{vehicle.year}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Nr rejestracyjny:</div><div>{vehicle.registrationNumber}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Nr VIN:</div><div>{vehicle.vehicleIdentificationNumber}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Typ pojazdu:</div><div>{vehicleTypeTranslations[vehicle.vehicleType] || "Nieznany typ"}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Czy posiada instalację LPG:</div><div>{vehicle.hasLpg ? "TAK" : "NIE"}</div>
                            </div>

                            <div className={styles['vehicle-data']}>
                                <div>Termin ważności badania:</div><div><span style={dateStyle}>{vehicle.validityPeriod} {statusText}</span></div>
                            </div>

                            <div className='btns' style={{margin: '3% auto'}}>
                                <button className='edit-btn' onClick={() => navigate(`/moje_pojazdy/edytuj_pojazd/${vehicle.id}`)}>&#9881;</button>
                                <button id="order" onClick={() => navigate('/zamow_usluge')}>Umów się na przegląd</button>
                            </div>
                        </div>
                    </div>
                );})}
                {data.length == 0 && (
                    <h2>
                        Nie masz jeszcze dodanych pojazdów
                    </h2>
                )}
            {/* </div> */}
            </main>
	    </div>
    );
};

export default MojePojazdy;