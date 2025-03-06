import { useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DisplayMenu from "./components/DisplayMenu.jsx"
import FoodReview from "./components/FoodReview.jsx"
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
      <Router>
        <Routes>
          <Route path = "/" element = {<DisplayMenu dict = {data}/>}/>
          <Route path = "/:foodItem" element = {<FoodReview/>} />
        </Routes>
      </Router>
   </div>
  )
}
//<DisplayMenu dict = {data}/>

export default App
