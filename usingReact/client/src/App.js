import React, {useState, useEffect} from 'react'

function App(){
  const [data,setData] = useState([{}])

  useEffect(()=>{
    fetch("/menu").then( //fetches from backend thru proxy in package.json
      res =>res.json()
    ).then(
        data=>{
          setData(data)
          console.log(data)
        }
      )
  },[])
  return(
    <div>
      {(typeof data.menu === "undefined")?(
        <p>Loading...</p>
      ) : (
        data.menu.map((item,i)=>{
          return <p key = {i}>{item}</p>
        })
      )}
    </div>
  )
}
export default App