import { Row, Col, Container } from "react-bootstrap";
import Car from "./Car";

export default function CarList({ data }) {
  return (
    <Container className="mt-4">
      <Row className="g-4 justify-content-center">
        {data.map((car, index) => (
          <Col key={index} xs="auto">
            <Car name={car.name} price={car.price} image={car.image} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
