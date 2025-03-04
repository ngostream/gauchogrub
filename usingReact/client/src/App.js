import React, {useState, useEffect} from 'react'
import DisplayMenu from './DisplayMenu.js'
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
      <DisplayMenu props = {data}/>
    </div>
  )
}
export default App

/*

<p>{data}</p>

      {(typeof data.menu === "undefined")?(
        <p>Loading...</p>
      ) : (
        data.menu.map((item,i)=>{
          return <p key = {i}>{}</p>
        })
      )}
*/