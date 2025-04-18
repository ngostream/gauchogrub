import React from 'react';
import NavigationBar from './Nav.jsx'; // Assuming it's named NavigationBar.jsx

function About() {
  return (
    <>
      <NavigationBar />
      <div className="container mt-4">
        <h1>About Gaucho Grubz</h1>
        <p>
          Gaucho Grubz helps UCSB students check what's being served at dining halls and rate their favorite dishes.
          Built with love by students, for students.
        </p>
      </div>
    </>
  );
}

export default About;
