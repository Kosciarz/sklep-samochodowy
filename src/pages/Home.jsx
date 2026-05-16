import CarList from "../components/CarList";
import { cars } from "../data/cars";

export default function Home() {
  return <CarList data={cars} />;
}
