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

  const editOrder = async (orderId, updatedData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrdersList((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      console.error("Error editing order:", error);
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
    fetchOrders,
    deleteOrder,
    editOrder,
  };
};
