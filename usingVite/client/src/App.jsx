import { useState, useEffect} from 'react'
import DisplayMenu from "./components/DisplayMenu.jsx"
import axios from 'axios'
import './App.css'

function App() {
  const [data,setData] = useState([{}])
  const fetchMenu = async () =>{
    const response = await axios.get("http://localhost:5000/")
    console.log(response)
    setData(response.data)
  };
  useEffect(() =>{
    fetchMenu();
  }, [])
  return (
    <div>
      <DisplayMenu props = {data}/>
  </div>
  )
}

export default App
