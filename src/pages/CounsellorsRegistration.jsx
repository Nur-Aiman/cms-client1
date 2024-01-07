import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

function CounsellorRegistration() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [designation, setDesignation] = useState('')
  const [education, setEducation] = useState('')
  const [university, setUniversity] = useState('')
  const [past_experience, setPast_experience] = useState('')
  const [personality, setPersonality] = useState('')
  const [tagline, setTagline] = useState('')
  const [key_interest, setKey_interest] = useState([])

  const [past_experiences, setPast_experiences] = useState([
    { company: '', role: '' },
  ])
  const [character, setCharacter] = useState('')
  const [values, setValues] = useState('')
  const [belief, setBelief] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [race, setRace] = useState('')
  const [nationality, setNationality] = useState('')
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [Tooltip, setTooltip] = useState(false)
  const [taglineTooltip, setTaglineTooltip] = useState(false)
  const [interestTooltip, setInterestTooltip] = useState(false)
  const [passwordTooltip, setPasswordTooltip] = useState(false)
  const [characterTooltip, setCharacterTooltip] = useState(false)
  const [valuesTooltip, setValuesTooltip] = useState(false)
  const [beliefTooltip, setBeliefTooltip] = useState(false)
  const [hobbiesTooltip, setHobbiesTooltip] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const addExperience = () => {
    setPast_experiences([...past_experiences, { company: '', role: '' }])
  }

  const addInterest = (interest) => {
    setKey_interest((prevInterests) => [...prevInterests, interest])
  }

  const handleInterestChange = (e) => {
    const interests = e.target.value.split(',')
    setKey_interest(interests)
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...past_experiences]
    newExperiences[index][field] = value
    setPast_experiences(newExperiences)
  }
  useEffect(() => {
    const formattedExperiences = past_experiences.reduce((acc, curr, idx) => {
      acc[`Exp ${idx + 1}`] = `${curr.role} at ${curr.company}`
      return acc
    }, {})
  }, [
    username,
    email,
    password,
    designation,
    education,
    university,
    race,
    nationality,
    character,
    values,
    belief,
    hobbies,
    tagline,
    key_interest,
    past_experiences,
  ])

  useEffect(() => {
    if (!loading && user && user.role === 'client') {
      setLoggedInUser(user)
      // console.log('decoded', user)
    } else if (!loading && (!user || user.role !== 'admin')) {
      navigate('/user/login')
    }
  }, [user, loading])

  async function registerCounsellor(event) {
    event.preventDefault()

    const formattedExperiences = past_experiences.reduce((acc, curr, idx) => {
      acc[`Exp ${idx + 1}`] = `${curr.role} at ${curr.company}`
      return acc
    }, {})

    const response = await fetch(`${HOST}/admin/registerCounsellor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password,
        designation,
        education,
        university,
        race,
        nationality,
        past_experience: formattedExperiences,
        personality: {
          Character: character,
          Values: values,
          Believe: belief,
          Hobbies: hobbies,
        },
        tagline,
        key_interest: key_interest,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      setErrorMessage(data.message)
      return
    }

    const data = await response.json()
    alert(data.message)
    navigate('/admin/account-manage')
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-dark-blue'>
      <div className='bg-vanilla p-8 rounded-lg shadow-lg w-1/2 mx-auto'>
        <h1 className='text-3xl font-bold mb-10 text-dark text-center'>
          Counsellor Registration
        </h1>
        {errorMessage && (
          <div className='text-red-500 text-center pb-4'>{errorMessage}</div>
        )}
        <form onSubmit={registerCounsellor} className='grid grid-cols-2 gap-5'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <div className='mt-1'>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <div className='mt-1'>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='relative mt-1'>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordTooltip(true)}
                onBlur={() => setPasswordTooltip(false)}
                type='password'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {passwordTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  Password must be at least 8 characters long, contain at least
                  one uppercase letter, one lowercase letter, and one number
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='designation'
              className='block text-sm font-medium text-gray-700'
            >
              Designation
            </label>
            <div className='mt-1'>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='education'
              className='block text-sm font-medium text-gray-700'
            >
              Education
            </label>
            <div className='mt-1'>
              <input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='university'
              className='block text-sm font-medium text-gray-700'
            >
              University
            </label>
            <div className='mt-1'>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          {past_experiences.map((exp, index) => (
            <div key={index} className='flex'>
              <div className='w-1/2 pr-2'>
                <label
                  htmlFor='company'
                  className='block text-sm font-medium text-gray-700'
                >
                  Company {index + 1}
                </label>
                <div className='mt-1'>
                  <input
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, 'company', e.target.value)
                    }
                    type='text'
                    className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  />
                </div>
              </div>
              <div className='w-1/2 pl-2'>
                <label
                  htmlFor='role'
                  className='block text-sm font-medium text-gray-700'
                >
                  Role {index + 1}
                </label>
                <div className='mt-1'>
                  <input
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(index, 'role', e.target.value)
                    }
                    type='text'
                    className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  />
                </div>
              </div>
            </div>
          ))}
          <div className='mt-6 '>
            <button
              type='button'
              onClick={addExperience}
              className='bg-gold  block px-3 py-2 w-1/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            >
              Add experience
            </button>
          </div>

          <div>
            <label
              htmlFor='character'
              className='block text-sm font-medium text-gray-700'
            >
              Character
            </label>
            <div className='relative mt-1'>
              <input
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                onFocus={() => setCharacterTooltip(true)}
                onBlur={() => setCharacterTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {characterTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g. Dedicated, creative, compassionate)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='values'
              className='block text-sm font-medium text-gray-700'
            >
              Values
            </label>
            <div className='relative mt-1'>
              <input
                value={values}
                onChange={(e) => setValues(e.target.value)}
                onFocus={() => setValuesTooltip(true)}
                onBlur={() => setValuesTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {valuesTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g. Kindness, Integrity)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='belief'
              className='block text-sm font-medium text-gray-700'
            >
              Believes
            </label>
            <div className='relative mt-1'>
              <input
                value={belief}
                onChange={(e) => setBelief(e.target.value)}
                onFocus={() => setBeliefTooltip(true)}
                onBlur={() => setBeliefTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {beliefTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g. Recovery is a journey, not a destination)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='hobbies'
              className='block text-sm font-medium text-gray-700'
            >
              Hobbies
            </label>
            <div className='relative mt-1'>
              <input
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                onFocus={() => setHobbiesTooltip(true)}
                onBlur={() => setHobbiesTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {hobbiesTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g. music, reading, traveling)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='tagline'
              className='block text-sm font-medium text-gray-700'
            >
              Tagline
            </label>
            <div className='relative mt-1'>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                onFocus={() => setTaglineTooltip(true)}
                onBlur={() => setTaglineTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {taglineTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g. Empowering You to Live Your Best Life)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='key_interest'
              className='block text-sm font-medium text-gray-700'
            >
              Key Interests
            </label>
            <div className='relative mt-1'>
              <input
                value={key_interest.join(',')} // joins the interests array into a string with commas
                onChange={handleInterestChange}
                onFocus={() => setInterestTooltip(true)}
                onBlur={() => setInterestTooltip(false)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              {interestTooltip && (
                <div className='absolute left-0 top-full mt-2 bg-black text-white text-xs p-1 rounded'>
                  (E.g., anxiety, depression, relationship issues)
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='race'
              className='block text-sm font-medium text-gray-700'
            >
              Race
            </label>
            <div className='mt-1'>
              <input
                value={race}
                onChange={(e) => setRace(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='nationality'
              className='block text-sm font-medium text-gray-700'
            >
              Nationality
            </label>
            <div className='mt-1'>
              <input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                type='text'
                className='block px-3 py-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
            </div>
          </div>

          <div className='col-span-2'>
            <button
              type='submit'
              className='py-2 px-4 w-full text-vanilla bg-dark hover:bg-gold rounded-md mt-auto'
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CounsellorRegistration
