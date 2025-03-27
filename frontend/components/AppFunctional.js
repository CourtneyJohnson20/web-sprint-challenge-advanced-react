import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; 

let x = 2;
let y = 2;
let url = "http://localhost:9000/api/result";

export default function AppFunctional(props) {
  const [values, setValues] = useState({
    vMessage: '',
    vEmail: '',
    vSteps: 0,
    vIndex: 4,
    vCoordMessage: ''
  });

  function updateCoordMessage() {
    const result = getXY(values.vIndex);
    const coordMessage = `Coordinates ${result}`;
    const matches = result.match(/\((\d), (\d)\)/);
    if (matches) {
      x = parseInt(matches[1]);
      y = parseInt(matches[2]);
    }
    setValues(prevValues => ({
      ...prevValues,
      vCoordMessage: coordMessage
    }));
  }


  useEffect(() => {
    updateCoordMessage();
  }, [values.vIndex]); 

  function getXY(coordinate) {
    const grid = [
      '(1, 1)', '(2, 1)', '(3, 1)',
      '(1, 2)', '(2, 2)', '(3, 2)',
      '(1, 3)', '(2, 3)', '(3, 3)'
    ];
    
    return grid[coordinate];
  }

  function reset() {
    setValues({
      vMessage: '',
      vEmail: '',
      vSteps: 0,
      vIndex: 4,
      vCoordMessage: ''
    });
  }

  function getNextIndex(direction) {
    let currentIndex = values.vIndex;
    let newIndex = currentIndex;

    if (direction === 'up') {
      if (currentIndex > 2) {
        newIndex = currentIndex - 3;
        setValues({ ...values, vMessage: "" });
      } else {
        setValues({ ...values, vMessage: "You can't go up" });
      }
    } else if (direction === 'down') {
      if (currentIndex < 6) {
        newIndex = currentIndex + 3;
        setValues({ ...values, vMessage: "" });
      } else {
        setValues({ ...values, vMessage: "You can't go down" });
      }
    } else if (direction === 'left') {
      if (currentIndex % 3 !== 0) {
        newIndex = currentIndex - 1;
        setValues({ ...values, vMessage: "" });
      } else {
        setValues({ ...values, vMessage: "You can't go left" });
      }
    } else if (direction === 'right') {
      if (currentIndex % 3 !== 2) {
        newIndex = currentIndex + 1;
        setValues({ ...values, vMessage: "" });
      } else {
        setValues({ ...values, vMessage: "You can't go right" });
      }
    }

    return newIndex;
  }

  function move(direction) {
    const newIndex = getNextIndex(direction);

    if (newIndex !== values.vIndex) {
      setValues(prevValues => ({
        ...prevValues,
        vIndex: newIndex,
        vSteps: prevValues.vSteps + 1
      }));
    }
  }

  function onChange(evt) {
    let { value } = evt.target;
    setValues({
      ...values, vEmail: value
    });
  }

  function submit() {
    axios.post(url, {
      x: x,
      y: y,
      steps: values.vSteps,
      email: values.vEmail
    })
    .then(res => {
      console.log(res);
      setValues(prevValues => ({
        ...prevValues, vMessage: res.data.message
      }));
    })
    .catch(res => {
      console.log(res);
      setValues(prevValues => ({
        ...prevValues, vMessage: res.response.data.message
      }));
    });
  }

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function onSubmit(evt) {
  evt.preventDefault();


    if (values.vEmail === '') {
      setValues(prevValues => ({
        ...prevValues,
        vMessage: 'Ouch: email is required.' 
      }));
      return; 
    }


    if (values.vEmail === 'foo@bar.baz') {
      setValues({
        ...values, 
        vMessage: 'foo@bar.baz failure #71'
    });
      return; 
    }

    if (!isEmailValid(values.vEmail)) {
      setValues(prevValues => ({
        ...prevValues,
        vMessage: 'Ouch: email must be a valid email.' 
      }));
      return; 
    }

    setValues(prevValues => ({
      ...prevValues,
      vMessage: '',
      vEmail: ''
    }));

    submit(); 
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{values.vCoordMessage}</h3>
        <h3 id="steps">You moved {values.vSteps} time{values.vSteps === 1 ? '' : 's'}</h3>
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
  );
}
