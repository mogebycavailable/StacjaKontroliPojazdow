import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import styles from '../Moje_pojazdy/MojePojazdy.module.css'
import notes from '../css/img/notes.png'

const MojeRezerwacje = () => {
    const [services, setServices] = useState([])
    const [vehicles, setVehicles] = useState([])
    const user = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect (() => {
        const fetchVehicles = async () =>{
            if(user){
                try{
                    const res = await fetch(`http://localhost:3000/vehicles?userId=${user.id}`)
                    if(!res.ok) throw new Error('Błąd pobierania pojazdów')
                    const data = await res.json()
                    setVehicles(data)
                }catch(error){
                    console.error('Błąd pobierania pojazdów: ', error)
                }
            }
        }

        const fetchServices = async () =>{
            if(user){
                try{
                    const res = await fetch(`http://localhost:3000/services?userId=${user.id}`)
                    if(!res.ok) throw new Error('Błąd pobierania rezerwacji usług')
                    const data = await res.json()
                    setServices(data)
                }catch(error){
                    console.error('Błąd pobierania rezerwacji usług: ', error)
                }
            }
        }

        fetchVehicles()
        fetchServices()
    }, [])

    const handleDelete = (id) => {
        fetch('http://localhost:3000/services/' + id, {
            method: 'DELETE'
        }).then(() => {
            console.log("Usunięto wybraną rezerwację")
            //navigate('/moje_rezerwacje')
            window.location.reload(false)
        })
    }

    return(
        <div>
            <h2>moje rezerwacje</h2>
            <main>
                <Link to="/zamow_usluge"><button id="add">Umów się na przegląd</button></Link>
                { services.map((service) => {
                    const currentVehicle = vehicles.find((vehicle) => vehicle.id === service.pojazd)

                    return(
                        <div key={service.id} className="rezerwacja">
                            <div className={styles.photo}>
                                <img src={notes}/>
                            </div>
                            <div className={styles.data}>
                                <h4>Pojazd: {currentVehicle ? `${currentVehicle.marka} ${currentVehicle.model}` : 'Nie odnaleziono'}</h4>
                                <h4>Nr rej.: {currentVehicle ? `${currentVehicle.nrRejestracyjny}` : 'Nie odnaleziono'}</h4>
                                <h4>Przegląd zaplanowany na: {service.terminData} {service.terminGodzina}</h4>
                                <h4>Ostatnia modyfikacja: {service.aktualnaData} {service.aktualnaGodzina}</h4>
                                <Link to={`/moje_rezerwacje/edytuj_rezerwacje/${service.id}`}>
                                    <button id="edit">Edytuj rezerwacje</button>
                                </Link>
                                <button id="delete" onClick={() => handleDelete(service.id)}>Usuń rezerwację</button>
                            </div>
                        </div>
                    )
                })}
            </main>
	    </div>
    );
};

export default MojeRezerwacje;