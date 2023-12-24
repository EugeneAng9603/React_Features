import React, {useState, useEffect, useReducer, useRef} from "react";
import './App.css';
import axios, {isCancel, AxiosError} from 'axios';

// action is an object taken in during dispatch
function reducer(state, action) {
  switch(action.type) {
    case 'increment': 
      return {value: state.value + action.num, 
              text: state.text + action.text, 
              count: state.count + 1}
    case 'decrement': 
      return {value: state.value - action.num, 
              text: action.text + state.text,
              count: state.count + 1} 
    default:
      throw new Error('Unknown action!')
  }
}

function App() {

  const [countLift, setCountLift] = useState(0);
  const [state, dispatch] = useReducer(reducer, {
    value: 1,
    count: 0,
    text: "Add here:"
  });

  return (
    <div 
    //className="App"
    display="flex" flex-direction="row"
    >
      <h1> Start Coding</h1>
      <h2>1. Increment counter</h2>
      
      <Counter starting={5}/>
      <Counter starting={0}/>

      <h2>1.1 Increment counter</h2>
      <CounterSetWithinEvent/>

      <h2>2. Lifting state up, multiple components share same state
        Not only within the state(cuz state are on direction, from parents down)
      </h2>
     
      <CountLift countLift={countLift} setCountLift={setCountLift}/>
      <CountLift countLift={countLift} setCountLift={setCountLift}/>

      <h2>3. Use Reducer and dispatch state anytime</h2>
      <ReducerState 
          value={state.value} 
          text={state.text}
          count={state.count}
          onClick={() => dispatch({
            type: 'increment',
            count: 1,
            num: 3,
            text: " Added 3 "
          })}
        />
      <ReducerState 
          value={state.value} 
          text={state.text}
          count={state.count}
          onClick={() => dispatch({
            type: 'decrement',
            count: 1,
            num: 3,
            text: " Minus 3 "
          })}
        />

      <h2>4. Fetch an API </h2>
      <FetchData 
        // randomUserData = {randomUserData}
        // setRandomUserData = {setRandomUserData}
        // userInfo = {userInfo}
        // setUserInfo = {setUserInfo}
      />

      <h2>5. Fetch an API by Searching users </h2>
      <SearchUser/>


      <h2>6. Click button to fetch data </h2>
      <ClickToFetchData/>

      <h2>7. Click button to fetch random user </h2>
      <ClickForRandomUser/>

      <h2>8. useRef myfocusForm </h2>
      <p> See Code</p>

      <h2> 9. createContext </h2>

    </div>
  )
}


// 8. UseRef focus - expose a ref value to bind with DOM element, to manipulate DOM instantly
// creating a reference to the input field (inputRef), .
// and upon pressing the button, you are referencing 
// the inputRef and running the focus method on it.

// import {useRef} from 'react';
// function App() {
// const inputRef = useRef(null);

// return (
// <div >
// <input ref={inputRef}/>
// <button onClick={() => {inputRef.current.focus()}}>Focus input</button>
// </div>
// );
// }
 


// 7. Async-await click to fetch without useEffect for first render
// REMINDER!! if use 2 useState for same object, it will remain stale for setUserArr
const ClickForRandomUser = () => {
  // KEY POINT! initialise with results:[] , so [] or data.results can map
  const [data, setData] = useState({results: []});
  //const [data, setData] = useState([]); // if use this, Cannot read properties of undefined (reading 'map')
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  //const [userArr, setUserArr] = useState([]);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://randomuser.me/api', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('result is: ', JSON.stringify(result, null, 4));

      setData(result);
      //setUserArr(data.results);
      
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  //console.log(data.results[0].name, userArr[0].name);
  // get full name of user
  const GetFullName = (userInfo) => {
    const {name: {title, first, last}} = userInfo;
    return `${first} ${last}`;
  }

  // get thumbnail
  const GetThumbNail = (userInfo) => {
    const {picture: {large, medium, thumbnail}} = userInfo;
    return `${large}`
  }

  return (
    <div>
      {err && <h2>{err}</h2>}

      <button onClick={handleClick}>Click to fetch a random user</button>

      {isLoading && <h2>Loading...</h2>}
      {/* {data.results.map((info, index) => (
                <div key={index}>
                    <p>{GetFullName(info)}</p>
                    <img src={GetThumbNail(info)}/>
                </div>
            ))
      }  */}
      {data.results.map((info, index) => (
                <div key={index}>
                    <p>{GetFullName(info)}</p>
                    <img src={GetThumbNail(info)}/>
                </div>
            ))}

      <pre>data is {JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};


// 6. Fetch data on click

const ClickToFetchData = () => {
  const [data, setData] = useState({data: []});
  //const [data, setData] = useState([]); // if use this, Cannot read properties of undefined (reading 'map')
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('result is: ', JSON.stringify(result, null, 4));

      setData(result);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  //console.log(data);

  return (
    <div>
      {err && <h2>{err}</h2>}

      <button onClick={handleClick}>Fetch data</button>

      {isLoading && <h2>Loading...</h2>}

      {data.data.map(person => {
        return (
          <div key={person.id}>
            <h2>{person.email}</h2>
            <h2>{person.first_name}</h2>
            <h2>{person.last_name}</h2>
            <img src={person.avatar}/>
            <br />
          </div>
        );
      })
      
      }
    </div>
  );
};


// 5. Fetch data with query
const SearchUser = () => {
  const [users, setUsers] = useState([])

  const fetchData = e => {
    const query = e.target.value
    fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
  }

  return (
    <>
      <div>
      <input onChange={fetchData} label="Search User" />
      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      
    </div>
    </>
    
  )
}

// 4. Fetch random data
function FetchData() {

  const [randomUserData, setRandomUserData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  
  // function for fetchting data
    const FetchDataFunc = () => {
      useEffect( () => {
            fetch('https://randomuser.me/api')
          .then( (response) => {
            return response.json();
          })
          .catch(err => {
            console.log(err)
          })
          .then(data => {
            setRandomUserData(data);
            setUserInfo(data.results);
          })
      }, []);
    }

    console.log(randomUserData);


    // get full name of user
    const GetFullName = (userInfo) => {
      const {name: {title, first, last}} = userInfo;
      return `${first} ${last}`;
    }

    // get thumbnail
    const GetThumbNail = (userInfo) => {
      const {picture: {large, medium, thumbnail}} = userInfo;
      return `${large}`
    }

  return (
    <>
    {/* <button 
       onClick={FetchDataFunc()}
        >
        Click here to fetch data
       </button> */}
       {FetchDataFunc()}

       <pre>
        {/*    userInfo: {userInfo} */}
        randomUserData: {JSON.stringify(randomUserData, null, 2)}
       </pre>
       
        {userInfo.map((info, index) => (
                <div key={index}>
                    <p>{GetFullName(info)}</p>
                    <img src={GetThumbNail(info)}/>
                </div>
            ))}
    </>
  )
}


// 3. Use Reducer when state changes in many ways
// like login etc.
function ReducerState({value, text, count, onClick}) {
  return (
    <>
      <button onClick={onClick}>
            Press first button to +3, second to -3
      </button>
          <p>Value: {value} , Count: {count}  </p>
          <p>{text}</p>
    </>
  )
}

// 2. Lifting stateup
function CountLift({countLift, setCountLift}) {
  return (
    <>
    <button onClick={() => {
      setCountLift(countLift + 1);
      //console.log(countLift);
     } 
    }>
          Lift Increment
    </button>
        <p>Lift Count: {countLift} </p>
  </>
  )
}

// 1.1 Setstate for multiple times within event 
// alert 5, then value become 10
function CounterSetWithinEvent() {
  const [counter, setCounter] = useState(5);

  return (
    <>
      <span>{counter}</span>
      <button onClick={() => {
        // this will add 5 each render, alert current state. e.g. alert 5, render 10
        // setCounter(counter + 5); 
        // setCounter(counter + 5);
        // alert(counter);
        // setCounter(counter + 5);
        // setCounter(counter + 5);

        // this will add 20 each render, alert current state. e.g. alert 5, render 25
        setCounter(prev => prev + 5);
        setCounter(prev => prev + 5);
        alert(counter);
        setCounter(prev => prev + 5);
        setCounter(prev => prev + 5);
      }}>Increment</button>
    </>
  )
}

// 1. increment counter
function Counter({starting}) {
  const [counter, setCounter] = useState(starting);
  const [otherCount, setOtherCount] = useState(starting);
  return (
    <>
    {/* <button onClick={() => {
      // Counter comp will not re-render until all func done in stack
      // so every setCounter, the state goes back to currState
      // and only add by 1
      setCounter(counter + 1)
      setCounter(counter + 1)
      setCounter(counter + 1)
     } 
    }> */}

    {/* so use this */ }
    <button onClick={() => {
      setCounter(prev => prev + 1)
      setCounter(prev => prev + 1)
      setCounter(prev => prev + 1)
      {/* if have other set function, the state will be batched tgt
        re-render until all state are updated
      */ }
     } 
    }>
          Increment
    </button>
        <p>Count: {counter} </p>

    <button onClick={ () => {
      setOtherCount(prev => prev + 10)
    }}
    
    >
      Increment by 10
    </button>
    <p>Other Count: {otherCount} </p>
  </>
  
  )
}

export default App;

