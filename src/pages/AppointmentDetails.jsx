import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { add, format, differenceInMinutes } from 'date-fns'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import NavBar from '../components/NavBar'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Draggable from 'react-draggable'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

const AppointmentDetails = () => {
  const { id } = useParams()
  const [appointmentDetails, setAppointmentDetails] = useState({})
  const [isConfirmVisible, setIsConfirmVisible] = useState(true)
  const [isCloseAndBookVisible, setIsCloseAndBookVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [preAppointmentNotes, setPreAppointmentNotes] = useState({})
  const [counselorFeedback, setCounselorFeedback] = useState({})
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [openedNoteModal, setOpenedNoteModal] = useState(null)
  const [openedFeedbackModal, setOpenedFeedbackModal] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [date, setDate] = useState({ justDate: new Date(), dateTime: null })
  const [times, setTimes] = useState([])
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null)
  const [counsellorSession, setCounsellorSession] = useState([])
  const [error, setError] = useState(null)

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const getTimes = (justDate) => {
    const beginning = add(justDate, { hours: 8 })
    const end = add(justDate, { hours: 15, minutes: 30 })
    const interval = 30

    let times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i)
    }

    const bookedTimes = counsellorSession
      ? counsellorSession
          .filter(
            (session) =>
              format(new Date(session.date_time), 'dd/MM/yyyy') ===
              format(justDate, 'dd/MM/yyyy')
          )
          .map((session) => {
            const date = new Date(session.date_time)
            date.setHours(date.getHours() - 8)
            return date
          })
      : []

    const adjustedTimes = times.filter((time) => {
      return !bookedTimes.some(
        (bookedTime) => Math.abs(differenceInMinutes(time, bookedTime)) <= 115
      )
    })

    return adjustedTimes
  }

  const fetchAppointmentDetails = async () => {
    const response = await fetch(`${HOST}/counsellor/appointment/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('Error: Appointment not found')
      setError(data.message)
      return
    }

    const data = await response.json()
    data.sessions.forEach((session) => {
      setPreAppointmentNotes((prevState) => ({
        ...prevState,
        [session.session_id]: session.counsellor_pre_appointment_note,
      }))
      setCounselorFeedback((prevState) => ({
        ...prevState,
        [session.session_id]: session.counsellor_feedback,
      }))
    })
    setAppointmentDetails(data)

    if (data.appointment_status === 'Active') {
      setIsConfirmVisible(false)
      setIsCloseAndBookVisible(true)
      setIsClosed(false)
    } else if (data.appointment_status === 'Close') {
      setIsClosed(true)
    } else {
      setIsConfirmVisible(true)
      setIsCloseAndBookVisible(false)
      setIsClosed(false)
    }
  }

  useEffect(() => {
    if (!loading && user && user.role === 'counsellor') {
      fetchAppointmentDetails()
      setLoggedInUser(user)
    } else if (!loading && (!user || user.role !== 'counsellor')) {
      navigate('/user/login')
    }
  }, [id, user, loading])

  useEffect(() => {
    if (appointmentDetails.counsellor_id) {
      fetchCounsellorSession()
    }
  }, [appointmentDetails])

  const confirmAppointment = async () => {
    const response = await fetch(`${HOST}/counsellor/appointment/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    const data = await response.json()
    if (response.ok) {
      setAppointmentDetails({
        ...appointmentDetails,
        appointment_status: 'Active',
      })
      setIsConfirmVisible(false)
      setIsCloseAndBookVisible(true)
      setIsClosed(false)
      alert(data.message)
    }
  }

  const fetchCounsellorSession = async () => {
    try {
      const response = await fetch(
        `${HOST}/client/${appointmentDetails.counsellor_id}/sessions`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      const data = await response.json()

      setCounsellorSession(data.sessions)
    } catch (error) {
      console.error('An error occurred while retrieving session data:', error)
    }
  }

  const closeAppointment = async () => {
    if (
      window.confirm(
        `You want to close appointment for this client (${appointmentDetails.client_username}) ?`
      )
    ) {
      const response = await fetch(
        `${HOST}/counsellor/appointment-close/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setAppointmentDetails({
          ...appointmentDetails,
          appointment_status: 'Close',
        })
        setIsClosed(true)
      } else {
        const data = await response.json()
        alert(data.message)
      }
    }
  }

  const bookNextSession = async () => {
    const response = await fetch(
      `${HOST}/counsellor/appointment-bookNextSession/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date_time: format(new Date(selectedDateTime), 'MM/dd/yyyy p'),
        }),
      }
    )
    const data = await response.json()
    if (response.ok) {
      fetchAppointmentDetails()
      setIsModalOpen(false)
      alert(data.message)
    } else {
      alert('Failed to book the next session. ' + data.message)
    }
  }

  const closeNoteModal = () => {
    setOpenedNoteModal(null)
  }

  const closeFeedbackModal = () => {
    setOpenedFeedbackModal(null)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openNoteModal = () => {
    setNoteModalOpen(true)
  }

  const openFeedbackModal = () => {
    setFeedbackModalOpen(true)
  }

  const savePreAppointmentNote = async (sessionId, note) => {
    const response = await fetch(
      `${HOST}/counsellor/session/${sessionId}/note`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ note, loggedInUserId: loggedInUser.id }), // send logged in user id in the request body
      }
    )
    if (response.ok) {
      fetchAppointmentDetails()
    } else if (response.status === 403) {
      const data = await response.json()
      alert(data.message)
    }
  }

  const saveCounselorFeedback = async (sessionId, feedback) => {
    const response = await fetch(
      `${HOST}/counsellor/session/${sessionId}/feedback`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ feedback, loggedInUserId: loggedInUser.id }), // send logged in user id in the request body
      }
    )
    if (response.ok) {
      fetchAppointmentDetails()
    } else if (response.status === 403) {
      const data = await response.json()
      alert(data.message)
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
    <>
      <style jsx>
        {`
        .selected-date {
            background-color: #fec234 !important;
            color: #333333 !important;
        }
        .app-bg {
            background-color: #37435b;
        }
        
        .highlight-text {
            color: #fec234;
        }
    `}
      </style>

      <div className=' bg-dark-blue h-full min-h-screen'>
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

        <div className='flex justify-between items-center mb-4'>
          <span
            className={`fixed top-0 right-0 font-semibold text-lg mt-24 mr-20 px-4 py-2 rounded w-1/10  ${
              appointmentDetails.appointment_status === 'Active'
                ? 'bg-green-400'
                : appointmentDetails.appointment_status === 'Close'
                ? 'bg-red-400'
                : 'bg-yellow-400'
            }`}
          >
            {appointmentDetails.appointment_status}
          </span>
        </div>

        <div className='bg-vanilla shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-6xl mx-auto'>
          <h2 className='text-2xl p-4 font-bold text-gold bg-dark-blue mb-4 text-center rounded-lg uppercase'>
            Appointment Details
          </h2>
          {error && (
            <div className='text-red-500 text-center pb-4'>{error}</div>
          )}

          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Appointment ID:</strong>{' '}
            {appointmentDetails.appointment_id}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Client:</strong>{' '}
            {appointmentDetails.client_username}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Counsellor In Charge:</strong>{' '}
            {appointmentDetails.counsellor_username}
          </p>

          <div>
            <p className='text-gray-600 my-8 '>
              <strong className='text-2xl font-semibold'>Main Issue:</strong>{' '}
              <br /> <br />
              <div className='mx-6 text-base whitespace-normal break-all'>
                {appointmentDetails.main_issue}
              </div>
            </p>
          </div>
          <h2 className='text-2xl font-semibold text-gray-700 my-8'>
            Survey Answers:
          </h2>
          {appointmentDetails.survey_answers &&
            Object.values(appointmentDetails.survey_answers).map(
              (value, index) => (
                <p
                  className='rounded py-3 mx-6 text-gray-600 text-base space-y-1'
                  key={index}
                >
                  <strong>
                    {index + 1}. {`${questions[index]}`}
                  </strong>{' '}
                  <br />
                  <span className='whitespace-normal break-all'>{value}</span>
                </p>
              )
            )}

          <h2 className='text-2xl font-semibold text-gray-700 my-8'>
            Client's Information
          </h2>

          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Username:</strong>{' '}
            {appointmentDetails.client_username}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>NRIC:</strong>{' '}
            {appointmentDetails.nric}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Email:</strong>{' '}
            {appointmentDetails.email}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Phone Number:</strong>{' '}
            {appointmentDetails.phone_number}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Age:</strong>{' '}
            {appointmentDetails.age}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Marital Status:</strong>{' '}
            {appointmentDetails.marital_status}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Career:</strong>{' '}
            {appointmentDetails.career}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Home Address:</strong>{' '}
            {appointmentDetails.home_address}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Beneficiary Name:</strong>{' '}
            {appointmentDetails.beneficiary_name}
          </p>
          <p className='text-gray-600 text-base mx-6'>
            <strong className='font-semibold'>Beneficiary Phone Number:</strong>{' '}
            {appointmentDetails.beneficiary_phone_number}
          </p>

          <h2 className='text-2xl font-semibold text-gray-700 my-8'>
            Sessions
          </h2>
          {appointmentDetails.sessions && (
            <table className='table-auto w-full divide-y divide-gray-200'>
              <thead className=' bg-gray-50'>
                <tr>
                  <th className='px-4 py-2'>Session</th>
                  <th className='px-4 py-2'>Date Time</th>
                  <th className='px-4 py-2'>Payment Status</th>
                  <th className='px-4 py-2'>Pre-appointment Notes</th>
                  <th className='px-4 py-2'>Counsellor Feedback</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {appointmentDetails.sessions.map((session, index) => (
                  <tr key={index}>
                    <td className='border px-4 py-2 text-center'>
                      {session.session_number}
                    </td>
                    <td className='border px-4 py-2'>
                      {(() => {
                        const date = new Date(session.date_time)
                        date.setHours(date.getHours() - 8)
                        return new Intl.DateTimeFormat('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(date)
                      })()}
                    </td>

                    <td className='border px-4 py-2'>
                      {session.payment_status === 'paid' ? (
                        <>
                          {session.payment_status}
                          {'  '}
                          <a
                            href={session.receipt_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-block hover:text-blue-300 text-blue-500 font-bold rounded'
                          >
                            (View Receipt)
                          </a>
                        </>
                      ) : (
                        session.payment_status
                      )}
                    </td>

                    <td className='border px-4 py-2'>
                      <button
                        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => setOpenedNoteModal(session.session_id)}
                      >
                        Notes
                      </button>
                      {openedNoteModal === session.session_id && (
                        <div className='fixed z-10 inset-0 overflow-y-auto flex items-center justify-center'>
                          <Draggable handle='.modal-title'>
                            <div className='bg-white p-5 rounded shadow-lg w-2/5 m-auto relative'>
                              <h2 className='modal-title cursor-move font-bold text-2xl mb-4'>
                                Pre-Appointment Notes
                              </h2>
                              <textarea
                                className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
                                rows='8'
                                value={
                                  preAppointmentNotes[session.session_id] || ''
                                }
                                onChange={(e) =>
                                  setPreAppointmentNotes((prevState) => ({
                                    ...prevState,
                                    [session.session_id]: e.target.value,
                                  }))
                                }
                              ></textarea>
                              <button
                                className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                onClick={closeNoteModal}
                              >
                                Close Modal
                              </button>
                              <button
                                className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                  savePreAppointmentNote(
                                    session.session_id,
                                    preAppointmentNotes[session.session_id]
                                  )
                                  closeNoteModal()
                                }}
                              >
                                Save Note
                              </button>
                            </div>
                          </Draggable>
                        </div>
                      )}
                    </td>

                    <td className='border px-4 py-2'>
                      <button
                        className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() =>
                          setOpenedFeedbackModal(session.session_id)
                        }
                      >
                        Feedback
                      </button>
                      {openedFeedbackModal === session.session_id && (
                        <div className='fixed z-10 inset-0 overflow-y-auto flex items-center justify-center'>
                          <Draggable handle='.modal-title'>
                            <div className='bg-white p-5 rounded shadow-lg w-2/5 m-auto relative'>
                              <h2 className='modal-title cursor-move font-bold text-2xl mb-4'>
                                Counsellor Feedback
                              </h2>
                              <textarea
                                className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
                                rows='8'
                                value={
                                  counselorFeedback[session.session_id] || ''
                                }
                                onChange={(e) =>
                                  setCounselorFeedback((prevState) => ({
                                    ...prevState,
                                    [session.session_id]: e.target.value,
                                  }))
                                }
                              ></textarea>
                              <button
                                className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                onClick={closeFeedbackModal}
                              >
                                Close Modal
                              </button>
                              <button
                                className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                  saveCounselorFeedback(
                                    session.session_id,
                                    counselorFeedback[session.session_id]
                                  )
                                  closeFeedbackModal()
                                }}
                              >
                                Save Feedback
                              </button>
                            </div>
                          </Draggable>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isConfirmVisible &&
            !isClosed &&
            loggedInUser &&
            loggedInUser.id === appointmentDetails.counsellor_id && (
              <button
                className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={confirmAppointment}
                disabled={appointmentDetails.appointment_status === 'Active'}
              >
                Confirm Appointment
              </button>
            )}

          {isCloseAndBookVisible &&
            !isClosed &&
            loggedInUser &&
            loggedInUser.id === appointmentDetails.counsellor_id && (
              <>
                <button
                  className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4'
                  onClick={closeAppointment}
                >
                  Close Appointment
                </button>
                <button
                  className='mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                  onClick={openModal}
                >
                  Book Next Session
                </button>

                {isModalOpen && (
                  <div className='fixed z-10 inset-0 overflow-y-auto'>
                    <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                      <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6'>
                        <div>
                          <h3 className='text-lg mb-8 text-center'>
                            Selected Date and Time:
                            <span className='font-bold ml-2 dark-blue'>
                              {date.dateTime
                                ? format(date.dateTime, 'dd/MM/yyyy p')
                                : 'None selected'}
                            </span>
                          </h3>
                          <h2 className='text-lg mb-2 text-center'>
                            Pick a Date
                          </h2>

                          <div className='flex justify-center items-center'>
                            <ReactCalendar
                              minDate={new Date()}
                              className='REACT-CALENDAR p-2'
                              view='month'
                              tileClassName={({ date: dateValue, view }) =>
                                view === 'month' &&
                                date.justDate &&
                                dateValue.getTime() === date.justDate.getTime()
                                  ? 'selected-date'
                                  : ''
                              }
                              onClickDay={(dateValue) => {
                                setDate((prev) => ({
                                  ...prev,
                                  justDate: dateValue,
                                }))
                                setTimes(getTimes(dateValue))
                                setSelectedTimeIndex(null)
                              }}
                            />
                          </div>

                          {times && (
                            <div className='flex flex-col gap-4 mt-4'>
                              <h2 className='text-lg mb-2 text-center'>
                                Pick a Time
                              </h2>
                              <div className='flex gap-2 flex-wrap justify-center'>
                                {times.map((time, i) => (
                                  <div
                                    key={`time-${i}`}
                                    className='rounded-sm bg-gray-100 p-2'
                                  >
                                    <button
                                      type='button'
                                      className={
                                        selectedTimeIndex === i
                                          ? 'bg-gold text-dark'
                                          : ''
                                      }
                                      onClick={() => {
                                        setDate((prev) => ({
                                          ...prev,
                                          dateTime: time,
                                        }))
                                        setSelectedDateTime(time)
                                        setSelectedTimeIndex(i)
                                      }}
                                    >
                                      {format(time, 'kk:mm')}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className='mt-4 flex gap-4 justify-center'>
                            <button
                              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                              onClick={closeModal}
                            >
                              Cancel
                            </button>
                            <button
                              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                              onClick={() => {
                                if (!date.dateTime) {
                                  window.alert('Please choose date and time')
                                } else {
                                  bookNextSession()
                                }
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          {isClosed && (
            <button
              className='mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded'
              disabled
            >
              Appointment has been closed
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default AppointmentDetails
