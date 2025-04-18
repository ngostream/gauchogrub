import React from 'react'
import Box from '@mui/material/Box'
import Container from 'react-bootstrap/Container';
import "../App.css";

export default function Footer(){
    return(
      <footer style={{
        backgroundColor: "rgb(248, 249, 250)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        borderTop: "1px solid #dee2e6", // subtle top border
        padding: "0.75rem 0", // breathing room
        fontSize: "0.9rem",
        textAlign: "center",  // centered on all screens
      }}>
        <Box component="div">
        <Container>
          <p style={{ margin: 0 }}>
            © 2025 Alvin Lee & Nathan Ngo
          </p>
        </Container>
      </Box>
    </footer>
    );
  }