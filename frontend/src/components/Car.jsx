import { Button, Card } from "react-bootstrap";
import { useCart } from "./CartProvider";

export default function Car({ car }) {
  const { addToCart } = useCart();

  return (
    <Card style={{ width: "18rem" }} border="secondary">
      <Card.Img variant="top" src={car.image} width="100%" height="175px" />
      <Card.Body>
        <Card.Title>{car.name}</Card.Title>
        <Card.Text>{car.price.toLocaleString()} zł</Card.Text>
        <Button variant="primary" onClick={() => addToCart(car)}>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
