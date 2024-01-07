function MainIssue({ mainIssue, setMainIssue }) {
  const handleIssueChange = (event) => {
    setMainIssue(event.target.value)
  }

  return (
    <div className='px-8 py-4 bg-vanilla rounded-lg shadow-lg w-4/5 mx-auto'>
      <textarea
        id='main-issue'
        rows={6}
        value={mainIssue}
        onChange={handleIssueChange}
        className='w-full p-2 h-64 bg-white text-gray-700  rounded-lg border-2 border-dark'
        placeholder='Describe your main issue with us'
      />
    </div>
  )
}

export default MainIssue
