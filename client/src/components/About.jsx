import React from 'react';
import Nav from './Nav.jsx'; 
import Footer from './Footer.jsx';

function About() {
  return (
    <>
      <Nav/>
      <div className="container mt-4">
        <h1>About Gaucho Grubz</h1>
        <p>
          Gaucho Grubz helps UCSB students check what's being served at dining halls and rate their favorite dishes.
          Built with love by students, for students.
        </p>
      </div>
      <Footer/>
    </>
  );
}

export default About;
