import { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { useNavigate } from 'react-router-dom'
import 'tailwindcss/tailwind.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { HOST } from '../api'

const counsellorPicture =
  process.env.PUBLIC_URL + '/images/counsellor-picture.png'

function ViewCounsellors({ counsellors, setSelectedCounsellor, viewProfile }) {
  const [selectedCounsellorIndex, setSelectedCounsellorIndex] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchCounsellors()
  }, [])

  const handleCounsellorSelect = (counsellor, index) => {
    if (setSelectedCounsellor) {
      setSelectedCounsellor(counsellor)
      setSelectedCounsellorIndex(index)
    }

    if (viewProfile) {
      navigate(`/client/counsellors-view/${counsellor.id}`)
    }
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSelectedCounsellor(data)
    } catch (error) {
      console.error(
        'An error occurred while retrieving counsellor data:',
        error
      )
    }
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  }

  return (
    <div className='p-6 '>
      <Slider {...settings}>
        {counsellors.map((counsellor, index) => {
          let keyInterests
          keyInterests = JSON.parse(counsellor.key_interest)

          return (
            <div
              key={index}
              className={`flex flex-col bg-vanilla border-2 border-dark-blue rounded-lg shadow-md m-2 h-[550px] hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-105 ${
                index === selectedCounsellorIndex
                  ? 'border-8 border-blue-300'
                  : ''
              }`}
              onClick={() => handleCounsellorSelect(counsellor, index)}
            >
              <div className='p-4'>
                <img
                  src={counsellorPicture}
                  alt='Counsellor'
                  className='mx-auto h-48 w-48 rounded-full'
                />
                <h2 className='text-3xl font-bold m-4 text-dark text-center'>
                  {counsellor.username}
                </h2>
                <p className='text-xl text-dark italic text-center'>
                  {counsellor.designation}
                </p>
                <p className='text-xl text-dark text-center'>
                  {counsellor.education}
                </p>
                <p className='text-xl text-dark text-center'>
                  {counsellor.university}
                </p>{' '}
                <p className='text-xl text-dark m-4 text-center'>
                  Key Interests:
                </p>
                {Array.isArray(keyInterests) && (
                  <div className='flex justify-center mb-4'>
                    <ul className='list-disc list-inside text-xl text-dark text-left'>
                      {keyInterests.map((interest, interestIndex) => (
                        <li key={interestIndex}>{interest}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default ViewCounsellors
