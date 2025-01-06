import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useRefresh from './useRefresh'

const useGet = async (url, requiresToken = false, responseDataJson = false) => {

            try {
                const accessToken = localStorage.getItem('access-token')
                const headers = {
                    'Content-Type': 'application/json',
                };
          
                if (requiresToken && accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers,
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    if(responseDataJson){
                        const resDataJson = await response.json()
                        return resDataJson
                    } else {
                        const resDataText = await response.text()
                        return resDataText
                    }
                } else {
                    console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
                    toast.error("Błąd podczas pobierania danych zabezpieczonych!", {
                        autoClose: 3000,
                    })
                }

                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
                throw error
            }
}

export default useGet