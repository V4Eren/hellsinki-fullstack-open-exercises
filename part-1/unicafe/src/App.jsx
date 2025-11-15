import { useState } from 'react'

//Button element
const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}

//Handles one unit of statistics
const StatisticsLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

//Handles all statistics for the website
const Statistics = ({good, neutral, bad}) => {
  //Find averages and positive comment rates
  const total = good + neutral + bad
  const average = (good - bad)/total 
  const positive = (good/total)*100.0

  if (total === 0) {
    return(
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good}/>
        <StatisticsLine text="neutral" value={neutral}/>
        <StatisticsLine text="bad" value={bad}/>
        <StatisticsLine text="average" value={average}/>      
        <StatisticsLine text="positive" value={positive + "%"}/>
      </tbody>
    </table>    
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodReview = () => {
    const newGood = good + 1
    //console.log("Good reviews " + newGood)
    setGood(newGood)
  }
  
  const handleNeutralReview = () => {
    const newNeutral = neutral + 1
    //console.log("Neutral reviews " + newNeutral)
    setNeutral(newNeutral)
  }

  const handleBadReview = () => {
    const newBad = bad + 1
    //console.log("Bad reviews " + newBad)
    setBad(newBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodReview} text={"good"}/>
      <Button handleClick={handleNeutralReview} text={"neutral"}/>
      <Button handleClick={handleBadReview} text={"bad"}/>
      
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App