import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import '../css/Style.css'
import './MojePojazdy.css'
import useFetch from '../../service/useFetch'
import useRefresh from '../../service/useRefresh'

const EdytujPojazd = () => {
    const currentYear = 2024
    const earliestYear = 1900
    const rangeOfYears = Array.from({ length: currentYear - earliestYear + 1 }, (_, i) => currentYear - i)

    const { id } = useParams()
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    
    const [data, setData] = useState({
            brand: '',
            model: '',
            year: '',
            registrationNumber: '',
            vehicleIdentificationNumber: '',
            validityPeriod: ''
    })

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
    }

    const handleDelete = async (e) => {
        e.preventDefault()
    }

    return(
        <div>
            {/* { error && <h2>{ error }</h2>} */}
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
                                <button id="delete" onClick={handleDelete}>Usuń pojazd</button>
                                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
                            </div>
                        </form>
                    </fieldset>
                </div>
            )}
	    </div>
    );
};

export default EdytujPojazd;