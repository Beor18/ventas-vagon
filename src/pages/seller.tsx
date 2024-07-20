/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@Src/components/Modal";
import Select from "@Src/components/Select";
import withAuth from "../lib/withAuth";
import { useSession } from "next-auth/react";

function Seller({ products }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchOrders();
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
                  <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-700 pb-4">
                      Base Price: ${product.basePrice}
                    </p>
                    <img
                      src={product.imageUrl}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Ver Producto
                  </button>
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
