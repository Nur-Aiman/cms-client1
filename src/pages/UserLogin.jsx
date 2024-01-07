import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { HOST } from '../api'

function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [userType, setUserType] = useState('client')
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  async function loginUser(event) {
    event.preventDefault()

    let url
    if (userType === 'client') {
      url = `${HOST}/client/login`
    } else if (userType === 'counsellor') {
      url = `${HOST}/counsellor/login`
    } else if (userType === 'admin') {
      url = `${HOST}/admin/login`
    } else {
      alert('Please select a valid user type.')
      return
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        console.log('error during login')
        setErrorMessage(data.message)
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        setErrorMessage('')
        navigate('/')
      }

      if (data.token) {
        Cookies.set('access_token', data.token)
      }
    } catch (error) {
      console.error('Error in loginUser:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-dark-blue'>
      <div className='bg-vanilla p-8 rounded-lg shadow-lg max-w-md w-full mx-auto'>
        <h1 className='text-3xl font-bold mb-10 text-dark text-center'>
          Login
        </h1>
        {errorMessage && (
          <div className='text-red-500 text-center pb-4'>{errorMessage}</div>
        )}
        <form onSubmit={loginUser} className='flex flex-col space-y-5'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
            className='px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gold rounded-md'
          />
          <div className='relative'>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordVisible ? 'text' : 'password'}
              placeholder='Password'
              className='px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gold rounded-md'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-dark'
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className='flex flex-col space-y-2'>
            <div>
              <input
                type='radio'
                id='client'
                name='userType'
                value='client'
                onChange={(e) => setUserType(e.target.value)}
                checked={userType === 'client'}
              />
              <label htmlFor='client' className='text-dark px-2'>
                Client
              </label>
            </div>
            <div>
              <input
                type='radio'
                id='counsellor'
                name='userType'
                value='counsellor'
                onChange={(e) => setUserType(e.target.value)}
                checked={userType === 'counsellor'}
              />
              <label htmlFor='counsellor' className='text-dark px-2'>
                Counsellor
              </label>
            </div>
            <div>
              <input
                type='radio'
                id='admin'
                name='userType'
                value='admin'
                onChange={(e) => setUserType(e.target.value)}
                checked={userType === 'admin'}
              />
              <label htmlFor='admin' className='text-dark px-2'>
                Admin
              </label>
            </div>
          </div>
          <button
            type='submit'
            className='py-2 px-4 w-full text-vanilla bg-dark hover:bg-gold rounded-md'
          >
            Login
          </button>
          <Link
            to='/client/register'
            className='text-dark-blue hover:text-gold text-center'
          >
            New Client? Register Here
          </Link>
        </form>
      </div>
    </div>
  )
}

export default UserLogin
