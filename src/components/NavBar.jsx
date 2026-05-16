import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Sklep Samochodowy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cart">
              Koszyk
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
