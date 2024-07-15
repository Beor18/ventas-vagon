import { useState, useEffect } from "react";
import XLSX from "xlsx";
import { connectToDatabase } from "../lib/mongodb";
import Order from "../models/Order";

export default function Manufacture() {
  const [orders, setOrders] = useState<any>([]);

  useEffect(() => {
    fetch("/api/orders?status=produced")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const exportOrder = (order: any) => {
    const worksheet = XLSX.utils.json_to_sheet([order]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
    XLSX.writeFile(workbook, `order_${order._id}.xlsx`);
  };

  const markAsRead = (orderId: any) => {
    fetch(`/api/orders/${orderId}/read`, { method: "POST" })
      .then((res) => res.json())
      .then((updatedOrder) => {
        setOrders(
          orders.map((order: any) =>
            order._id === orderId ? updatedOrder : order
          )
        );
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manufacture Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{order.productName}</h2>
            <p>Status: {order.status}</p>
            <p>Customer: {order.customerEmail}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              onClick={() => exportOrder(order)}
            >
              Export to Excel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
              onClick={() => markAsRead(order._id)}
            >
              Mark as Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const orders = await Order.find().lean();
  return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
}
