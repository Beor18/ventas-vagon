import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

export const useOrderManagement = (initialOrders) => {
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [fabricante, setFabricante] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchAccessToken = useCallback(async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrdersList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  const fetchOrdersById = useCallback(async (id: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?id=${id}`);
      const data = await response.json();
      setOrdersList(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(
    async (orderId) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders?id=${orderId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchOrders();
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders]
  );

  const editOrder = useCallback(
    async (orderId, updatedData) => {
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
    },
    [fetchOrdersById]
  );

  const fetchFabricante = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch("/api/fabricante", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setFabricante(data);
    } catch (error) {
      console.error("Error fetch fabricante: ", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
    }
  }, [session, fetchAccessToken]);

  useEffect(() => {
    if (session && accessToken) {
      Promise.all([fetchOrders(), fetchFabricante()])
        .catch((error) => console.error("Error fetching initial data:", error))
        .finally(() => setLoading(false));
    }
  }, [session, accessToken, fetchOrders, fetchFabricante]);

  return {
    fabricante,
    ordersList,
    loading,
    fetchOrders,
    deleteOrder,
    editOrder,
  };
};
