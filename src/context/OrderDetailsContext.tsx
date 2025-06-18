"use client";

import React, { createContext, useContext, useState } from "react";

type OrderDetails = any; // Puedes tipar mejor según tu modelo

interface OrderDetailsContextType {
  orderDetails: OrderDetails | null;
  setOrderDetails: (order: OrderDetails | null) => void;
}

const OrderDetailsContext = createContext<OrderDetailsContextType | undefined>(undefined);

export function OrderDetailsProvider({ children }: { children: React.ReactNode }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  return (
    <OrderDetailsContext.Provider value={{ orderDetails, setOrderDetails }}>
      {children}
    </OrderDetailsContext.Provider>
  );
}

export function useOrderDetails() {
  const context = useContext(OrderDetailsContext);
  if (!context) throw new Error("useOrderDetails debe usarse dentro de OrderDetailsProvider");
  return context;
}