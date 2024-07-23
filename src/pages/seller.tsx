/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@Src/components/Modal";
import Select from "@Src/components/Select";
import withAuth from "../lib/withAuth";
import { useSession } from "next-auth/react";
import ClientForm from "@Src/components/ClientForm";

function Seller({ products }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("orders");
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchOrders();
      fetchClients();
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  };

  const fetchOrders = async () => {
    const response = await fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setOrders(data);
  };

  const fetchClients = async () => {
    const response = await fetch("/api/client", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setClients(data);
  };

  const handleCreateClient = async (client: any) => {
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...client, vendedor: session?.user?.email }),
      });

      if (response.ok) {
        fetchClients();
        setIsClientFormModalOpen(false);
      } else {
        console.error("Failed to create client");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/client?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchClients();
      } else {
        console.error("Failed to delete client");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto py-4 flex-grow">
        <div className="flex text-2xl border-b-4 border-red-700 mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "orders" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Mis Ordenes
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "products" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Lista de Productos
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "clients" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("clients")}
          >
            Mis Clientes
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 pt-4">Mis Ordenes</h1>
            <div className="grid grid-cols-1 gap-4">
              {orders
                .filter(
                  (order: any) => order.vendedorEmail === session?.user?.email
                )
                .map((order: any) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <h2 className="text-xl font-semibold uppercase">
                        {order.productName}
                      </h2>
                      <p className="text-gray-800 font-normal">
                        Total precio: ${order.total}
                      </p>
                      <p className="text-gray-800 font-normal">
                        Descuento: {order.discount}%
                      </p>
                      <p className="text-gray-800 font-normal">
                        Tax: {order.tax}%
                      </p>
                      <p className="text-gray-700 pb-4">
                        Status: {order.status}
                      </p>

                      <p className="text-gray-700 pb-4 border-t-2 border-red-400 pt-2">
                        Vendedor: {order.vendedorName}
                      </p>
                      <p className="text-gray-700 pb-4">
                        Cliente: {order.cliente?.nombre || "N/A"}
                      </p>
                      <p className="text-gray-700 pb-4">
                        Comentarios:{" "}
                        {order.comentaries === "" ? (
                          <span className="font-bold">
                            Todavía sin comentarios!
                          </span>
                        ) : (
                          order.comentaries
                        )}
                      </p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Próximamente ver detalle de la orden...
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 pt-4">Lista de Productos</h1>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openModal(product)}
                >
                  <div className="flex flex-row gap-4">
                    <div>
                      <img
                        src={product.imageUrl}
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-500">{product.description}</p>
                      <p className="text-gray-500">USD {product.basePrice}</p>
                    </div>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Ver Producto
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div>
            <div className="flex flex-row gap-4 items-center mb-8 mt-8">
              <div>
                {" "}
                <h1 className="text-2xl font-bold mb-4 pt-4">Mis Clientes</h1>
              </div>
              <div>
                <button
                  onClick={() => setIsClientFormModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Crear Nuevo Cliente
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {clients.map((client: any) => (
                <div
                  key={client._id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{client.nombre}</h3>
                    <p>Dirección Residencial: {client.direccion_residencial}</p>
                    <p>Dirección de la Unidad: {client.direccion_unidad}</p>
                    <p>Propietario del Terreno: {client.propietario_terreno}</p>
                    <p>Propósito de la Unidad: {client.proposito_unidad}</p>
                    <p>Estado Civil: {client.estado_civil}</p>
                    <p>Lugar de Empleo: {client.lugar_empleo}</p>
                    <p>Email: {client.email}</p>
                    <p>Identificación: {client.identificacion}</p>
                    <p>Teléfono: {client.telefono}</p>
                    <p>Teléfono Alterno: {client.telefono_alterno}</p>
                    <p>Forma de Pago: {client.forma_pago}</p>
                    <p>Contacto de Referencia: {client.contacto_referencia}</p>
                    <p>Asegurador: {client.asegurador}</p>
                    <p>
                      Seguro Comprado: {client.seguro_comprado ? "Sí" : "No"}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDeleteClient(client._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProduct && (
          <Modal onClose={closeModal}>
            <Select product={selectedProduct} onClose={closeModal} />
          </Modal>
        )}

        {isClientFormModalOpen && (
          <Modal onClose={() => setIsClientFormModalOpen(false)}>
            <ClientForm onSubmit={handleCreateClient} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const products = await Product.find().lean();
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
}

export default withAuth(Seller, ["Administrador", "Vendedor"]);
