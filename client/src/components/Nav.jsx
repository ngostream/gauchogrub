import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Nav() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
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
        </Container>
      </Navbar>
    </>
  );
}

export default Nav;