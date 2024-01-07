import React, { useState } from 'react'
import { useInterval } from '../hooks/useInterval'
import 'tailwindcss/tailwind.css'
import { useNavigate } from 'react-router-dom'

const handImage = process.env.PUBLIC_URL + '/images/hand.jpg'

function Hero({ loggedInUser }) {
  const navigate = useNavigate()

  const taglines = [
    'Where Your Mental Health Matters',
    'Finding Your Balance Within',
    'Guidance for Life’s Challenges',
    'Helping You Navigate Life’s Ups and Downs',
    'Uncover Your True Potential',
  ]

  const [taglineIndex, setTaglineIndex] = useState(0)

  const handleButtonClick = () => {
    if (loggedInUser) {
      navigate('/client/appointment-booking')
    } else {
      navigate('/client/register')
    }
  }

  useInterval(() => {
    setTaglineIndex((taglineIndex + 1) % taglines.length)
  }, 5000)

  return (
    <section
      className='w-full h-screen flex items-center justify-center text-dark font-serif'
      style={{
        backgroundImage: `url(${handImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div
        className='flex flex-col items-center space-y-6 animate-fade-in-down px-6 lg:px-0 bg-opacity-70 rounded-md p-6'
        style={{ zIndex: 2 }}
      >
        <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold text-center text-gold tracking-tighter'>
          Your Wellbeing, Our Priority
        </h1>
        <h2 className='mt-2 text-3xl md:text-4xl lg:text-5xl text-center font-medium animate-fade-in text-yellow-200'>
          <span>{taglines[taglineIndex]}</span>
        </h2>
        <p className='mt-6 text-xl md:text-2xl lg:text-3xl text-center text-vanilla max-w-2xl'>
          Here at our counseling service, we embrace a holistic approach to
          mental health. Merging traditional techniques with modern
          methodologies, our dedicated team of licensed and experienced
          counselors is here to guide you through life's challenges. We're
          committed to providing you with the personalized care you deserve.
        </p>
        <button
          onClick={handleButtonClick}
          className='bg-gold hover:bg-dark-blue hover:text-vanilla text-dark  font-bold py-2 px-4 rounded-lg mt-5'
        >
          {loggedInUser ? 'Book Appointment' : 'Register as new client'}
        </button>
      </div>
    </section>
  )
}

export default Hero
