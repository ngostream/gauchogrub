import { useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DisplayMenu from "./components/DisplayMenu.jsx"
import FoodReview from "./components/FoodReview.jsx"
import DisplayHalls from "./components/DisplayHalls.jsx"
import About from "./components/About.jsx"
import axios from 'axios'
import './App.css'

function App() {
  const [data,setData] = useState([{}])
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);

  const fetchMenu = async () =>{
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
    console.log(response, "fetchMenu from App.jsx")
    setData(response.data)
    setLoading(false)
  };
  useEffect(() =>{
    fetchMenu();
  }, [])

  useEffect(() => {
    const slowTimer = setTimeout(() => setSlowLoading(true), 5000);
    // 5 second timer
    // fire off the fetch, then clear the timer once it finishes (success or error)
    fetchMenu()
    .catch(() => {"error loading"})
    .finally(() => clearTimeout(slowTimer));
    // cleanup in case the component unmounts early
    return () => clearTimeout(slowTimer);
  }, []);
  
  if (loading){
    return (
    <div>
      {slowLoading
      ? "It's taking a while… please wait."
      : "loading..."}
    </div>
    )
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/" element = {<DisplayHalls/>}/>
          <Route path = "/about" element = {<About />}/>
          <Route path = "/:hN" element = {<DisplayMenu dict = {data}/>}/>
          <Route path = "/:hN/:foodItem" element = {<FoodReview/>} />
        </Routes>
      </Router>
   </div>
  )
}

export default App