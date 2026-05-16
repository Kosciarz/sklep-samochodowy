import { Row, Col, Container } from "react-bootstrap";
import Car from "./Car";

export default function CarList({ data }) {
  return (
    <Container className="my-4">
      <Row className="g-4 justify-content-center">
        {data.map((car) => (
          <Col key={car.id} xs="auto">
            <Car car={car} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
