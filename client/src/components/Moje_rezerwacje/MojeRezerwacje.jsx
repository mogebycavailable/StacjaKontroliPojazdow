import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import styles from './MojeRezerwacje.module.css'
import notes_icon from '../css/img/notes.png'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const MojeRezerwacje = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [data, setData] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [stands, setStands] = useState([])

    const statutesTranslations = {
        ARRANGED: "Zaplanowane",
        PASSED: "Wynik pozytywny",
        NOT_PASSED: "Wynik negatywny",
    }

    // GET
    const getAllReservations = async () => {
        const url = "http://localhost:8080/api/user/inspections"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setData(data)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    const getAllVehiclesDetails = async () => {
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

    const getAllStandDetails = async () => {
        const url = "http://localhost:8080/api/user/stand"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setStands(data)
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
            refreshTokens,
        })
    }

    // DELETE
    const handleDeleteReservation = async (e, id) => {
        e.preventDefault()
        if(window.confirm('Czy na pewno chcesz odwołać tą rezerwację?')){
            const url = "http://localhost:8080/api/user/inspections/"+id
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                onSuccess: ((status, data) => {
                    console.log("Zaraz powinien być toast o sukcesie...")
                    toast.success(
                        <div>
                            Pomyślnie odwołano rezerwację
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
            console.log("Brak zgody użytkownika na odwołanie rezerwacji.")
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                await Promise.all([getAllReservations(), getAllVehiclesDetails(), getAllStandDetails()]);

            } catch (error) {
                setError("Wystąpił błąd podczas ładowania danych.")
                console.error("Błąd ładowania:", error)
            } finally {
                setIsLoading(false)
            }
        };

        fetchData()
    }, [])

    if (isLoading) {
        return <div><h2>Ładowanie danych...</h2></div>
    }

    if (error) {
        return <div><h2>Błąd: {error}</h2></div>
    }

    return(
        <div>
            <h2>Moje rezerwacje</h2>
            <main>
                <button style={{margin: '20px auto', fontSize: '20px'}} onClick={() => navigate('/zamow_usluge')}>Umów się na przegląd</button>
                { data.length === 0 && (<div className="prompt">Brak rezerwacji</div>)}
                { data.length > 0 && data.map((reservation) => {
                    const vehicleDetails = vehicles.find((vehicle) => vehicle.id === reservation.vehicleId)
                    const standDetails = stands.find((stand) => stand.id === reservation.standId)
                    return(
                        <div key={reservation.id} className={styles.reservation}>
                            <div className={styles.photo}>
                                <img className={styles['reservation-img']} src={notes_icon}/>
                            </div>
                            <div className={styles['reservation-container']}>
                                <div className={styles['reservation-data']}>
                                    <div>Pojazd:</div><div>{vehicleDetails.brand} {vehicleDetails.model} - {vehicleDetails.registrationNumber}</div>
                                </div>

                                <div className={styles['reservation-data']}>
                                    <div>Planowany czas rozpoczęcia:</div><div>{reservation.inspectionStart}</div>
                                </div>

                                <div className={styles['reservation-data']}>
                                    <div>Planowany czas zakończenia:</div><div>{reservation.inspectionEnd}</div>
                                </div>

                                <div className={styles['reservation-data']}>
                                    <div>Stanowisko:</div><div>{standDetails.name}</div>
                                </div>

                                <div className={styles['reservation-data']}>
                                    <div>Nazwa użytkownika:</div><div>{reservation.userEmail}</div>
                                </div>

                                <div className={styles['reservation-data']}>
                                    <div>Status:</div><div>{statutesTranslations[reservation.status]}</div>
                                </div>

                                <div className='btns'>
                                    <button className='cancel-btn' style={{width: 'auto'}} onClick={(e) => handleDeleteReservation(e, reservation.id)}>Odwołaj</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default MojeRezerwacje;