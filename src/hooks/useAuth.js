import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'

const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = Cookies.get('access_token')

        if (token) {
            try {
                console.log('token FE', token)
                const decoded = jwt_decode(token)
                setUser(decoded)
            } catch (error) {
                console.error('Error decoding token:', error)
            }
        }
        setLoading(false)
            // console.log('decoded ', user)
    }, [])

    return { user, loading }
}

export default useAuth