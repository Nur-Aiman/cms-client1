import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { HOST } from '../api'

const counsellorPicture =
  process.env.PUBLIC_URL + '/images/counsellor-profile-photo.png'

const Modal = ({ children, onClose }) => {
  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            {children}
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              onClick={onClose}
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const CounsellorProfile = () => {
  const [counsellor, setCounsellor] = useState(null)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [updatedInfo, setUpdatedInfo] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [updatedPersonality, setUpdatedPersonality] = useState({})
  const [personalityCharacter, setPersonalityCharacter] = useState('')
  const [personalityValues, setPersonalityValues] = useState('')
  const [personalityBelief, setPersonalityBelief] = useState('')
  const [personalityHobbies, setPersonalityHobbies] = useState('')
  const [updatedKeyInterests, setUpdatedKeyInterests] = useState([])
  const [keyInterestsInput, setKeyInterestsInput] = useState('')
  const [experience1, setExperience1] = useState('')
  const [experience2, setExperience2] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const { id: counsellorId } = useParams()

  const fetchCounsellorData = async () => {
    try {
      const response = await fetch(
        `${HOST}/client/counsellors-view/${counsellorId}`
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }
      const data = await response.json()
      setCounsellor(data)
      setUpdatedInfo(data)

      setUpdatedKeyInterests(JSON.parse(data.key_interest) || [])
      setKeyInterestsInput(JSON.parse(data.key_interest).join(', '))
      if (data && data.personality) {
        const personalityObject = JSON.parse(data.personality)
        setPersonalityCharacter(personalityObject.Character || '')
        setPersonalityValues(personalityObject.Values || '')
        setPersonalityBelief(personalityObject.Believe || '')
        setPersonalityHobbies(personalityObject.Hobbies || '')
      }

      if (data && data.past_experience) {
        const experienceObject = JSON.parse(data.past_experience)
        setExperience1(experienceObject['Exp 1'] || '')
        setExperience2(experienceObject['Exp 2'] || '')
      }
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
      console.log('Fetching error', error)
      setIsLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${HOST}/api/current_user`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      console.log('user', data.loggedInUser)
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchCounsellorData()
    fetchUserData()
    setIsLoading(false)
    if (!loading && user) {
      console.log('User ID', user.id)
      setLoggedInUser(user)
      // setLoading(false);
    }
  }, [counsellorId, user, loading])

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading!!!...</p>
      </div>
    )

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500 text-center pb-4'>Error: {error}</p>
      </div>
    )
  }

  console.log('counsellor loading', counsellor)

  const handleUpdate = async () => {
    const personalityObject = {
      Character: personalityCharacter,
      Values: personalityValues,
      Believe: personalityBelief,
      Hobbies: personalityHobbies,
    }
    const keyInterestsArray = keyInterestsInput
      .split(',')
      .map((interest) => interest.trim())
    const experienceObject = {
      'Exp 1': experience1,
      'Exp 2': experience2,
    }

    try {
      const response = await fetch(`${HOST}/counsellor/${counsellorId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedInfo,
          personality: JSON.stringify(personalityObject),
          key_interest: JSON.stringify(keyInterestsArray),
          past_experience: JSON.stringify(experienceObject),
        }),
      })

      const data = await response.json()

      console.log('data after update', data)
      setCounsellor(data.counsellor)
      setUpdatedInfo(data.counsellor)
      setShowModal(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target

    if (name === 'personality') {
      try {
        value = JSON.parse(value)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    })
  }
  if (!counsellor && !editMode) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>LLoading...</p>
      </div>
    )
  }

  const {
    username,
    updated_at,
    university,
    tagline,
    services,
    role,
    personality,
    past_experience,
    key_interest,
    id,
    email,
    education,
    designation,
    created_at,
  } = editMode ? updatedInfo : counsellor

  const personalityObject = JSON.parse(personality)
  const pastExperienceObject = JSON.parse(past_experience)
  const keyInterestsArray = JSON.parse(key_interest)

  const handleBookAppointment = () => {
    console.log('go to booking page')
    navigate('/client/appointment-booking')
  }

  return (
    <div className='min-h-screen bg-dark-blue'>
      <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

      <div className='bg-vanilla mx-auto mt-8 rounded-lg shadow-xl max-w-4xl p-12'>
        <div className='mb-6'>
          {editMode ? (
            <input
              name='username'
              value={username}
              onChange={handleChange}
              className='border border-gray-300 rounded p-2 w-full mb-4'
            />
          ) : (
            <h2 className='text-3xl font-semibold text-gray-800 mb-2'>
              {username}
            </h2>
          )}
          <div className='flex'>
            <div className='w-1/2 bg-white p-12 rounded-r-lg shadow-xl mr-2'>
              {loggedInUser?.role === 'counsellor' &&
                loggedInUser.id === parseInt(counsellorId, 10) && (
                  <div className='flex'>
                    <button
                      className='ml-2 py-2 px-4 text-white bg-blue-500 rounded-md shadow-md'
                      onClick={() => setShowModal(true)}
                    >
                      Edit
                    </button>
                    {editMode && (
                      <div className='flex ml-4'>
                        <button
                          className='py-2 px-4 text-white bg-red-500 rounded-md shadow-md'
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className='ml-2 py-2 px-4 text-white bg-green-500 rounded-md shadow-md'
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                )}
              {editMode ? (
                <input
                  name='tagline'
                  value={tagline}
                  onChange={handleChange}
                  className='border border-gray-300 rounded p-2 w-full mt-4'
                />
              ) : (
                <div>
                  <img
                    src={counsellorPicture}
                    alt='Counsellor'
                    className='mx-auto h-48 w-48 rounded-full'
                  />
                  <p className='italic text-xl text-gray-600 font-medium mt-4'>
                    {tagline}
                  </p>
                </div>
              )}

              <div className='mt-4 text-gray-500'>
                <p>University: {university}</p>
                <p>Email: {email}</p>
                <p>Education: {education}</p>
                <p>Designation: {designation}</p>
              </div>
            </div>

            <div className='w-1/2 bg-white p-12 rounded-r-lg shadow-xl ml-2'>
              <div className='mb-6'>
                <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
                  Personality
                </h3>
                {Object.entries(personalityObject).map(([key, value]) => (
                  <p
                    className='text-lg text-gray-600 mt-2'
                    key={key}
                  >{`${key}: ${value}`}</p>
                ))}
              </div>

              <div className='mb-6'>
                <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
                  Past Experience
                </h3>
                {Object.entries(pastExperienceObject).map(([key, value]) => (
                  <p
                    className='text-lg text-gray-600 mt-2'
                    key={key}
                  >{`${value}`}</p>
                ))}
              </div>

              <div className='mb-6'>
                <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
                  Key Interests
                </h3>
                {keyInterestsArray.map((interest, index) => (
                  <p className='text-lg text-gray-600 mt-2' key={index}>
                    {interest}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loggedInUser?.role === 'client' && (
          <button
            className='mt-6 py-2 px-4 text-white bg-blue-500 rounded-md shadow-md w-full'
            onClick={handleBookAppointment}
          >
            Book Now
          </button>
        )}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Username:
                </label>
                <input
                  name='username'
                  value={updatedInfo.username}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Tagline:
                </label>
                <input
                  name='tagline'
                  value={updatedInfo.tagline}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  University:
                </label>
                <input
                  name='university'
                  value={updatedInfo.university}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Email:
                </label>
                <input
                  name='email'
                  value={updatedInfo.email}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Education:
                </label>
                <input
                  name='education'
                  value={updatedInfo.education}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Designation:
                </label>
                <input
                  name='designation'
                  value={updatedInfo.designation}
                  onChange={handleChange}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Character:
                </label>
                <input
                  name='personalityCharacter'
                  value={personalityCharacter}
                  onChange={(e) => setPersonalityCharacter(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Values:
                </label>
                <input
                  name='personalityValues'
                  value={personalityValues}
                  onChange={(e) => setPersonalityValues(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Belief:
                </label>
                <input
                  name='personalityBelief'
                  value={personalityBelief}
                  onChange={(e) => setPersonalityBelief(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Hobbies:
                </label>
                <input
                  name='personalityBelief'
                  value={personalityHobbies}
                  onChange={(e) => setPersonalityHobbies(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Key Interests:
                </label>
                <input
                  name='keyInterests'
                  value={keyInterestsInput}
                  onChange={(e) => setKeyInterestsInput(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Experience 1:
                </label>
                <input
                  name='experience1'
                  value={experience1}
                  onChange={(e) => setExperience1(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Experience 2:
                </label>
                <input
                  name='experience2'
                  value={experience2}
                  onChange={(e) => setExperience2(e.target.value)}
                  className='mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <button
                onClick={handleUpdate}
                className='w-full py-2 px-4 text-white bg-blue-500 rounded-md focus:outline-none'
              >
                Update
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default CounsellorProfile
