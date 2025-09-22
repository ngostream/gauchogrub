import { useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DisplayMenu from "./components/DisplayMenu.jsx"
import FoodReview from "./components/FoodReview.jsx"
import DisplayHalls from "./components/DisplayHalls.jsx"
import About from "./components/About.jsx"
import axios from 'axios'
import './App.css'
import CircularProgress from '@mui/material/CircularProgress';
import Footer from './components/Footer.jsx';

function App() {
  const [data,setData] = useState([{}])
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);

  const loadingMessages = [
    "Checking what's cooking…",
    "Grabbing your favorite bites...",
    "Plating today's dishes...",
    "Buying more swipes...",
    "Whipping up the menu...",
  ];
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  const fetchMenu = async () =>{
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
    console.log(response, "fetchMenu from App.jsx")
    setData(response.data)
    setLoading(false)
  };

  useEffect(() => {
    // 10 second timer until slow loading message
    const slowTimer = setTimeout(() => setSlowLoading(true), 10000);

    const fetch = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
        console.log(response, "fetchMenu from App.jsx");
        setData(response.data);
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        clearTimeout(slowTimer);
        setLoading(false);
      }
    };

    fetch();

    return () => clearTimeout(slowTimer);
  }, []);
  
if (loading) {
  return (
    <div style={{ textAlign: 'center', marginTop: '25vh' }}>
      <CircularProgress size={60} />
      <p style={{ marginTop: '1rem' }}>
        {slowLoading
          ? "Still cooking… thanks for waiting!"
          : randomMessage}
      </p>
    </div>
  );
}

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Router>
          <Routes>
            <Route path = "/" element = {<DisplayHalls/>}/>
            <Route path = "/about" element = {<About />}/>
            <Route path = "/:hN" element = {<DisplayMenu dict = {data}/>}/>
            <Route path = "/:hN/:foodItem" element = {<FoodReview/>} />
          </Routes>
        </Router>
      </div>
  <Footer />
    </div>
  )
}

export default App