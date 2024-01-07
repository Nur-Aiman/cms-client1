import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab, Switch } from '@headlessui/react'
import NavBar from '../components/NavBar'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

const Appointments = () => {
  const [activeAppointments, setActiveAppointments] = useState([])
  const [closedAppointments, setClosedAppointments] = useState([])
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [viewAll, setViewAll] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const fetchAppointments = async (status, setAppointmentsFunc) => {
    const response = await fetch(
      `${HOST}/counsellor/appointments?status=${status}${
        viewAll ? '' : `&counsellor=${loggedInUser.username}`
      }`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )
    if (response.ok) {
      const data = await response.json()
      console.log(data)

      setAppointmentsFunc(data.appointments || [])
    } else {
      const data = await response.json()
      setAppointmentsFunc(data.appointments || [])
      setError(data.message || 'An error occurred while fetching appointments')
    }
  }

  useEffect(() => {
    if (!loading) {
      if (user && user.role === 'counsellor') {
        setLoggedInUser(user)
      } else {
        navigate('/user/login')
      }
    }
  }, [user, loading])

  useEffect(() => {
    if (user && user.role === 'counsellor' && user.username) {
      fetchAppointments('Active', setActiveAppointments)
      fetchAppointments('Close', setClosedAppointments)
      fetchAppointments(
        'Pending Confirmation from Counsellor',
        setPendingAppointments
      )
    }
  }, [user, viewAll])

  const handleAppointmentDetailPage = (id) => {
    navigate(`/counsellor/appointment/${id}`)
  }

  const renderAppointments = (appointments) => {
    if (appointments.length === 0) {
      return (
        <div className='text-center align-middle'>
          {error && (
            <div className='text-red-500 text-center p-4 w-1/2 rounded-lg bg-vanilla mx-auto inline-block'>
              {error}
            </div>
          )}
        </div>
      )
    }

    return appointments.map((appointment, index) => (
      <div
        key={index}
        className='w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 min-w-[60%] mx-auto m-2 bg-white shadow-lg rounded-xl p-6 mb-4 transition-transform duration-500 ease-in-out transform hover:scale-105 cursor-pointer'
        onClick={() => handleAppointmentDetailPage(appointment.appointment_id)}
      >
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-xl font-bold text-blue-800'>
            Client: {appointment.client_username}
          </h2>

          <div>
            <h3 className='text-lg text-blue-700'>Counsellor In Charge:</h3>
            <h3 className='text-lg text-blue-700'>
              {appointment.counsellor_username}
            </h3>
          </div>
        </div>
        <p className='text-sm text-gray-600'>
          Appointment ID: {appointment.appointment_id}
        </p>
        <br />
        <p className='text-gray-700 text-base'>
          <strong>Main Issue:</strong> <br />
          <span className='whitespace-normal break-all'>
            {appointment.main_issue}
          </span>
        </p>
      </div>
    ))
  }

  return (
    <div className='bg-dark-blue min-h-screen'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <div className='flex flex-col items-center px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32'>
        <div className='p-4 w-full md:w-3/4 lg:w-2/3'>
          <div className='flex items-center justify-between w-full p-2 bg-gradient-to-r from-blue-200 to-gray-200 rounded-full transition-colors duration-500 ease-in-out'>
            <button
              onClick={() => setViewAll(true)}
              className={`flex-grow text-center rounded-full py-2 text-xs sm:text-sm md:text-base transition-colors duration-500 ease-in-out ${
                viewAll
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                  : ''
              }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setViewAll(false)}
              className={`flex-grow text-center rounded-full py-2 text-xs sm:text-sm md:text-base transition-colors duration-500 ease-in-out ${
                viewAll
                  ? ''
                  : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
              }`}
            >
              My Appointments
            </button>
          </div>
        </div>
        <Tab.Group>
          <Tab.List className='flex p-1 space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white'>
            <Tab
              className={({ selected }) =>
                `w-full px-3 py-2.5 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white'
                  : 'text-white hover:bg-gradient-to-r from-blue-700 to-blue-800'
              } transition-colors duration-500 ease-in-out`
              }
            >
              Active
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full px-3 py-2.5 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white'
                  : 'text-white hover:bg-gradient-to-r from-blue-700 to-blue-800'
              } transition-colors duration-500 ease-in-out`
              }
            >
              Closed
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full px-3 py-2.5 text-sm leading-5 font-medium rounded-lg
              ${
                selected
                  ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white'
                  : 'text-white hover:bg-gradient-to-r from-blue-700 to-blue-800'
              } transition-colors duration-500 ease-in-out`
              }
            >
              Pending
            </Tab>
          </Tab.List>
          <Tab.Panels className='w-full mt-2 px-4 md:px-8'>
            <Tab.Panel>{renderAppointments(activeAppointments)}</Tab.Panel>
            <Tab.Panel>{renderAppointments(closedAppointments)}</Tab.Panel>
            <Tab.Panel>{renderAppointments(pendingAppointments)}</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default Appointments
