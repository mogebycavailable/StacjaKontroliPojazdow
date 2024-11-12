import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import './ZamowUsluge.css'

const ZamowUsluge = () => {
    const [vehicles, setVehicles] = useState([])
    const user = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    const [data, setData] = useState({
        userId: user.id,
        pojazd: '',
        typPojazdu: '',
        typUslugi: '',
        rodzajPaliwa: '',
        instalacjaLpg: false,
        napedHybrydowy: false,
        terminData: '',
        terminGodzina: '',
        aktualnaData: '',
        aktualnaGodzina: ''
    })

    useEffect(() => {
        if (user) {
          fetch(`http://localhost:3000/vehicles?userId=${user.id}`)
            .then((res) => res.json())
            .then((data) => setVehicles(data))
            .catch((error) => console.error("Błąd pobierania pojazdów:", error))
        }
    }, [user])
    const wybranyPojazd = vehicles.find((vehicle) => vehicle.id === data.pojazd)
    const rodzajePojazdow = [
        'Samochód osobowy',
        'Samochód ciężarowy',
        'TIR',
        'Ciągnik',
        'Inny'
    ]
    const rodzajeUslug = [
        'Badanie techniczne',
        'Sprawdzenie stanu technicznego pojazdu',
        'Ustawianie zbieżności pojazdu',
        'Wymiana oleju',
        'Regulacja wysokości świateł'
    ]
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
        //console.log('Krok ', step)
    }
    const previousStep = () => {
        setStep((prevStep) => prevStep - 1)
        //console.log('Krok ', step)
    }

    const orderService = async () => {
        const date = new Date()
        const currentDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
        const currentTime = date.getHours() + ':' + date.getMinutes()

        const service = {
            userId: data.userId,
            pojazd: data.pojazd,
            typPojazdu: data.typPojazdu,
            typUslugi: data.typUslugi,
            rodzajPaliwa: data.rodzajPaliwa,
            instalacjaLpg: data.instalacjaLpg,
            napedHybrydowy: data.napedHybrydowy,
            terminData: data.terminData,
            terminGodzina: data.terminGodzina,
            aktualnaData: currentDate,
            aktualnaGodzina: currentTime 
        }

        fetch('http://localhost:3000/services', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(service)
        }).then(() => {
            console.log("Usługa została umówiona")
            navigate('/moje_rezerwacje')
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        orderService()
    }

    return(
        <div className='body-div'>
            <h2>zamawianie usługi</h2>
            <main>
                { step === 1 && (
                    <div className="progress-bar">
                        <div id="first" style={{backgroundColor: "#ffa500"}}></div>
                        <div id="second" style={{backgroundColor: "#000000"}}></div>
                        <div id="third" style={{backgroundColor: "#000000"}}></div>
                    </div>
                )}
                { step === 2 && (
                    <div className="progress-bar">
                        <div id="first" style={{backgroundColor: "#ffa500"}}></div>
                        <div id="second" style={{backgroundColor: "#ffa500"}}></div>
                        <div id="third" style={{backgroundColor: "#000000"}}></div>
                    </div>
                )}
                { step === 3 && (
                    <div className="progress-bar">
                        <div id="first" style={{backgroundColor: "#ffa500"}}></div>
                        <div id="second" style={{backgroundColor: "#ffa500"}}></div>
                        <div id="third" style={{backgroundColor: "#ffa500"}}></div>
                    </div>
                )}

                <h3 className='zamow_usluge-h3'>krok {step}/3</h3>
                
                <form onSubmit={handleSubmit}>
                    { step === 1 && (
                        <div>
                            <fieldset>
                                <legend>Informacje na temat usługi</legend>
                            
                                <label>Wybierz Twój pojazd:</label>
                                <br/>
                                <select
                                    name="pojazd"
                                    value={data.pojazd}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, pojazd: e.target.value }))}
                                    required
                                >
                                    <option value=""></option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.marka} {vehicle.model}
                                        </option>
                                    ))}
                                </select>
                                <br/>
                                
                                <label>Wybierz typ pojazdu:</label>
                                <br/>
                                <select
                                    name="typPojazdu"
                                    value={data.typPojazdu}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, typPojazdu: e.target.value }))}
                                    required
                                >
                                    <option value=""></option>
                                    {rodzajePojazdow.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <br/>
                                
                                <label>Wybierz typ usługi:</label>
                                <br/>
                                <select
                                    name="typUslugi"
                                    value={data.typUslugi}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, typUslugi: e.target.value }))}
                                    required
                                >
                                    <option value=""></option>
                                    {rodzajeUslug.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <br/>
                                
                            </fieldset>
                            <fieldset>
                                <legend>Informacje na temat rodzaju paliwa</legend>
                                
                                <input
                                    type="radio"
                                    name="rodzajPaliwa"
                                    value="Benzyna"
                                    checked={data.rodzajPaliwa === 'Benzyna'}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, rodzajPaliwa: e.target.value }))}
                                    required
                                />
                                <label>Benzyna</label>
                                <br/>
                                
                                <input
                                    type="radio"
                                    name="rodzajPaliwa"
                                    value="Diesel"
                                    checked={data.rodzajPaliwa === 'Diesel'}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, rodzajPaliwa: e.target.value }))}
                                    required
                                />
                                <label>Diesel</label>
                                <br/>
                                
                                <input
                                    type="radio"
                                    name="rodzajPaliwa"
                                    value="Pojazd elektryczny"
                                    checked={data.rodzajPaliwa === 'Pojazd elektryczny'}
                                    onChange={
                                        (e) => setData((prevData) => ({
                                            ...prevData, 
                                            rodzajPaliwa: e.target.value,
                                            instalacjaLpg: false,
                                            napedHybrydowy: false
                                        }))
                                    }
                                    required
                                />
                                <label>Pojazd elektryczny</label>
                                <br/>
                                
                                { data.rodzajPaliwa !== 'Pojazd elektryczny' && (
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="instalacjaLpg"
                                            checked={data.instalacjaLpg}
                                            onChange={(e) => setData((prevData) => ({ ...prevData, instalacjaLpg: e.target.checked }))}
                                        />
                                        <label>Czy pojazd posiada instalację LPG?</label>
                                        <br/>
                                        
                                        <input
                                            type="checkbox"
                                            name="napedHybrydowy"
                                            checked={data.napedHybrydowy}
                                            onChange={(e) => setData((prevData) => ({ ...prevData, napedHybrydowy: e.target.checked }))}
                                        />
                                        <label>Czy pojazd jest Hybrydowy?</label>
                                        <br/>
                                    </div>
                                )}
                            </fieldset>
                            <button type="button" onClick={nextStep}>Dalej</button>
                        </div>
                    )}
                    { step === 2 && (
                        <div>
                            <fieldset>
                                <legend>Wybierz czas wykonania usługi</legend>

                                <label>Wybierz datę</label><br/>
                                <input
                                    type="date"
                                    name="terminData"
                                    value={data.terminData}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, terminData: e.target.value }))}
                                    required
                                />
                                <br/>

                                <label>Wybierz godzinę</label><br/>
                                <select
                                    name="hour"
                                    value={data.terminGodzina}
                                    onChange={(e) => setData((prevData) => ({ ...prevData, terminGodzina: e.target.value }))}
                                    required>

                                    <option value=""></option>
                                    {dostepneGodziny.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                                <br/>
                            </fieldset>

                            <button type="button" onClick={previousStep}>Wstecz</button>
                            <button type="button" onClick={nextStep}>Dalej</button>
                        </div>
                    )}
                    { step === 3 && (
                        <div>
                            <fieldset>
                                <legend>Potwierdź dane dotyczące usługi</legend>
                                <h4>Pojazd ({data.typPojazdu}): {wybranyPojazd.marka} {wybranyPojazd.model}</h4>
                                <h4>Nr rejestracyjny: {wybranyPojazd.nrRejestracyjny}</h4>
                                <h4>Wybrany typ usługi: {data.typUslugi}</h4>
                                <h4>Informacje o jednostce napędowej:</h4>
                                <h4>Silnik - {data.rodzajPaliwa}, LPG - {data.instalacjaLpg ? 'TAK' : 'NIE'}, Hybryda - {data.napedHybrydowy ? 'TAK' : 'NIE'}</h4>
				            </fieldset>
				
                            <fieldset>
                                <legend>Potwierdź termin</legend>
                                <h4>Data: {data.terminData}</h4>
                                <h4>Godzina: {data.terminGodzina}</h4>				
                            </fieldset>

                            <button type="button" onClick={previousStep}>Wstecz</button>
                            <button type="submit">Zapisz</button>
                        </div>
                    )}
                </form>
            </main>
	    </div>
    );
};

export default ZamowUsluge;