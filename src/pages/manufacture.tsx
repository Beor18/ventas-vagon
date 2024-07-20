import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import withAuth from "@Src/lib/withAuth";

function Manufacture() {
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

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

  const fetchProductDetails = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`);
    const product = await res.json();
    return product;
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

  const approveOrder = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/approve`, {
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
          setShowModal(false);
        });
    }
  };

  const rejectOrder = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ comentaries: comment }),
      })
        .then((res) => res.json())
        .then((updatedOrder) => {
          setOrders(
            orders.map((order: any) =>
              order._id === orderId ? updatedOrder : order
            )
          );
          setShowModal(false);
        });
    }
  };

  const handleViewOrder = async (order: any) => {
    const productDetails = await fetchProductDetails(order.productId);
    setSelectedOrder({ ...order, productDetails });
    setShowModal(true);
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
              <p>Customer: {order.vendedorName}</p>
              <div className="flex flex-row gap-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={() => handleViewOrder(order)}
                >
                  Ver Orden
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4">
            <h2 className="text-xl font-semibold mb-4">
              Orden: {selectedOrder.productName}
            </h2>
            <p>Status: {selectedOrder.status}</p>
            <p>Customer: {selectedOrder.vendedorName}</p>
            <p>Email: {selectedOrder.vendedorEmail}</p>
            <p>Comentarios: {selectedOrder.comentaries}</p>
            <h3 className="text-lg font-semibold mt-4">
              Detalles del Producto
            </h3>
            <p>Nombre: {selectedOrder.productDetails.name}</p>
            <p>Descripción: {selectedOrder.productDetails.description}</p>
            <p>Precio: {selectedOrder.productDetails.price}</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => approveOrder(selectedOrder._id)}
              >
                Aprobar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowCommentInput(true)}
              >
                Rechazar
              </button>
            </div>
            {showCommentInput && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Añadir comentarios"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={() => rejectOrder(selectedOrder._id)}
                >
                  Confirmar Rechazo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchAccessToken() {
  const response = await fetch("/api/jwt");
  const data = await response.json();
  return data.accessToken;
}

export default withAuth(Manufacture, ["Administrador", "Fabricante"]);
