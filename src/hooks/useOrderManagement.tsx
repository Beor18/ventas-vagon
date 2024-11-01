import { useState, useEffect } from "react";

export const useOrderManagement = (initialOrders) => {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrdersList(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    ordersList,
    loading,
    deleteOrder,
  };
};
