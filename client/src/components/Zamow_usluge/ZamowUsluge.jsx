import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import styles from './ZamowUsluge.module.css'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const ZamowUsluge = () => {
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState({
        vehicleId: '',
        date: '',
        time: '',
    })
    const [vehicles, setVehicles] = useState([])

    const validStep1 = data.vehicleId
    const validStep2 = data.date && data.time

    const dostepneGodziny = [
        '8:00',
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00'
    ]

    const [step, setStep] = useState(1)
    const nextStep = () => {
        setStep((nextStep) => nextStep + 1)
    }
    const previousStep = () => {
        setStep((prevStep) => prevStep - 1)
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
                setVehicles(data)
            }),
            refreshTokens,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zarezerwować ten termin?\nWyrażając zgodę zobowiązujesz się stawić w wyznaczonym terminie na badanie techniczne!')){
            const reservationData = {
                vehicleId: data.vehicleId,
                date: data.date,
                time: data.time,
            }

            const url = "http://localhost:8080/api/..."

            await apiRequest({
                url,
                useToken: true,
                method: 'POST',
                body: reservationData,
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Pomyślnie zarezerwowano termin badania technicznego.
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/zamow_usluge')
                            setIsBlocked(false)
                        },
                        autoClose: 3000,
                    })
                }),
                onError: ((status, data) => {
                    toast.error(data, {
                        autoClose: 3000,
                    })
                }),
                refreshTokens,
            })
        } else {
            console.log("Brak zgody użytkownika na rezerwacje terminu.")
        }
    }

    return(
        <div>
            <h2>Zamawianie usługi</h2>
            <main>
                { step === 1 && (
                    <div className={styles['progress-bar']}>
                        <div className={styles.first} style={{backgroundColor: "#ffa500"}}></div>
                        <div className={styles.second} style={{backgroundColor: "#000000"}}></div>
                        <div className={styles.third} style={{backgroundColor: "#000000"}}></div>
                    </div>
                )}
                { step === 2 && (
                    <div className={styles['progress-bar']}>
                        <div className={styles.first} style={{backgroundColor: "#ffa500"}}></div>
                        <div className={styles.second} style={{backgroundColor: "#ffa500"}}></div>
                        <div className={styles.third} style={{backgroundColor: "#000000"}}></div>
                    </div>
                )}
                { step === 3 && (
                    <div className={styles['progress-bar']}>
                        <div className={styles.first} style={{backgroundColor: "#ffa500"}}></div>
                        <div className={styles.second} style={{backgroundColor: "#ffa500"}}></div>
                        <div className={styles.third} style={{backgroundColor: "#ffa500"}}></div>
                    </div>
                )}

                <h3 className={styles.step}>krok {step}/3</h3>
                
                <form onSubmit={handleSubmit}>
                    { step === 1 && (
                        <div>
                            <fieldset>
                                <legend>Pojazd</legend>
                                <div className={styles['set-data-in-fieldset']}>
                                    <label>Wybierz pojazd:</label>

                                    <select
                                        name="pojazd"
                                        value={data.vehicleId}
                                        onChange={(e) => setData((prevData) => ({ ...prevData, vehicleId: e.target.value }))}
                                        required
                                    >
                                        <option value=""></option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model}
                                            </option>
                                        ))}
                                    </select>
                                </div>                             
                            </fieldset>
                            <button type="button" onClick={() => setData((prevData) => ({ ...prevData, vehicleId: '' }))}>&#x27F2;</button>
                            { validStep1 && <button type="button" onClick={nextStep}>&#8680;</button> }
                        </div>
                    )}
                    { step === 2 && (
                        <div>
                            <fieldset>
                                <legend>Termin</legend>
                                <div className={styles['set-data-in-fieldset']}>
                                    <label>Wybierz datę:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={data.date}
                                        onChange={(e) => setData((prevData) => ({ ...prevData, date: e.target.value }))}
                                        required
                                    />

                                    <label>Wybierz godzinę:</label>
                                    <select
                                        name="time"
                                        value={data.time}
                                        onChange={(e) => setData((prevData) => ({ ...prevData, time: e.target.value }))}
                                        required>

                                        <option value=""></option>
                                        {dostepneGodziny.map((hour) => (
                                            <option key={hour} value={hour}>
                                                {hour}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </fieldset>

                            <button type="button" onClick={previousStep}>&#8678;</button>
                            <button type="button" onClick={() => setData((prevData) => ({ ...prevData, date: '', time: ''}))}>&#x27F2;</button>
                            { validStep2 && <button type="button" onClick={nextStep}>&#8680;</button> }
                        </div>
                    )}
                    { step === 3 && (
                        <div>
                            <fieldset>
                                <legend>Potwierdź rezerwację</legend>
                                <div className={styles['set-data-in-fieldset']}>
                                    <h4>Pojazd: {data.marka} {data.model}</h4>
                                    <h4>Data: {data.date}</h4>
                                    <h4>Godzina: {data.time}</h4>
                                </div>
                            </fieldset>

                            <button type="button" onClick={previousStep}>&#8678;</button>
                            <button type="submit">&#x2714;</button>
                        </div>
                    )}
                </form>
            </main>
	    </div>
    );
};

export default ZamowUsluge;