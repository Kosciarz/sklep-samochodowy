import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useCart } from "../components/CartProvider";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.car.price * item.count,
    0,
  );

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Your Cart</h2>
        {cart.length > 0 && (
          <Button variant="outline-danger" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      <Row className="g-4">
        <Col lg={8}>
          {cart.map((item) => {
            const car = item.car;
            const image_path = `http://localhost:8080${car.image_url}`;

            return (
              <Card key={car.id} className="mb-3 shadow-sm">
                <Row className="g-0 align-items-center">
                  <Col md={4}>
                    <img
                      src={image_path}
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
                          {(car.price * item.count).toLocaleString()} zł
                        </span>
                      </Card.Title>

                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => removeFromCart(car)}
                        >
                          −
                        </Button>

                        <span className="fw-semibold px-1">{item.count}</span>

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => addToCart(car)}
                        >
                          +
                        </Button>

                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          × {car.price.toLocaleString()} zł each
                        </span>
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
