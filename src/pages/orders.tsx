import { useState, useEffect } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Order from "../models/Order";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{order.productName}</h2>
            <p>Status: {order.status}</p>
            <p>Customer: {order.customerEmail}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">
              View Details
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
