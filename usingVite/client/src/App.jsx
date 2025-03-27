import { useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DisplayMenu from "./components/DisplayMenu.jsx"
import FoodReview from "./components/FoodReview.jsx"
import DisplayHalls from "./components/DisplayHalls.jsx"
import axios from 'axios'
import './App.css'

function App() {
  const [data,setData] = useState([{}])
  const fetchMenu = async () =>{
    const response = await axios.get("http://localhost:5000/")
    console.log(response, "fetchMenu from App.jsx")
    setData(response.data)
  };
  useEffect(() =>{
    fetchMenu();
  }, [])
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/" element = {<DisplayHalls/>}/>
          <Route path = "/display" element = {<DisplayMenu dict = {data}/>}/> {/* "/:hallName" */}
          <Route path = "/:foodItem" element = {<FoodReview/>} />
        </Routes>
      </Router>
   </div>
  )
}

export default App
