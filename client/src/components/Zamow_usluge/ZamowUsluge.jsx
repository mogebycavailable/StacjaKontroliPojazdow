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
    const [step, setStep] = useState(1)

    const [data, setData] = useState({
        vehicleId: '',
        date: '',
        time: '',
        standId: '',
    })

    const [freeTerms, setFreeTerms] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState({})
    const [selectedStand, setSelectedStand] = useState({})

    const validStep1 = data.vehicleId && data.date
    const validStep2 = validStep1 && data.time && data.standId

    useEffect(() => {
        getAllVehicles()
    }, [])

    const getReservationDetails = async () => {
        await getVehicleDetails()
        await getStandDetails()
        setStep(3)
    }

    // GET
    const getAllVehicles = async () => {
        const url = "http://localhost:8080/api/vehicles"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setVehicles(data)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    const getFreeTerms = async () => {
        const url = `http://localhost:8080/api/user/inspections/${data.vehicleId}/${data.date}`
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setFreeTerms(data)
                setStep(2)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    const getVehicleDetails = async () => {
        const url = `http://localhost:8080/api/vehicles/${data.vehicleId}`
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setSelectedVehicle(data)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    const getStandDetails = async () => {
        const url = `http://localhost:8080/api/user/stand/${data.standId}`
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setSelectedStand(data)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    // POST
    const handleSubmit = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zarezerwować ten termin?\nWyrażając zgodę zobowiązujesz się stawić w wyznaczonym terminie na badanie techniczne!')){
            const reservationData = {
                vehicleId: data.vehicleId,
                date: data.date,
                time: data.time,
                standId: data.standId,
            }

            const url = "http://localhost:8080/api/user/inspections"

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
                            window.location.assign('/moje_rezerwacje')
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
                
                <fieldset className='fieldset-form'>
                    <legend>Zarezerwuj termin</legend>
                        { step === 1 && (
                            <div className={styles['step-form-div']}>
                                <div className='form-group'>
                                    <label>Wybierz pojazd:</label>
                                    <select
                                        name="vehicleId"
                                        value={data.vehicleId}
                                        onChange={(e) => { setData((prevData) => ({ ...prevData, vehicleId: e.target.value })) }}
                                        required
                                    >
                                        <option value=""></option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} - {vehicle.registrationNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='form-group'>
                                    <label>Wybierz datę:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={data.date}
                                        onChange={(e) => setData((prevData) => ({ ...prevData, date: e.target.value }))}
                                        required
                                    /> 
                                </div>

                                <div className='btns'>
                                    <button className={styles['refresh-btn']} onClick={() => setData((prevData) => ({ ...prevData, vehicleId: '', date: '', time: '', standId: '' }))}>&#x27F2;</button>
                                    { validStep1 && <button className={styles['step-btn']} onClick={ getFreeTerms }>&#129094;</button> }
                                </div>
                            </div>
                        )}
                        { step === 2 && (
                            <div className={styles['step-form-div']}>
                                <div className='form-group'>
                                    <label>Wybierz godzinę:</label>
                                    <select
                                        name="term"
                                        value={`${data.time},${data.standId}`}
                                        onChange={(e) => {
                                            const [time, standId] = e.target.value.split(',')
                                            setData((prev) => ({ ...prev, time, standId}))
                                        }}
                                        required
                                    >
                                        
                                        <option value="">{ freeTerms.length === 0 && (<p>Brak dostępnych terminów</p>) }</option>
                                        {freeTerms.length > 0 && freeTerms.map((term, index) => (
                                            <option key={index} value={[`${term.time}`,`${term.standId}`]}>
                                                {term.time} - Stanowisko {term.standId}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='btns'>
                                    <button className={styles['step-btn']} onClick={() => setStep(1) }>&#129092;</button>
                                    <button className={styles['refresh-btn']} onClick={() => setData((prevData) => ({ ...prevData, time: '', standId: ''}))}>&#x27F2;</button>
                                    { validStep2 && <button className={styles['step-btn']} onClick={ getReservationDetails }>&#129094;</button> }
                                </div>
                            </div>
                        )}
                        { step === 3 && (
                            <div className={styles['step-form-div']}>
                                <div className={styles['confirm-data']}>
                                    <div>Pojazd:</div>
                                    <div>{selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.registrationNumber}</div>
                                </div>

                                <div className={styles['confirm-data']}>
                                    <div>Data:</div>
                                    <div>{data.date}</div>
                                    </div>

                                <div className={styles['confirm-data']}>
                                    <div>Godzina:</div>
                                    <div>{data.time}</div>
                                </div>

                                <div className={styles['confirm-data']}>
                                    <div>Stanowisko:</div>
                                    <div>{selectedStand.name}</div>
                                </div>

                                <div className='btns'>
                                    <button className={styles['step-btn']} onClick={() => setStep(2) }>&#129092;</button>
                                    <button className='ok-btn' type="submit" onClick={handleSubmit}>&#x2714;</button>
                                </div>
                            </div>
                        )}
                </fieldset>
            </main>
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default ZamowUsluge;