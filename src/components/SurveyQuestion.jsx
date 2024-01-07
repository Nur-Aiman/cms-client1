import { useState } from 'react'

function SurveyQuestion({ surveyAnswers, setSurveyAnswers }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleAnswerChange = (event) => {
    const newAnswers = [...surveyAnswers]
    newAnswers[currentQuestionIndex] = event.target.value
    setSurveyAnswers(newAnswers)
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
    <div className='p-6 bg-vanilla rounded shadow-lg w-4/5 mx-auto'>
      <h2 className='text-lg font-bold mb-2'>
        Survey Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      <div className='mb-2 overflow-auto max-h-24'>
        <p className='text-lg'>{questions[currentQuestionIndex]}</p>
      </div>
      <textarea
        className='w-full h-64 p-2 border-2 border-dark rounded text-base'
        value={surveyAnswers[currentQuestionIndex]}
        onChange={handleAnswerChange}
      />
      <div className='mt-4 flex justify-center flex-wrap'>
        {questions.map((question, index) => (
          <button
            key={index}
            className={` m-1 px-2 py-1 rounded font-bold text-base ${
              currentQuestionIndex === index
                ? 'bg-dark text-white'
                : 'bg-gray-200 text-dark'
            }`}
            disabled={currentQuestionIndex === index}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SurveyQuestion
