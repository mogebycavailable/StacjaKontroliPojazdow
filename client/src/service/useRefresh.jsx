import { useState, useEffect } from 'react'

const useRefresh = () => {
    const refreshToken = localStorage.getItem('refresh-token')

    useEffect(async (e) => {
        e.preventDefault()

        const url = "http://localhost:8080/api/refresh"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+ refreshToken,
            }
        })

        if(response.ok){
            const newTokens = await response.json()
            localStorage.setItem('access-token', newTokens.accessToken)
            localStorage.setItem('refresh-token', newTokens.refreshToken)
            localStorage.setItem('role', newTokens.role)
            console.log("Podstawiłem nowe tokeny.")
        }else if(response.status >= 400 || response.status <= 499){
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
            localStorage.removeItem('role')
            navigate('/logowanie')
            window.location.reload()
        }
    })
};

export default useRefresh;