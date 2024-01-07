import React, { useState, useEffect } from 'react'
import ReactCalendar from 'react-calendar'
import { add, format, differenceInMinutes } from 'date-fns'
import { utcToZonedTime, format as formatDateInZone } from 'date-fns-tz'
import 'tailwindcss/tailwind.css'
import { HOST } from '../api'

function AppointmentBooking({
  setSelectedDateTime,
  selectedCounsellor,
  loggedInUser,
}) {
  const [counsellorSession, setCounsellorSession] = useState([])

  const [date, setDate] = useState({
    justDate: new Date(),
    dateTime: null,
  })

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null)
  const [times, setTimes] = useState([])

  const getTimes = (justDate) => {
    const beginning = add(justDate, { hours: 8 })
    const end = add(justDate, { hours: 15, minutes: 30 })
    const interval = 30

    let times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      console.log(i)
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
            const bookedTime = add(new Date(session.date_time), { hours: -8 })
            console.log(bookedTime)
            return bookedTime
          })
      : []

    const adjustedTimes = times.filter((time) => {
      return !bookedTimes.some(
        (bookedTime) => Math.abs(differenceInMinutes(time, bookedTime)) <= 115
      )
    })

    return adjustedTimes
  }

  useEffect(() => {
    const fetchCounsellorSession = async () => {
      try {
        const response = await fetch(
          `${HOST}/client/${selectedCounsellor.id}/sessions`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        const data = await response.json()
        console.log('data from BE', data)

        setCounsellorSession(data.sessions || [])
      } catch (error) {
        console.error('An error occurred while retrieving session data:', error)
      }
    }

    if (selectedCounsellor) {
      fetchCounsellorSession()
    }
  }, [selectedCounsellor])

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
      <div className='flex flex-col items-center bg-white'>
        <div className='bg-vanilla border-2  border-dark-blue shadow-lg rounded-lg px-8 py-6 w-3/6'>
          <p className='text-lg mb-8 text-center'>
            Selected Date and Time:
            <span className='font-bold ml-2 dark-blue'>
              {date.dateTime
                ? format(date.dateTime, 'dd/MM/yyyy p')
                : 'None selected'}
            </span>
          </p>

          <h2 className='text-lg mb-2 text-center'>Pick a Date</h2>
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
                if (!selectedCounsellor || !selectedCounsellor.id) {
                  alert(
                    'Please select a counsellor first before selecting your appointment schedule'
                  )
                  return
                }
                setDate((prev) => ({ ...prev, justDate: dateValue }))
                setSelectedDateTime(dateValue)
                setTimes(getTimes(dateValue))
              }}
            />
          </div>

          {times && (
            <div className='flex flex-col gap-4 mt-4'>
              <h2 className='text-lg mb-2 text-center'>Pick a Time</h2>
              <div className='flex gap-2 flex-wrap justify-center'>
                {times.map((time, i) => (
                  <div key={`time-${i}`} className='rounded-sm bg-gray-100 p-2'>
                    <button
                      type='button'
                      className={selectedTimeIndex === i ? 'selected-date' : ''}
                      onClick={() => {
                        setDate((prev) => ({ ...prev, dateTime: time }))
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

          <h2 className='text-lg mb-2'>This counsellor has been booked at </h2>
          {counsellorSession &&
            counsellorSession.map((session, i) => {
              console.log('session.date_time:', session.date_time)

              const dateInUTC = new Date(session.date_time)
              console.log('dateInUTC:', dateInUTC)

              const hours = dateInUTC.getUTCHours()
              const minutes = dateInUTC.getUTCMinutes()

              const formattedDate =
                formatDateInZone(dateInUTC, 'dd/MM/yyyy') +
                ' ' +
                String(hours).padStart(2, '0') +
                ':' +
                String(minutes).padStart(2, '0') +
                ':00'
              console.log('formattedDate:', formattedDate)

              return (
                <div key={i}>
                  <h3>{formattedDate}</h3>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default AppointmentBooking
