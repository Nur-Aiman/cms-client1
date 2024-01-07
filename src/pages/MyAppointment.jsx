import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import StripeCheckout from 'react-stripe-checkout'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

function MyAppointment() {
  const [appointment, setAppointment] = useState(null)
  const [error, setError] = useState(null)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [product, setProduct] = useState({
    name: 'Counselling Session',
    price: 150,
    description: 'This is sample Mario game',
  })

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const PaymentModal = ({ onCancel, onPay }) => (
    <div className='modal fixed w-full h-full top-0 left-0 flex items-center justify-center'>
      <div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>
      <div className='modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto'>
        <div className='modal-content py-4 text-left px-6'>
          <div className='flex justify-between items-center pb-3'>
            <p className='text-2xl font-bold'>Payment</p>
            <div className='modal-close cursor-pointer z-50' onClick={onCancel}>
              <svg
                className='fill-current text-black'
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 18 18'
              >
                <path d='M14.53 4.53l-1.06-1.06L9 6.94 4.53 3.47 3.47 4.53 6.94 9l-3.47 3.47 1.06 1.06L9 11.06l3.47 3.47 1.06-1.06L11.06 9z'></path>
              </svg>
            </div>
          </div>
          <p>Total amount : RM150</p>
          <div className='form-group container'>
            <StripeCheckout
              stripeKey='pk_test_51NLGA4G6bSUSzoI0LAxOJQWs7dRSFDumxp1STLWqnJuOFmVXJfnCNxNzIrqYa1pqn3ZYNlmZe1UsppHhcvHDc5bZ00PEZ30XRA'
              token={handlePayment}
              amount={product.price * 100}
              name={product.name}
              billingAddress
              shippingAddress
            />
          </div>
          <div className='flex justify-end pt-2'>
            <button
              className='px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className='px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400'
              onClick={onPay}
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`${HOST}/client/appointment-view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setAppointment(data.appointmentData)

        const receiptDescription = `
        Receipt Details:
        - Client Name: ${data.loggedInUser.username}
        - Counsellor Name: ${data.appointmentData.counsellor_username}
        
      `

        setProduct((prevProduct) => ({
          ...prevProduct,
          name: receiptDescription.trim(),
        }))
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch (error) {
      setError(error.toString())
    }
  }

  useEffect(() => {
    if (!loading && user && user.role === 'client') {
      fetchAppointment()
      setLoggedInUser(user)
      // console.log('decoded', user)
    } else if (!loading && (!user || user.role !== 'client')) {
      navigate('/user/login')
    }
  }, [user, loading])

  useEffect(() => {
    // console.log('currentSessionId in useEffect', currentSessionId)
  }, [currentSessionId])

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-2'>
          <h1 className='text-2xl font-semibold text-red-600'>{error}</h1>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg text-gray-600'>Loading appointment data...</p>
      </div>
    )
  }

  const handlePayment = async (token, addresses) => {
    try {
      const response = await fetch(
        `${HOST}/client/make-payment/${currentSessionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ product, token }),
        }
      )

      if (response.ok) {
        const currentSessionData = appointment.sessions.find(
          (session) => session.session_id === currentSessionId
        )
        const sessionReceiptDescription = `- Session Number: ${currentSessionData.session_number}\n- Session Date and Time: ${currentSessionData.date_time}`
        const receiptDetails = product.name.trim()
        setProduct((prevProduct) => ({
          ...prevProduct,
          name: receiptDetails,
          description: sessionReceiptDescription,
        }))
      } else {
        throw new Error(await response.text())
      }

      // console.log(token)

      setPaymentModalOpen(false)
      fetchAppointment()
    } catch (error) {
      console.error(error)
      setError(error.toString())
    }
  }

  const questions = [
    'Can you briefly describe what brings you to counseling at this time?',
    'Have you ever received counseling or psychotherapy before? If so, can you share a bit about that experience?',
    'Are you currently experiencing any significant stressors or life changes?',
    'What are your hopes and goals for counseling?',
    'Are you currently taking any medication, especially for mental health concerns?',
    'Do you have any known mental health diagnoses or conditions?',
    'Do you have any specific concerns or fears about engaging in counseling?',
    'How would you describe your support system (family, friends, etc.)?',
    'Are there any specific techniques or approaches to counseling that have worked well for you in the past, or any that you are particularly interested in?',
    "Is there anything specific you'd like me to know about your personal history, culture, identity, or background?",
  ]

  return (
    <div className='flex flex-col  bg-dark-blue'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <main className='p-8 flex justify-center items-center flex-grow'>
        <div className='w-full max-w-6xl bg-vanilla rounded-xl shadow-md overflow-hidden p-6 space-y-6'>
          <h2 className='text-2xl p-4 font-bold text-gold bg-dark-blue mb-4 text-center rounded-lg uppercase'>
            Appointment Information
          </h2>
          {error && (
            <div className='flex items-center justify-center h-screen'>
              <div className='w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-2'>
                <h1 className='text-2xl font-semibold text-red-600'>{error}</h1>
              </div>
            </div>
          )}

          <section className='space-y-4'>
            <p className='text-gray-600 text-base mx-6'>
              <strong className='font-semibold'>Counsellor In Charge:</strong>{' '}
              {appointment.counsellor_username}
            </p>
            <p className='text-gray-600 text-base mx-6'>
              <strong className='font-semibold'>Appointment Status:</strong>{' '}
              {appointment.appointment_status}
            </p>

            {appointment.sessions && appointment.sessions.length > 0 && (
              <section className='space-y-2'>
                <h3 className='text-2xl my-9 font-semibold text-gray-700'>
                  Session Details:
                </h3>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Session Number
                      </th>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Session ID
                      </th>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Date and Time
                      </th>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Counsellor Feedback
                      </th>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Payment Status
                      </th>
                      <th className='px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {appointment.sessions.map((session, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center'>
                          {' '}
                          {session.session_number}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center'>
                          {session.session_id}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-base text-gray-500'>
                          {new Intl.DateTimeFormat('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC',
                          }).format(new Date(session.date_time))}
                        </td>
                        <td className='px-6 py-4 whitespace-normal break-all text-base text-gray-500'>
                          {session.counsellor_feedback ||
                            'Counsellor hasn’t provided any feedback for this session'}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-base text-gray-500'>
                          {session.payment_status}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-base text-gray-500'>
                          {session.payment_status === 'paid' ? (
                            <a
                              href={session.receipt_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                            >
                              View Receipt
                            </a>
                          ) : (
                            <button
                              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                              onClick={() => {
                                setCurrentSessionId(session.session_id)
                                const currentSessionData = session
                                const sessionReceiptDescription = `
                    - Session Number: ${currentSessionData.session_number}
                    - Session Date and Time: ${new Intl.DateTimeFormat(
                      'en-GB',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      }
                    ).format(new Date(currentSessionData.date_time))}
                  `
                                console.log(
                                  'session receipt desc',
                                  sessionReceiptDescription
                                )
                                setProduct((prevProduct) => ({
                                  ...prevProduct,
                                  description: sessionReceiptDescription,
                                }))
                                setPaymentModalOpen(true)
                              }}
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <div>
              <p className='text-gray-600 my-16 '>
                <strong className='text-2xl font-semibold'>Main Issue:</strong>{' '}
                <br /> <br />
                <div className='mx-6 text-base whitespace-normal break-all'>
                  {appointment.main_issue}
                </div>
              </p>
            </div>
          </section>

          {appointment.survey_answers &&
            Object.keys(appointment.survey_answers).length > 0 && (
              <section className='space-y-2'>
                <h3 className='text-2xl font-semibold text-gray-700'>
                  Survey Answers:
                </h3>
                {Object.values(appointment.survey_answers).map(
                  (answer, index) => (
                    <div
                      key={index}
                      className='rounded py-3 mx-6 text-gray-600 text-base space-y-1'
                    >
                      <p>
                        <strong className='font-bold'>
                          {index + 1}. {questions[index]}
                        </strong>
                      </p>
                      <p className='whitespace-normal break-all'>{answer}</p>
                    </div>
                  )
                )}
              </section>
            )}

          {paymentModalOpen && (
            <PaymentModal
              onCancel={() => setPaymentModalOpen(false)}
              onPay={handlePayment}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default MyAppointment
