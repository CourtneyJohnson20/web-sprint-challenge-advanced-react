import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

let coordMesage = ''
let x = 2
let y = 2
let url = "http://localhost:9000/api/result"

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [values, setValues] = useState({
    vMessage: '',
    vEmail: '',
    vSteps: 0,
    vIndex: 4,
    success: '',
    failure: ''
  })

  /*useEffect(() => {
    console.log(values)
    
  }, [values])*/

  function getXY(coordinate) {

    let grid = [
      '(1, 1)', '(2, 1)', '(3, 1)',
      '(1, 2)', '(2, 2)', '(3, 2)',
      '(1, 3)', '(2, 3)', '(3, 3)'
    ]

    return grid[coordinate]
    
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

  }


  function getXYMessage() {
    let result = getXY(values.vIndex)
    coordMesage = `Coordinates ${result}`
    x = parseInt(result[1])
    y = parseInt(result[4])
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }
  getXYMessage()
  

  function reset() {
    setValues({
      vMessage: '',
      vEmail: '',
      vSteps: 0,
      vIndex: 4
    })
    
    // Use this helper to reset all states to their initial values.
  }

  
  
  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
      let currentIndex = values.vIndex;
      let newIndex = currentIndex;
    
      if (direction === 'up') {
        if ( currentIndex > 2) {
          newIndex = currentIndex - 3
          setValues({...values, vMessage: ""})
        } else {
          setValues({...values, vMessage: "You can't go up"})
        }
      }
      else if (direction === 'down') {
        if ( currentIndex < 6) {
          newIndex = currentIndex + 3
          setValues({...values, vMessage: ""})
        } else {
          setValues({...values, vMessage: "You can't go down"})
        }
      }
      else if (direction === 'left') {
        if ( currentIndex % 3 !== 0) {
          newIndex = currentIndex - 1
          setValues({...values, vMessage: ""})
        } else {
          setValues({...values, vMessage: "You can't go left"})
        }
      }
      else if (direction === 'right') {
        if ( currentIndex % 3 !== 2) {
          newIndex = currentIndex + 1
          setValues({...values, vMessage: ""})
        } else {
          setValues({...values, vMessage: "You can't go right"})
        }
      }
    
      return newIndex;
    }

  function move(direction) {
    const newIndex = getNextIndex(direction)

    if (newIndex !== values.vIndex) {
      setValues(prevValues => ({
        ...prevValues,
        vIndex: newIndex,
        vSteps: prevValues.vSteps + 1 // Increment step counter
      }))
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
   let { value } = evt.target
    setValues({
      ...values, vEmail: value
    })
  }

  function submit() {
    axios.post(url , {
      x: x,
      y: y,
      steps: values.vSteps,
      email: values.vEmail
    })
    .then(res => {
      console.log(res)
      setValues(prevValues => ({
        ...prevValues, vMessage: res.data.message
      }))
      
    })
    .catch(res => {
      console.log(res)
      setValues(prevValues => ({
        ...prevValues, vMessage: res.message
      }))
      debugger
      
    })
  }
  function onSubmit(evt) {
    evt.preventDefault()
    reset()
    submit()
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{coordMesage}</h3>
        <h3 id="steps">You moved {values.vSteps} time{values.vSteps == 1 ? '' : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === values.vIndex ? ' active' : ''}`}>
              {idx === values.vIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{values.vMessage}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => move('left')} id="left">LEFT</button>
        <button onClick={() => move('up')} id="up">UP</button>
        <button onClick={() => move('right')} id="right">RIGHT</button>
        <button onClick={() => move('down')} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={values.vEmail} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
