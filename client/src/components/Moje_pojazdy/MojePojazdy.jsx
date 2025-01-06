import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import vehicle_icon from '../css/img/vehicle.png';
import useRefresh from '../../service/useRefresh'

const MojePojazdy = () => {
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
        const getAllVehiclesData = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/vehicles"
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    setData(resData)
                } else {
                    console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
                }

                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
            }
        }

        getAllVehiclesData()
    }, [])

    return(
        <div className='body-div'>
            <h2>Moje pojazdy</h2>
            <div className='moje_pojazdy-main-div'>
                <Link to="/moje_pojazdy/dodaj_pojazd">
                    <button id="add">Dodaj</button>
                </Link>
                {data && data.map((vehicle) => {
                    const dateStyle = { color: vehicle.validityPeriod < today ? 'red' : 'green' };
                    const isExpired = vehicle.validityPeriod < today;
                    const statusText = isExpired ? "(NIEWAŻNE)" : "(WAŻNE)";
                    return (
                    <div key={vehicle.id} className="vehicle">
                        <div className="photo">
                            <img src={vehicle_icon}/>
                        </div>
                        <div className="data">
                            <h4>Marka: {vehicle.brand}</h4>
                            <h4>Model: {vehicle.model}</h4>
                            <h4>Rok produkcji: {vehicle.year}</h4>
                            <h4>Nr rejestracyjny: {vehicle.registrationNumber}</h4>
                            <h4>Nr VIN: {vehicle.vehicleIdentificationNumber}</h4>
                            <h4>Typ pojazdu: {vehicleTypeTranslations[vehicle.vehicleType] || "Nieznany typ"}</h4>
                            <h4>Czy posiada instalację LPG: {vehicle.hasLpg ? "TAK" : "NIE"}</h4>
                            <h4>Termin ważności badania:   <span style={dateStyle}>{vehicle.validityPeriod} {statusText}</span></h4>
                            <Link to={`/moje_pojazdy/edytuj_pojazd/${vehicle.id}`}>
                                <button id="edit">Edytuj dane</button>
                            </Link>
                            <Link to={`/zamow_usluge`}>
                                <button id="order">Umów się na przegląd</button>
                            </Link>
                        </div>
                    </div>
                );})}
                {data == [] && (
                    <h2>
                        Nie masz jeszcze dodanych pojazdów
                    </h2>
                )}
            </div>
	    </div>
    );
};

export default MojePojazdy;