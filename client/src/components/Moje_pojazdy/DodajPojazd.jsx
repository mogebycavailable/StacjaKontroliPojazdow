import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import './MojePojazdy.css'
import useRefresh from '../../service/useRefresh'

const DodajPojazd = () => {
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
            validityPeriod: data.validityPeriod
        }

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/vehicles"
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(vehicle),
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                console.log('resData: '+resData)
                toast.success('Dodano nowy pojazd:\n'+resData.brand+' '+resData.model+'\n'+resData.year, {
                    onClose: () => {
                        window.location.assign('/moje_pojazdy')
                    },
                    autoClose: 3000,
                })
            } else {
                console.error("Błąd podczas przetwrzania przesłanych danych:", responseStatus)
            }

            await refreshTokens(responseStatus)
        } catch(error) {
            console.error("Błąd sieci:", error)
        }
    }

    return(
        <div>
            <h2>+ Dodawanie pojazdu +</h2>
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
                        
                    <option value=""></option>
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
                <button type="submit">Dodaj pojazd</button>
                <Link to="/moje_pojazdy"><button id="back">Anuluj</button></Link>
            </form>
	    </div>
    );
};

export default DodajPojazd;