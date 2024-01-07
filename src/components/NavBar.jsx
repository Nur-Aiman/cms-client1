import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HOST } from '../api'
import Cookies from 'js-cookie'

const NavBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const goToUserLogin = () => {
    if (loggedInUser) {
      return
    }

    navigate('/user/login')
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    if (!loggedInUser || !loggedInUser.role) {
      console.error('User is not logged in or role is missing')
      return
    }
    let url
    if (loggedInUser.role === 'client') {
      url = `${HOST}/client/logout`
    } else if (loggedInUser.role === 'counsellor') {
      url = `${HOST}/counsellor/logout`
    } else if (loggedInUser.role === 'admin') {
      url = `${HOST}/admin/logout`
    } else {
      console.error('Unknown user role:', loggedInUser.role)
      return
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log(await response.text())
      setLoggedInUser(null)
      Cookies.remove('access_token')
      setDropdownOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Error in handleLogout:', error)
    }
  }

  const clientButtons = [
    { label: 'My Appointment', route: '/client/appointment-view' },
    { label: 'Book Appointment', route: '/client/appointment-booking' },
  ]

  const counsellorButtons = [
    { label: 'View Appointments', route: '/counsellor/appointments' },
    {
      label: 'My Profile',
      route: `/client/counsellors-view/${loggedInUser?.id}`,
    },
  ]

  const adminButtons = [
    { label: 'Manage Accounts', route: '/admin/account-manage' },
  ]

  let roleButtons
  if (loggedInUser) {
    if (loggedInUser.role === 'client') {
      roleButtons = clientButtons
    } else if (loggedInUser.role === 'counsellor') {
      roleButtons = counsellorButtons
    } else if (loggedInUser.role === 'admin') {
      roleButtons = adminButtons
    }
  }

  const handleNavigate = (route) => {
    navigate(route)
    setDropdownOpen(false)
  }

  return (
    <nav className='w-full bg-dark p-4 shadow-lg text-vanilla'>
      <div className='flex items-center justify-between max-w-7xl mx-auto'>
        <button
          onClick={() => navigate('/')}
          className='text-2xl font-bold mb-4'
        >
          Harmony Hub Counselling
        </button>
        <div className='flex'>
          {loggedInUser &&
            roleButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => handleNavigate(button.route)}
                className='px-6 py-3 mr-2 bg-gold text-dark font-semibold rounded hover:bg-dark-blue hover:text-vanilla transition-colors duration-200'
              >
                {button.label}
              </button>
            ))}
          <div
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            className='relative'
          >
            <button
              onClick={goToUserLogin}
              className='px-6 py-3 bg-gold text-dark font-semibold rounded hover:bg-dark-blue hover:text-vanilla transition-colors duration-200'
            >
              {loggedInUser ? loggedInUser.username : 'Login'}
            </button>
            {dropdownOpen && loggedInUser && (
              <div className='absolute left-0 w-48 bg-white rounded-md shadow-lg z-10'>
                <div className='py-1'>
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 text-sm text-dark hover:bg-gold hover:text-dark transition-colors duration-200'
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
