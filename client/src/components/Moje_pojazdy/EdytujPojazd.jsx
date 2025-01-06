import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../css/Style.css'
import './MojePojazdy.css'
import useRefresh from '../../service/useRefresh'

const EdytujPojazd = () => {
    const currentYear = 2024
    const earliestYear = 1900
    const rangeOfYears = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i)

    const { id } = useParams()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    
    const [data, setData] = useState({
            brand: '',
            model: '',
            year: '',
            registrationNumber: '',
            vehicleIdentificationNumber: '',
            vehicleType: '',
            hasLpg: '',
            validityPeriod: ''
    })

    const vehicleTypes = [
        {key: 'CAR', label: 'Samochód osobowy'},
        {key: 'TRUCK', label: 'Samochód ciężarowy'},
        {key: 'MOTORCYCLE', label: 'Motocykl'},
        {key: 'VINTAGE', label: 'Samochód zabytkowy'},
        {key: 'SLOW_MOVING', label: 'Pojazd wolnobieżny'},
    ]

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    useEffect(() => {
        const getVehicleData = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/vehicles/"+id
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

        getVehicleData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsBlocked(true)

        const updatedVehicle = {
            brand: data.brand,
            model: data.model,
            year: data.year,
            registrationNumber: data.registrationNumber,
            vehicleIdentificationNumber: data.vehicleIdentificationNumber,
            vehicleType: data.vehicleType,
            hasLpg: data.hasLpg,
            validityPeriod: data.validityPeriod
        }

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/vehicles/"+id
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedVehicle),
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                toast.success(
                    <div>
                        Zaaktualizowano zmiany dla pojazdu:<br/>
                        {resData.brand} {resData.model}, {resData.year} r.
                    </div>,
                    {
                    onClose: () => {
                        window.location.assign('/moje_pojazdy')
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
            } else if (responseStatus === 400) {
                const resData = await response.text()
                console.error(resData)
                toast.error(resData, {
                    onClose: () => {
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
                setIsBlocked(false)
            } else {
                console.error("Błąd podczas przetwrzania przesłanych danych:", responseStatus)
                setIsBlocked(false)
            }

            await refreshTokens(responseStatus)
        } catch(error) {
            console.error("Błąd sieci:", error)
            setIsBlocked(false)
        }
    }

    const handleDeleteVehicle = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć ten pojazd?')){
            setIsBlocked(true)

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/vehicles/"+id
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
    
                const responseStatus = response.status
    
                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    toast.success(
                        <div>
                            Usunięto pojazd:<br/>
                            {resData.brand} {resData.model}, {resData.year} r.
                        </div>,
                        {
                        onClose: () => {
                            window.location.assign('/moje_pojazdy')
                            setIsBlocked(false)
                        },
                        autoClose: 3000,
                    })
                } else {
                    console.error("Błąd podczas przetwrzania przesłanych danych:", responseStatus)
                    setIsBlocked(false)
                }
    
                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
                setIsBlocked(false)
            }
        } else {
            console.log("Brak zgody użytkownika na usunięcie tego pojazdu.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            { data && (
                <div>
                    <h2>Edycja danych pojazdu o id: {id}</h2>
                    <fieldset className='fieldset-edit'>
                        <legend>Informacje o pojeździe</legend>
                        <form onSubmit={handleSubmit}>
                            <label>Marka</label>
                            <input
                                type="text"
                                placeholder="Wprowadź markę pojazdu"
                                name="brand"
                                required
                                value={data.brand}
                                onChange={handleChange}
                            />

                            <label>Model</label>
                            <input
                                type="text"
                                placeholder="Wprowadź model pojazdu"
                                name="model"
                                required
                                value={data.model}
                                onChange={handleChange}
                            />

                            <label>Rok produkcji</label>
                            <select
                                name="year"
                                placeholder="Wprowadź rok produkcji pojazdu"
                                required 
                                value={data.year}
                                onChange={handleChange}>
                                {rangeOfYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>              

                            <label>Numer rejestracyjny</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nr rejestracyjny pojazdu"
                                name="registrationNumber"
                                required
                                value={data.registrationNumber}
                                onChange={handleChange}
                            />

                            <label>VIN</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nr VIN pojazdu"
                                name="vehicleIdentificationNumber"
                                required
                                value={data.vehicleIdentificationNumber}
                                onChange={handleChange}
                            />

                            <label>Typ pojazdu</label>
                            <select
                                type="text"
                                placeholder="Wybierz typ pojazdu"
                                name="vehicleType"
                                required
                                value={data.vehicleType}
                                onChange={handleChange}
                            >
                                
                                <option value="" disabled>
                                    Wybierz typ pojazdu
                                </option>
                                {vehicleTypes.map((type) => (
                                    <option key={type.key} value={type.key}>{type.label}</option>
                                ))}
                            </select>

                            <label>Czy posiada instlację LPG?</label>
                            <Switch
                                name="hasLpg"
                                checked={data.hasLpg}
                                onChange={(checked) => {setData((prevState) => ({...prevState,hasLpg: checked}))}}
                            />

                            <label>Termin następnego badania technicznego</label>
                            <input
                                type="date"
                                placeholder="Wprowadź termin badania"
                                name="validityPeriod"
                                required
                                value={data.validityPeriod}
                                onChange={handleChange}
                            />

                            <br />
                            <div className='edit-buttons-div' style={{display: 'inline', padding: '1em'}}>
                                <button type="submit" id="update">Zapisz zmiany</button>
                                <button id="delete" onClick={handleDeleteVehicle}>Usuń pojazd</button>
                                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
                            </div>
                        </form>
                    </fieldset>
                </div>
            )}
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default EdytujPojazd;