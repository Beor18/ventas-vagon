import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import XLSX from "xlsx";

export default function Manufacture() {
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
    }
  }, [session]);

  useEffect(() => {
    if (accessToken) {
      fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
  }, [accessToken]);

  const exportOrder = (order: any) => {
    const worksheet = XLSX.utils.json_to_sheet([order]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
    XLSX.writeFile(workbook, `order_${order._id}.xlsx`);
  };

  const markAsRead = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((updatedOrder) => {
          setOrders(
            orders.map((order: any) =>
              order._id === orderId ? updatedOrder : order
            )
          );
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto py-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Manufacture Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{order.productName}</h2>
              <p>Status: {order.status}</p>
              <p>Customer: {order.customerEmail}</p>
              <div className="flex flex-row gap-4">
                <div>
                  {" "}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    onClick={() => exportOrder(order)}
                  >
                    Export to Excel
                  </button>
                </div>
                <div>
                  {" "}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                    onClick={() => markAsRead(order._id)}
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function fetchAccessToken() {
  const response = await fetch("/api/jwt");
  const data = await response.json();
  return data.accessToken;
}
