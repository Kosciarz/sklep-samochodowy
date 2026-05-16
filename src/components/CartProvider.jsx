import { useState, createContext, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (car) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.car.id === car.id);

      if (existing) {
        return prev.map((item) =>
          item.car.id === car.id ? { ...item, count: item.count + 1 } : item,
        );
      }

      return [...prev, { car, count: 1 }];
    });
  };

  const removeFromCart = (car) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.car.id === car.id ? { ...item, count: item.count - 1 } : item,
        )
        .filter((item) => item.count > 0);
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
