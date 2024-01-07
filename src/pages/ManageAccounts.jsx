import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

const ManageAccounts = () => {
  const [counsellors, setCounsellors] = useState([])
  const [clients, setClients] = useState([])
  const [role, setRole] = useState('counsellor')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) // <---- Added errorMessage state
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const deleteClient = async (username, id) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete ${username} account?`
    )
    if (!confirmation) return

    try {
      const response = await fetch(`${HOST}/admin/deleteClient/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      setClients(clients.filter((client) => client.username !== username))
    } catch (error) {
      console.error('An error occurred while deleting client:', error)
      setErrorMessage(error.message)
    }
  }

  const handleRegisterCounsellor = () => {
    navigate('/admin/registerCounsellor')
  }

  useEffect(() => {
    if (!loading && user && user.role === 'admin') {
      setLoggedInUser(user)
    } else if (!loading && (!user || user.role !== 'admin')) {
      navigate('/user/login')
    }
  }, [user, loading])

  useEffect(() => {
    if (role === 'counsellor') {
      fetchCounsellors()
    } else if (role === 'client') {
      fetchClients()
    }
  }, [role])

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(`${HOST}/client/counsellors-view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCounsellors(data)
    } catch (error) {
      console.error(
        'An error occurred while retrieving counsellor data:',
        error
      )
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch(`${HOST}/admin/clients-view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const data = await response.json()
      setClients(data.clients)
      setLoggedInUser(data.loggedInUser)
    } catch (error) {
      console.error('An error occurred while retrieving client data:', error)
      setErrorMessage(error.message)
    }
  }

  const handleChange = (event) => {
    setRole(event.target.value)
  }

  return (
    <div className='flex flex-col bg-dark-blue h-screen'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <main className='p-8 flex justify-center flex-grow'>
        <div className='w-full max-w-6xl bg-vanilla rounded-xl shadow-md overflow-hidden p-6 space-y-6'>
          <h2 className='text-2xl p-4 font-bold text-gold bg-dark-blue mb-4 text-center rounded-lg uppercase'>
            Manage Accounts
          </h2>
          {errorMessage && (
            <div className='text-red-500 text-center pb-4'>{errorMessage}</div>
          )}
          <div className='flex justify-between items-center mb-4'>
            <select
              value={role}
              onChange={handleChange}
              className='mb-4 p-2 rounded-lg'
            >
              <option value='counsellor'>Counsellor</option>
              <option value='client'>Client</option>
            </select>

            {role === 'counsellor' && (
              <button
                className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 transition-colors duration-200'
                onClick={handleRegisterCounsellor}
              >
                Register a new counsellor
              </button>
            )}
          </div>

          {role === 'counsellor' ? (
            <table className='table-auto w-full'>
              <thead>
                <tr>
                  <th className='px-4 py-2'>No</th>
                  <th className='px-4 py-2'>Username</th>
                  <th className='px-4 py-2'>Designation</th>
                  <th className='px-4 py-2'>Education</th>
                  <th className='px-4 py-2'>University</th>
                </tr>
              </thead>
              <tbody>
                {counsellors.map((counsellor, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-200' : 'bg-white'
                    }`}
                  >
                    <td className='border px-4 py-2'>{index + 1}</td>
                    <td className='border px-4 py-2'>{counsellor.username}</td>
                    <td className='border px-4 py-2'>
                      {counsellor.designation}
                    </td>
                    <td className='border px-4 py-2'>{counsellor.education}</td>
                    <td className='border px-4 py-2'>
                      {counsellor.university}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className='table-auto w-full'>
              <thead>
                <tr>
                  <th className='px-4 py-2'>No</th>
                  <th className='px-4 py-2'>Username</th>
                  <th className='px-4 py-2'>Email</th>
                  <th className='px-4 py-2'>Age</th>
                  <th className='px-4 py-2'>Phone Number</th>
                  <th className='px-4 py-2'>Career</th>
                  <th className='px-4 py-2'>Home Address</th>
                  <th className='px-4 py-2'>Beneficiary Name</th>
                  <th className='px-4 py-2'>Beneficiary Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-200' : 'bg-white'
                    }`}
                  >
                    <td className='border px-4 py-2'>{index + 1}</td>
                    <td className='border px-4 py-2'>{client.username}</td>
                    <td className='border px-4 py-2'>{client.email}</td>
                    <td className='border px-4 py-2'>{client.age}</td>
                    <td className='border px-4 py-2'>{client.phone_number}</td>
                    <td className='border px-4 py-2'>{client.career}</td>
                    <td className='border px-4 py-2'>{client.home_address}</td>
                    <td className='border px-4 py-2'>
                      {client.beneficiary_name}
                    </td>
                    <td className='border px-4 py-2'>
                      {client.beneficiary_phone_number}
                    </td>
                    <td className='border px-2 py-2'>
                      <button
                        onClick={() => deleteClient(client.username, client.id)}
                        className='bg-red-500 text-white px-1  rounded'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default ManageAccounts
