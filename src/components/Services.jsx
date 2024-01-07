import React from 'react'
import logo from '../logo.svg'
import couple from '../couple-icon.svg'
import career from '../career-icon.svg'
import family from '../family-icon.svg'
import personal from '../personal-icon.svg'
import mental from '../mental-icon.svg'
import child from '../child-icon.svg'

const services = [
  { name: 'Career Counselling', logo: career },
  { name: 'Marriage Counselling', logo: couple },
  { name: 'Mental Health Counselling', logo: mental },
  { name: 'Family Counselling', logo: family },
  { name: 'Child Counselling', logo: child },
  { name: 'Personal Counselling', logo: personal },
]

function Services() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-6 p-6'>
      {services.map((service, index) => (
        <div
          key={index}
          className='bg-vanilla p-4 rounded-lg shadow-md space-y-2 text-center'
          style={{ boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.2)' }}
        >
          <img
            src={service.logo}
            alt={service.name}
            className='mx-auto w-16 h-16'
          />
          <h3 className='text-lg font-semibold text-dark'>{service.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default Services
