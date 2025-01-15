import { useNavigate } from 'react-router-dom';

const useRefresh = () => {
    const navigate = useNavigate()

    const refreshTokens = async (status) => {

        if(status != 401 && status != 403 && !(status >= 500 && status <= 599)){
            const refreshToken = localStorage.getItem('refresh-token')

            if(!refreshToken){
                return
            }

            try{
                const url = "http://localhost:8080/api/refresh"
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                    }
                })

                if(response.ok){
                    const newTokens = await response.json()
                    localStorage.setItem('access-token', newTokens.accessToken)
                    localStorage.setItem('refresh-token', newTokens.refreshToken)
                    localStorage.setItem('role', newTokens.role)
                    console.log("Zasoby zostały zaaktualizowane.")
                } else {
                    console.error("Błąd podczas odświeżania tokenów:", response.status)
                }
            } catch(error) {
                console.error("Błąd sieci podczas odświeżania tokenów:", error)
            }
        } else if(status === 401 || status === 403){
            console.warn("Błąd autoryzacji lub nieważny token (status: " + status + ").")
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
            localStorage.removeItem('role')
            navigate('/logowanie')
            window.location.reload()
        } else {
            console.error("Nieoczekiwany błąd serwera (status: " + status + ").")
        }
    }

    return refreshTokens
}

export default useRefresh