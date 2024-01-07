import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import ViewCounsellors from '../components/ViewCounsellors'
import AppointmentBooking from '../components/AppointmentBooking'
import SurveyQuestion from '../components/SurveyQuestion'
import MainIssue from '../components/MainIssue'
import ClientAppointmentReview from '../components/ClientAppointmentReview'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

function ClientBooking() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [counsellors, setCounsellors] = useState([])
  const [selectedCounsellor, setSelectedCounsellor] = useState(null)
  const [selectedCounsellorIndex, setSelectedCounsellorIndex] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [surveyAnswers, setSurveyAnswers] = useState(Array(10).fill(''))
  const [mainIssue, setMainIssue] = useState('')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [error, setError] = useState(null)

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  useEffect(() => {
    fetchCounsellors()

    if (!loading && user) {
      console.log('User ID', user.id)
      setLoggedInUser(user)
    }
  }, [user, loading])

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(`${HOST}/client/counsellors-view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (Array.isArray(data)) {
        setCounsellors(data)
      } else {
        console.log('datamessage', data.message)
        setError(data.message)
      }
    } catch (error) {
      console.error(
        'An error occurred while retrieving counsellor data:',
        error
      )
      setError('An error occurred while retrieving counsellor data.')
    }
  }

  return (
    <div className=' mx-auto w-full bg-dark-blue h-full'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <main className='py-8 flex justify-center items-center flex-grow'>
        <div className='w-full mx-auto max-w-6xl bg-vanilla rounded-xl shadow-md overflow-hidden p-6 space-y-6'>
          <h2 className='text-2xl p-4 font-bold text-gold bg-dark-blue mb-4 text-center rounded-lg uppercase'>
            Book Your Appointment
          </h2>

          {step === 1 && (
            <div className='p-6 bg-white rounded shadow-md min-h-[800px] flex flex-col '>
              <div className='w-full flex justify-end'>
                <button
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors duration-200'
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
              <div>
                <h2 className='text-2xl font-semibold mb-4 text-center'>
                  (1/4) Select your prefered counsellor
                </h2>
                {error ? (
                  <div className='text-red-500 text-center py-5 bg-vanilla'>
                    {error}
                  </div>
                ) : (
                  <ViewCounsellors
                    counsellors={counsellors}
                    setSelectedCounsellor={setSelectedCounsellor}
                    setSelectedCounsellorIndex={setSelectedCounsellorIndex}
                    selectedCounsellorIndex={selectedCounsellorIndex}
                    viewProfile={false}
                  />
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className='p-6 bg-white rounded shadow-md min-h-[1000px] flex flex-col '>
              <div className='w-full flex justify-end'>
                <button
                  className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200'
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className='px-4 py-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors duration-200'
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
              <div>
                <h2 className='text-2xl font-semibold mb-4 text-center'>
                  (2/4) Select a Date and Time
                </h2>
                <AppointmentBooking
                  setSelectedDateTime={setSelectedDateTime}
                  selectedCounsellor={selectedCounsellor}
                  loggedInUser={loggedInUser}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className='p-6 bg-white rounded shadow-md min-h-[800px] flex flex-col '>
              <div className='w-full flex justify-end'>
                <button
                  className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200'
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className='px-4 py-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors duration-200'
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
              <div>
                <h2 className='text-2xl font-semibold mb-4 text-center'>
                  (3/4) Survey Page
                </h2>
                <SurveyQuestion
                  surveyAnswers={surveyAnswers}
                  setSurveyAnswers={setSurveyAnswers}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className='p-6 bg-white rounded shadow-md min-h-[800px] flex flex-col'>
              <div className='w-full flex justify-end'>
                <button
                  className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200'
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className='px-4 py-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors duration-200'
                  onClick={nextStep}
                >
                  Review Appointment
                </button>
              </div>
              <div>
                <h2 className='text-2xl font-semibold mb-4 text-center'>
                  (4/4) Share with us your main issue
                </h2>
                <MainIssue mainIssue={mainIssue} setMainIssue={setMainIssue} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className='p-6 bg-white rounded shadow-md'>
              <h2 className='text-2xl font-semibold mb-4 text-center'>
                Review Appointment
              </h2>
              <ClientAppointmentReview
                counsellor={selectedCounsellor}
                mainIssue={mainIssue}
                surveyAnswers={surveyAnswers}
                selectedDateTime={selectedDateTime}
              />
              <div className='flex space-x-4 mt-4'>
                <button
                  className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition-colors duration-200'
                  onClick={prevStep}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ClientBooking
