/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import withAuth from "@/lib/withAuth";
import Modal from "@/components/Modal";

function Manufacture() {
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const openModal = (order: any) => {
    handleViewOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
    setShowCommentInput(false);
    setComment("");
  };

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
          closeModal(); // Cerrar modal al aprobar
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
          closeModal(); // Cerrar modal al rechazar
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
                  onClick={() => openModal(order)}
                >
                  Ver Orden
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <Modal isOpen={false} onClose={closeModal}>
          <div className="bg-white p-6 rounded-lg w-full overflow-y-auto overflow-hidden h-[700px]">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Orden: {selectedOrder.productDetails.name}
              </h2>
              <table className="min-w-full bg-white">
                <tbody>
                  {" "}
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Status
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.status}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Customer
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.vendedorName}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Email
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.vendedorEmail}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Comentarios
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.comentaries ||
                        "No hay comentarios disponibles"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Producto
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={selectedOrder.productDetails.imageUrl}
                        alt={selectedOrder.productDetails.name}
                        className="w-[320px] h-auto mb-4"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Nombre
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.productDetails.name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Descripción
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.productDetails.description ||
                        "No hay descripción disponible"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Dimensiones externas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.productDetails.externalDimensions ||
                        "No hay dimensiones externas disponibles"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Dimensiones internas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedOrder.productDetails.internalDimensions ||
                        "No hay dimensiones internas disponibles"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => approveOrder(selectedOrder._id)}
              >
                Aprobar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowCommentInput((prev) => !prev)}
              >
                Cancelar orden
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
                  Confirmar
                </button>
              </div>
            )}
          </div>
        </Modal>
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
