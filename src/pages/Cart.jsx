import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useCart } from "../components/CartProvider";
import { Link } from "react-router-dom";

function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.car.price, 0);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Your Cart</h2>

      <Row className="g-4">
        <Col lg={8}>
          {cart.map((item) => {
            const car = item.car;

            return (
              <Card key={car.id} className="mb-3 shadow-sm">
                <Row className="g-0 align-items-center">
                  <Col md={4}>
                    <img
                      src={car.image}
                      alt={car.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.375rem",
                        borderBottomLeftRadius: "0.375rem",
                      }}
                    />
                  </Col>

                  <Col md={8}>
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between">
                        {car.name}
                        <span className="text-primary">
                          {car.price.toLocaleString()} zł
                        </span>
                      </Card.Title>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(car)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>

              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <strong>{total.toLocaleString()} zł</strong>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>Included</span>
                </ListGroup.Item>
              </ListGroup>

              <Button variant="primary" size="lg" className="w-100">
                Proceed to Checkout
              </Button>

              <Button variant="link" className="w-100 mt-2" as={Link} to="/">
                Continue Browsing Cars
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
