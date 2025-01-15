import React, { useState, useEffect } from 'react'
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
        standName: '',
    })

    const [freeTerms, setFreeTerms] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    const validStep1 = data.vehicleId && data.date
    const validStep2 = validStep1 && data.time && data.standId

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
                setFreeTerms(data.hours)
                setSelectedVehicle(data.vehicle)
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
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

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
                            <div className='step-form-div'>
                                <div className='form-group'>
                                    <label>Wybierz pojazd:</label>
                                    <select
                                        name="vehicleId"
                                        value={data.vehicleId}
                                        onChange={(e) => { setData((prevData) => ({ ...prevData, vehicleId: e.target.value })) }}
                                        required
                                    >
                                        <option value="">
                                            { vehicles.length === 0  ? "Brak dodanych pojazdów" : "Wybierz pojazd"}
                                        </option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} ({vehicle.registrationNumber})
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
                                    <button className='refresh-btn' onClick={() => setData((prevData) => ({ ...prevData, vehicleId: '', date: '', time: '', standId: '' }))}>&#x27F2;</button>
                                    { validStep1 && <button className='step-btn' onClick={ getFreeTerms }>&#129094;</button> }
                                </div>
                            </div>
                        )}
                        { step === 2 && (
                            <div className='step-form-div'>
                                <div className='form-group'>
                                    <label>Wybierz godzinę:</label>
                                    <select
                                        name="term"
                                        value={`${data.time},${data.standId},${data.standName}`}
                                        onChange={(e) => {
                                            const [time, standId, standName] = e.target.value.split(',')
                                            setData((prev) => ({ ...prev, time, standId, standName}))
                                        }}
                                        required
                                    >
                                        
                                        <option value="">
                                            { freeTerms.length === 0 ? "Brak dostępnych terminów" : "Wybierz termin" }
                                        </option>
                                        {freeTerms.length > 0 && freeTerms.map((term, index) => (
                                            <option key={index} value={`${term.time},${term.stand.id},${term.stand.name}`}>
                                                {term.time} - Stanowisko {term.stand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className='btns'>
                                    <button className='step-btn' onClick={() => setStep(1) }>&#129092;</button>
                                    <button className='refresh-btn' onClick={() => setData((prevData) => ({ ...prevData, time: '', standId: ''}))}>&#x27F2;</button>
                                    { validStep2 && <button className='step-btn' onClick={() => setStep(3) }>&#129094;</button> }
                                </div>
                            </div>
                        )}
                        { step === 3 && (
                            <div className='step-form-div'>
                                <div className={styles['confirm-data']}>
                                    <div>Pojazd:</div>
                                    <div>{selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.registrationNumber})</div>
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
                                    <div>{data.standName}</div>
                                </div>

                                <div className='btns'>
                                    <button className='step-btn' onClick={() => setStep(2) }>&#129092;</button>
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
    )
}

export default ZamowUsluge