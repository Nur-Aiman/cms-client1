import React from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { HOST } from '../api'

function ClientAppointmentReview({
  counsellor,
  surveyAnswers,
  mainIssue,
  selectedDateTime,
  clientId,
  appointmentStatus,
}) {
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

  const navigate = useNavigate()

  const handleBookNow = async () => {
    const appointmentData = {
      counsellor_id: counsellor.id,
      survey_answers: surveyAnswers,
      main_issue: mainIssue,
      appointment_status: 'Pending Confirmation from Counsellor',
      date_time: selectedDateTime,
    }

    console.log('Sending appointment data:', appointmentData)

    try {
      const response = await fetch(`${HOST}/client/appointment-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      })

      console.log('Response:', response)

      if (response.ok) {
        const data = await response.json()
        console.log('Appointment booked:', data)

        if (data.message) {
          alert(data.message)
        }

        navigate('/client/appointment-view')
      } else {
        const errorData = await response.json()

        if (errorData.message) {
          alert(errorData.message)
        }
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Error booking appointment:', error.message)
    }
  }

  return (
    <div className='px-8 py-4 bg-vanilla rounded-lg shadow-lg max-w-6xl mx-auto'>
      <h2 className='text-2xl font-medium text-dark-blue mb-4'>
        Selected Counsellor:
      </h2>
      {counsellor && counsellor.username ? (
        <div className='p-4 rounded-lg mb-6 bg-white'>
          <p className='mb-2'>
            <strong>Name:</strong> {counsellor.username}
          </p>
          <p className='mb-2'>
            <strong>Designation:</strong> {counsellor.designation}
          </p>
          <p className='mb-2'>
            <strong>Education:</strong> {counsellor.education}
          </p>
          <p className='mb-2'>
            <strong>University:</strong> {counsellor.university}
          </p>
          <p className='mb-2'>
            <strong>Key Interests:</strong>
          </p>
          {counsellor.key_interest && (
            <ul className='list-disc list-inside'>
              {JSON.parse(counsellor.key_interest).map(
                (interest, interestIndex) => (
                  <li key={interestIndex}>{interest}</li>
                )
              )}
            </ul>
          )}
        </div>
      ) : (
        <p className='text-dark p-4 mb-6 bg-white rounded-lg'>
          No counsellor selected. Please select a counsellor.
        </p>
      )}

      <h2 className='text-2xl font-medium text-dark-blue mb-4'>
        Your Chosen Appointment Date and Time:
      </h2>
      <div className=' p-4 rounded-lg mb-6 bg-white'>
        <p className='text-dark'>
          <strong>
            {format(selectedDateTime, 'dd/MM/yyyy p') ||
              'No date and time chosen'}
          </strong>
        </p>
      </div>

      <h2 className='text-2xl font-medium text-dark-blue mb-4'>
        Your Answers to the Survey Questions:
      </h2>
      <div className=' p-4 rounded-lg mb-6 bg-white'>
        {surveyAnswers &&
          surveyAnswers.map((answer, index) => (
            <div key={index} className='mb-4'>
              <p className='font-medium'>
                <strong>
                  {index + 1}. {questions[index]}
                </strong>
              </p>
              <p className='text-dark whitespace-normal break-all'>{answer}</p>
            </div>
          ))}
      </div>

      <h2 className='text-2xl font-medium text-dark-blue mb-4'>
        Your Main Issue:
      </h2>
      <div className='p-4 rounded-lg mb-8 bg-white'>
        <p className='text-dark whitespace-normal break-all'>{mainIssue}</p>
      </div>
      <button
        className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 transition-colors duration-200'
        onClick={handleBookNow}
      >
        Confirm Appointment
      </button>
    </div>
  )
}

export default ClientAppointmentReview
