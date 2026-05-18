import { useEffect, useState } from "react";
import CarList from "../components/CarList";

export default function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch("http://localhost:8080/cars", {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw Error("Request failed");
        }

        const json = await response.json();

        setCars(json);
      } catch (e) {
        console.error(`Fetch failed ${e}`);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  return <CarList cars={cars} />;
}
