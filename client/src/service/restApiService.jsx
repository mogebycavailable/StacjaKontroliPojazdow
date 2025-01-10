const apiRequest = async ({
    url,
    method = 'GET',
    useToken = false,
    body = null,
    onSuccess = null,
    onError = null,
    refreshTokens = null,
}) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        }

        if (useToken) {
            const accessToken = localStorage.getItem('access-token')
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`
            }
        }

        const response = await fetch(url, {
            method,
            headers: { ...headers },
            body: body ? JSON.stringify(body) : null,
        })

        const responseStatus = response.status
        const contentType = response.headers.get('Content-Type')
        let resData

        if (responseStatus >= 200 && responseStatus <= 299) {
            if (contentType && contentType.includes('application/json')) {
                resData = await response.json()
            } else {
                resData = await response.text()
            }

            if(onSuccess){
                onSuccess(responseStatus, resData)
            }
        } else {
            resData = await response.text()
            if(resData.length === 0  && onError){
                console.error('Błąd podczas pobierania danych zabezpieczonych:', responseStatus)
                onError(responseStatus)
            } else {
                if(onError){
                    onError(responseStatus, resData)
                }
            }
        }

        if(useToken){
            await refreshTokens(responseStatus)
        }
    } catch (error) {
        console.error('Błąd sieci:', error)
        if (onError) {
            onError(error.message)
        }
    }
}

export default apiRequest