import { Row, Col } from "react-bootstrap";
import Car from "./Car";

export default function CarList({ data }) {
  return (
    <Row className="g-4" xs={1} md={4}>
      {data.map((car, index) => (
        <Col key={index}>
          <Car name={car.name} price={car.price} image={car.image} />
        </Col>
      ))}
    </Row>
  );
}
