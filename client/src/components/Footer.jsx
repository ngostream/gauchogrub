import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Box from '@mui/material/Box'
import Container from 'react-bootstrap/Container';
import "../App.css";
export default function Footer(){
    return(
      <div style = {{backgroundColor: "rgb(248, 249, 250)", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1030 }}>
      <Box component = "medium">
        <Container>
          <p className = "flexCenter pt-3">Developed by Alvin Lee and Nathan Ngo 2025</p>
        </Container>
      </Box>
    </div>
    )
}