import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../css/Style.css'
import styles from './MojePojazdy.module.css'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const DodajPojazd = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState({
        brand: 'Fiat',
        model: 'Uno',
        year: '1998',
        registrationNumber: 'LSW 51X2K',
        vehicleIdentificationNumber: '1N6AD0EV1CC444260',
        vehicleType: '',
        hasLpg: false,
        validityPeriod: '2025-01-25'
    })

    const vehicleTypes = [
        {key: 'CAR', label: 'Samochód osobowy'},
        {key: 'TRUCK', label: 'Samochód ciężarowy'},
        {key: 'MOTORCYCLE', label: 'Motocykl'},
        {key: 'VINTAGE', label: 'Samochód zabytkowy'},
        {key: 'SLOW_MOVING', label: 'Pojazd wolnobieżny'},
    ]

    const currentYear = 2024
    const earliestYear = 1900
    const rangeOfYears = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i)

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const vehicle = {
            brand: data.brand,
            model: data.model,
            year: data.year,
            registrationNumber: data.registrationNumber,
            vehicleIdentificationNumber: data.vehicleIdentificationNumber,
            vehicleType: data.vehicleType,
            hasLpg: data.hasLpg,
            validityPeriod: data.validityPeriod
        }

        const url = "http://localhost:8080/api/vehicles"

        await apiRequest({
            url,
            useToken: true,
            method: 'POST',
            body: vehicle,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Dodano nowy pojazd:<br/>
                        {data.brand} {data.model}, {data.year} r.
                    </div>, 
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/moje_pojazdy')
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
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>+ Dodawanie pojazdu +</h2>
            <main>
                <fieldset className='fieldset-form'>
                    <legend>Informacje o pojeździe</legend>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label>Marka:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź markę pojazdu"
                                name="brand"
                                required
                                value={data.brand}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label>Model:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź model pojazdu"
                                name="model"
                                required
                                value={data.model}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label>Rok produkcji:</label>
                            <select
                                name="year"
                                placeholder="Wprowadź rok produkcji pojazdu"
                                required 
                                value={data.year}
                                onChange={handleChange}>
                                    
                                <option value=""></option>
                                {rangeOfYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group'>
                            <label>Nr rej:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nr rejestracyjny pojazdu"
                                name="registrationNumber"
                                required
                                value={data.registrationNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label>VIN:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nr VIN pojazdu"
                                name="vehicleIdentificationNumber"
                                required
                                value={data.vehicleIdentificationNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label>Typ pojazdu:</label>
                            <select
                                type="text"
                                placeholder="Wybierz typ pojazdu"
                                name="vehicleType"
                                required
                                value={data.vehicleType}
                                onChange={handleChange}
                            >
                                
                                <option value="" disabled>
                                    Wybierz
                                </option>
                                {vehicleTypes.map((type) => (
                                    <option key={type.key} value={type.key}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className='form-group'>
                            <label>Instalacja LPG:</label>
                            <Switch
                                name="hasLpg"
                                checked={data.hasLpg}
                                onChange={(checked) => {setData((prevState) => ({...prevState,hasLpg: checked}))}}
                            />
                        </div>

                        <div className='form-group'>
                            <label>Data ważności badania:</label>
                            <input
                                type="date"
                                placeholder="Wprowadź termin badania"
                                name="validityPeriod"
                                required
                                value={data.validityPeriod}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <div className='btns'>
                                <button className='ok-btn' type='submit'>&#x2714;</button>
                                <button className='cancel-btn' onClick={() => navigate('/moje_pojazdy')}>&#x2716;</button>
                            </div>
                        </div>
                    </form>
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

export default DodajPojazd;