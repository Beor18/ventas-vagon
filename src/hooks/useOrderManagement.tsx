import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const useOrderManagement = (initialOrders) => {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [fabricante, setFabricante] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchFabricante();
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrdersList(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrdersById = async (id: any) => {
    try {
      const response = await fetch(`/api/orders?id=${id}`);
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
        await fetchOrdersById(orderId);
      }
    } catch (error) {
      console.error("Error editing order:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFabricante = async () => {
    const response = await fetch("/api/fabricante", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setFabricante(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    fabricante,
    ordersList,
    loading,
    fetchOrders,
    deleteOrder,
    editOrder,
  };
};
