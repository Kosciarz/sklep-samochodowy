import './App.css'
import { cars } from './data/cars'
import CarList from './components/CarList'
import { Container } from 'react-bootstrap'

function App() {
  return (
    <Container>
      <CarList data={cars} />
    </Container>
  )
}

export default App
