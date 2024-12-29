import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'
import useRefresh from '../../service/useRefresh'

const Test = () => {
    const [data, setData] = useState("")
    const refreshTokens = useRefresh()
    
    useEffect(() => {
        const fetchSecuredData = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/secured"
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const dataSecured = await response.text()
                    setData(dataSecured)
                } else {
                    console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
                }

                await refreshTokens(responseStatus)
            } catch (error) {
                console.error("Błąd sieci:", error)
            }
        }
        
        fetchSecuredData()
    }, [])

    return (
        <div>
            <h1>DataSecured: {data}</h1>
        </div>
    );
};

export default Test;
