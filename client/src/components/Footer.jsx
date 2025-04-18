import React from 'react'
import Box from '@mui/material/Box'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
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
        borderTop: "1px solid #dee2e6",
        padding: "0.75rem 0",
        fontSize: "0.9rem",
        textAlign: "center",
      }}>
        <Box component="div">
        <Container>
          <p style={{ margin: 0 }}>
            © 2025 Alvin Lee & Nathan Ngo ·{" "}
            <a
              href = "https://docs.google.com/forms/d/e/1FAIpQLSfbYSMvWoCtdQRXVg7RVgyFUJmo383M4MCaYqRk7Zz3vszLJw/viewform?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "underline",
                color: "#007bff",
                cursor: "pointer",
              }}
            >
            Leave Feedback
            </a>
          </p>
        </Container>
      </Box>
    </footer>
    );
  }