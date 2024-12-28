import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'
import useRefresh from '../../service/useRefresh';

const Test = () => {
    const [data, setData] = useState("")
    const accessToken = localStorage.getItem('access-token')
    
    useEffect (() => {
        const fetchSecuredData = async (e) => {
            const url = "http://localhost:8080/api/secured"
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ accessToken,
                }
            })

            if(response.ok){
                const dataSecured = await response.text()
                setData(dataSecured)
            }
        }
        
        fetchSecuredData()
    }, [])

    return(
        <div>
            <h1>DataSecured: {data}</h1>
        </div>
    );
};

export default Test;