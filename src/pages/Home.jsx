import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Services from '../components/Services'
import ViewCounsellors from '../components/ViewCounsellors'
import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [counsellors, setCounsellors] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [error, setError] = useState(null)

  const handleBookingClick = () => {
    navigate('/client/appointment-booking')
  }

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(`${HOST}/client/counsellors-view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 404) {
        const data = await response.json()
        setError(data.message)
        setCounsellors([])
      } else {
        const data = await response.json()
        setCounsellors(data)
      }
    } catch (error) {
      console.error(
        'An error occurred while retrieving counsellor data:',
        error
      )
      setError('An error occurred while retrieving counsellor data')
    }
  }

  useEffect(() => {
    fetchCounsellors()

    if (!loading && user) {
      setLoggedInUser(user)
    }
  }, [user, loading])

  return (
    <div className='flex flex-col items-center min-h-screen bg-dark-blue shadow-lg pb-10'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Hero loggedInUser={loggedInUser} />
      <div className='container mx-auto p-6 bg-vanilla rounded shadow-md '>
        <h2 className='text-4xl font-bold text-dark m-20 text-center'>
          How We Can Help
        </h2>
        <Services />
        <h2 className='text-4xl font-bold text-dark m-20 text-center'>
          Meet Our Counsellors
        </h2>
        {error ? (
          <div className='text-red-500 text-center py-5'>{error}</div>
        ) : (
          <ViewCounsellors counsellors={counsellors} viewProfile={true} />
        )}
        <h2 className='text-4xl font-bold text-dark m-20 text-center'>
          Success stories from our clients
        </h2>
        <Testimonials />
      </div>
    </div>
  )
}

export default Home
