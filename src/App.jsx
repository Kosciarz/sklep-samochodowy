import "./App.css";
import { cars } from "./data/cars";
import CarList from "./components/CarList";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <CarList data={cars} />
    </>
  );
}

export default App;
