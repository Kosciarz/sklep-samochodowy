import { Button, Card } from "react-bootstrap";

export default function Car({ name, price, image }) {
  return (
    <Card style={{ width: "18rem"}} border="secondary">
      <Card.Img variant="top" src={image} width="100%" height="175px"/>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{price} zł</Card.Text>
        <Button variant="primary">Dodaj do koszyka</Button>
      </Card.Body>
    </Card>
  );
}
