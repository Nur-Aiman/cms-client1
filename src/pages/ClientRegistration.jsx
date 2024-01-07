import React, { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import { HOST } from '../api'

const style = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '50px',
  },
  input: {
    width: '200px',
    height: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    padding: '5px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 24px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '212px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}

function ClientRegistration() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone_number, setPhone_number] = useState('')
  const [age, setAge] = useState('')
  const [marital_status, setMarital_status] = useState('')
  const [career, setCareer] = useState('')
  const [home_address, setHome_address] = useState('')
  const [beneficiary_name, setBeneficiary_name] = useState('')
  const [beneficiary_phone_number, setBeneficiary_phone_number] = useState('')
  const [nric, setNric] = useState('')
  const [Tooltip, setTooltip] = useState(false)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  async function registerClient(event) {
    event.preventDefault()
    const response = await fetch(`${HOST}/client/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        phone_number,
        age,
        marital_status,
        career,
        home_address,
        beneficiary_name,
        beneficiary_phone_number,
        nric,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert(
        'Registration Successful. Login to your account to start booking for appointments'
      )
      navigate('/user/login')
    } else {
      setErrorMessage(data.message)
    }

    console.log(data)
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-dark-blue'>
      <div className='bg-vanilla p-8 rounded-lg shadow-lg  w-1/2 mx-auto'>
        <h1 className='text-3xl font-bold mb-10 text-dark text-center'>
          Client Registration
        </h1>
        {errorMessage && (
          <div className='text-red-500 text-center py-5 bg-vanilla'>
            {errorMessage}
          </div>
        )}

        <form onSubmit={registerClient} className='grid grid-cols-2 gap-5'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <div className='mt-1'>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <div className='mt-1'>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='relative mt-1'>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                onFocus={() => setTooltip(true)}
                onBlur={() => setTooltip(false)}
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {Tooltip && (
                <div className='absolute left-0 bottom-full mb-2 bg-black text-white text-xs p-1 rounded'>
                  Password must be at least 8 characters long, contain at least
                  one uppercase letter, one lowercase letter, and one number
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='nric'
              className='block text-sm font-medium text-gray-700'
            >
              NRIC
            </label>
            <div className='mt-1'>
              <input
                value={nric}
                onChange={(e) => setNric(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='phone_number'
              className='block text-sm font-medium text-gray-700'
            >
              Phone Number
            </label>
            <div className='mt-1'>
              <input
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='age'
              className='block text-sm font-medium text-gray-700'
            >
              Age
            </label>
            <div className='mt-1'>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type='number'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='marital_status'
              className='block text-sm font-medium text-gray-700'
            >
              Marital Status
            </label>
            <div className='mt-1'>
              <input
                value={marital_status}
                onChange={(e) => setMarital_status(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='career'
              className='block text-sm font-medium text-gray-700'
            >
              Career
            </label>
            <div className='mt-1'>
              <input
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='home_address'
              className='block text-sm font-medium text-gray-700'
            >
              Home Address
            </label>
            <div className='mt-1'>
              <input
                value={home_address}
                onChange={(e) => setHome_address(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='beneficiary_name'
              className='block text-sm font-medium text-gray-700'
            >
              Beneficiary Name
            </label>
            <div className='mt-1'>
              <input
                value={beneficiary_name}
                onChange={(e) => setBeneficiary_name(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='beneficiary_phone_number'
              className='block text-sm font-medium text-gray-700'
            >
              Beneficiaty Phone Number
            </label>
            <div className='mt-1'>
              <input
                value={beneficiary_phone_number}
                onChange={(e) => setBeneficiary_phone_number(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div className='col-span-2'>
            <button
              type='submit'
              className='py-2 px-4 w-full text-vanilla bg-dark hover:bg-gold rounded-md mt-auto'
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientRegistration
