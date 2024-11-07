import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Rejestracja = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        imie: "",
        nazwisko: "",
        email: "",
        nrTel: "",
        haslo: "",
        powtorzHaslo: "",
        regulamin: false
    })

    const validData = data.imie && data.nazwisko && data.email && data.nrTel && data.haslo && data.powtorzHaslo && data.regulamin && (data.haslo === data.powtorzHaslo)

    const createAccount = async () => {
        const token = `token_${Date.now()}`

        const user = { 
            imie: data.imie,
            nazwisko: data.nazwisko,
            email: data.email,
            nrTel: data.nrTel,
            haslo: data.haslo,
            token: token
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }).then(() => {
            console.log("Dodano nowego użytkownika")
            navigate('/logowanie')
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        createAccount()
    }

    return(
        <div className='div-body'>
            <h2>Rejestracja do serwisu</h2>
            <form onSubmit={handleSubmit}>
                <div className='form'>
                    <label>Imię</label>
                    <input
                        type="text"
                        placeholder="Wprowadź imię"
                        name="imie"
                        onChange={(e) => setData((prevData) => ({ ...prevData, imie: e.target.value }))}
                        value={data.imie}
                        required
                    />

                    <label>Nazwisko</label>
                    <input
                        type="text"
                        placeholder="Wprowadź nazwisko"
                        name="nazwisko"
                        onChange={(e) => setData((prevData) => ({ ...prevData, nazwisko: e.target.value }))}
                        value={data.nazwisko}
                        required
                    />

                    <label>E-mail</label>
                    <input 
                        type="email"
                        placeholder="Wprowadź adres e-mail"
                        name="email"
                        onChange={(e) => setData((prevData) => ({ ...prevData, email: e.target.value }))}
                        value={data.email}
                        required
                    />

                    <label>Nr telefonu</label>
                    <input 
                        type="tel"
                        placeholder="Wprowadź nr telefonu"
                        name="nrTel"
                        onChange={(e) => setData((prevData) => ({ ...prevData, nrTel: e.target.value }))}
                        value={data.nrTel}
                        required
                    />			
                    
                    <label>Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="haslo"
                        onChange={(e) => setData((prevData) => ({ ...prevData, haslo: e.target.value }))}
                        value={data.haslo}
                        required
                    />
                    
                    <label>Powtórz hasło</label>
                    <input
                        type="password"
                        placeholder="Powtórz hasło"
                        name="powtorzHaslo"
                        onChange={(e) => setData((prevData) => ({ ...prevData, powtorzHaslo: e.target.value }))}
                        value={data.powtorzHaslo}
                        required
                    />
                    <br/>
                    <label className="policy">
                        <input type="checkbox" id="regulamin" checked={data.regulamin} onChange={(e) => setData((prevData) => ({ ...prevData, regulamin: e.target.checked }))} />
                        Akceptuję <a href="https://pl.wikipedia.org/wiki/Regulamin" target="_blank">regulamin</a> i <a href="https://pl.wikipedia.org/wiki/Polityka_prywatno%C5%9Bci" target="_blank">politykę prywatności</a>
                    </label>
                    { validData && (
                        <button type="submit">Zarejestruj się</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Rejestracja;