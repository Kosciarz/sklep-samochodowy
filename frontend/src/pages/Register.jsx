import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/AuthProvider";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (password != passwordRepeat) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const user = {
        email: email,
        password: password,
      };

      const url = "http://localhost:8080/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Failed to send POST request: ${response.status}`);
      }

      const { token } = await response.json();
      login(token);

      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <Card.Title className="mb-4">Create Account</Card.Title>

              <Form>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-4"
                  controlId="confirmPassword"
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  onClick={(e) => submit(e)}
                >
                  Create Account
                </Button>

                <Button
                  variant="link"
                  className="w-100 mt-2"
                  as={Link}
                  to="/login"
                >
                  Already have an account? Sign In
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
