import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

function NavigationBar() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/img/logoproto.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Gaucho Grubz
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Carrillo%20Dining%20Commons">Carrillo</Nav.Link>
            <Nav.Link as={Link} to="/Portola%20Dining%20Commons">Portola</Nav.Link>
            <Nav.Link as={Link} to="/De%20La%20Guerra%20Dining%20Commons">De La Guerra</Nav.Link>
            <Nav.Link as={Link} to="/Ortega%20Takeout">Ortega</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;