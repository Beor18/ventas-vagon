/* eslint-disable @next/next/no-img-element */
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef, useEffect } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "@Src/models/Product";
import Order from "@Src/models/Order";
import Client from "@Src/models/Client";
import withAuth from "../lib/withAuth";
import ProductForm from "@Src/components/ProductForm";
import { useSession } from "next-auth/react";
import Modal from "@Src/components/Modal";
import ClientForm from "@Src/components/ClientForm";

interface ProductType {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  material: string;
  externalDimensions: string;
  internalDimensions: string;
  foldingState: string;
  totalWeight: number;
  basePrice: number;
  options: OptionType[];
}

interface OptionType {
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  specification: string;
  pcs: number;
  suboptions: SubOptionType[];
}

interface SubOptionType {
  code: string;
  price: number;
  imageUrl: string;
  details: string;
  name: string;
}

const Admin = ({ initialProducts, orders }: any) => {
  const [products, setProducts] = useState(initialProducts);
  const [product, setProduct] = useState<ProductType>({
    name: "",
    description: "",
    imageUrl: "",
    quantity: 1,
    material: "",
    externalDimensions: "",
    internalDimensions: "",
    foldingState: "",
    totalWeight: 0,
    basePrice: 0,
    options: [],
  });
  const [imagePreview, setImagePreview] = useState("");
  const [newOption, setNewOption] = useState<OptionType>({
    name: "",
    price: 0,
    imageUrl: "",
    type: "",
    specification: "",
    pcs: 0,
    suboptions: [],
  });
  const [newSubOption, setNewSubOption] = useState<SubOptionType>({
    code: "",
    price: 0,
    imageUrl: "",
    details: "",
    name: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [activeTab, setActiveTab] = useState("products");

  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [ordersList, setOrdersList] = useState([]);

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

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
    setOrdersList(data);
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

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });

      fetchClients();
      fetchOrders();
    }
  }, [session]);

  const handleProductChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleOptionChange = (e: any, optionIndex: number) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleSubOptionChange = (
    e: any,
    optionIndex: number,
    subOptionIndex: number
  ) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions[subOptionIndex] = {
      ...updatedOptions[optionIndex].suboptions[subOptionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleNewOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const handleNewSubOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewSubOption({ ...newSubOption, [name]: value });
  };

  const addOption = () => {
    setProduct({
      ...product,
      options: [...product.options, { ...newOption, suboptions: [] }],
    });
    setNewOption({
      name: "",
      price: 0,
      imageUrl: "",
      type: "",
      specification: "",
      pcs: 0,
      suboptions: [],
    });
  };

  const addSubOption = (optionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions.push({ ...newSubOption });
    setProduct({ ...product, options: updatedOptions });
    setNewSubOption({
      code: "",
      price: 0,
      imageUrl: "",
      details: "",
      name: "",
    });
  };

  const removeOption = (optionIndex: number) => {
    const updatedOptions = product.options.filter(
      (_: any, i: number) => i !== optionIndex
    );
    setProduct({ ...product, options: updatedOptions });
  };

  const removeSubOption = (optionIndex: number, subOptionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions = updatedOptions[
      optionIndex
    ].suboptions.filter((_: any, i: number) => i !== subOptionIndex);
    setProduct({ ...product, options: updatedOptions });
  };

  const handleImageUpload = async (file: File, callback: any) => {
    setLoading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      callback(newBlob.url);
    } catch (error) {
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = async (
    e: any,
    setImageUrlCallback: any,
    setPreviewCallback: any
  ) => {
    const file = e.target.files[0];
    setPreviewCallback(URL.createObjectURL(file));
    await handleImageUpload(file, setImageUrlCallback);
  };

  const saveProduct = async () => {
    const productToSave = { ...product, options: product.options };
    if (!productToSave._id) {
      await createProduct(productToSave);
      setModalOpen(false);
      fetchProducts();
    } else {
      await updateProduct(productToSave);
      setModalOpen(false);
      fetchProducts();
    }
  };

  const createProduct = async (productData: ProductType) => {
    setLoading(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      await fetchProducts();
      setProduct({
        name: "",
        description: "",
        imageUrl: "",
        quantity: 1,
        material: "",
        externalDimensions: "",
        internalDimensions: "",
        foldingState: "",
        totalWeight: 0,
        basePrice: 0,
        options: [],
      });
      setNewOption({
        name: "",
        price: 0,
        imageUrl: "",
        type: "",
        specification: "",
        pcs: 0,
        suboptions: [],
      });
      setImagePreview("");
      setMessage("Product saved successfully");
    } catch (error) {
      setMessage("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productData: ProductType) => {
    setLoading(true);
    try {
      await fetch(`/api/products/${productData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      await fetchProducts();
      setMessage("Product updated successfully");
      setModalOpen(false);
    } catch (error) {
      setMessage("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      await fetchProducts();
      setMessage("Product deleted successfully");
    } catch (error) {
      setMessage("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product: ProductType) => {
    setProduct(product);
    setImagePreview(product.imageUrl);
    setModalOpen(true);
  };

  const editClient = (client: any) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const deleteOrder = async (orderId: any) => {
    try {
      await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      alert("Orden eliminada exitosamente.");
      fetchOrders();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      alert(
        "Hubo un error al intentar eliminar la orden. Por favor, intenta de nuevo."
      );
    }
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

  const handleUpdateClient = async (client: any) => {
    try {
      const response = await fetch(`/api/client?id=${client._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(client),
      });

      if (response.ok) {
        fetchClients();
        setIsClientFormModalOpen(false);
        setCurrentClient(null);
      } else {
        console.error("Failed to update client");
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

  return (
    <div className="min-h-screen flex flex-col container mx-auto p-4">
      <div className="flex flex-row gap-4 items-center mb-8 mt-8">
        <div>
          {" "}
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        </div>
      </div>

      <div className="flex text-2xl border-b-4 border-red-700 mb-4">
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
            activeTab === "orders" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Todas las Ordenes
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "clients" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("clients")}
        >
          Todos los Clientes
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "seguros" ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("seguros")}
        >
          Todos los Seguros
        </button>
      </div>

      {activeTab === "orders" && (
        <section>
          <h1 className="text-2xl font-bold pt-4 pb-4">
            Todas las ordenes - <span>({ordersList.length})</span>
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {ordersList.map((order: any) => (
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
                  <p className="text-gray-800 font-normal">Tax: {order.tax}%</p>
                  <p className="text-gray-700 pb-4">Status: {order.status}</p>
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
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "products" && (
        <>
          <section>
            <div className="flex flex-row gap-4 items-center pt-4 pb-4">
              <div>
                {" "}
                <h1 className="text-2xl font-bold pt-4 pb-4">
                  Gestión de Productos - <span>({products.length})</span>
                </h1>
              </div>
              <div>
                <button
                  onClick={() => {
                    setProduct({
                      name: "",
                      description: "",
                      imageUrl: "",
                      quantity: 1,
                      material: "",
                      externalDimensions: "",
                      internalDimensions: "",
                      foldingState: "",
                      totalWeight: 0,
                      basePrice: 0,
                      options: [],
                    });
                    setImagePreview("");
                    setModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Agregar nuevo producto
                </button>
              </div>
            </div>
            {modalOpen && (
              <ProductForm
                product={product}
                setProduct={setProduct}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                newOption={newOption}
                setNewOption={setNewOption}
                newSubOption={newSubOption}
                setNewSubOption={setNewSubOption}
                handleProductChange={handleProductChange}
                handleOptionChange={handleOptionChange}
                handleSubOptionChange={handleSubOptionChange}
                handleNewOptionChange={handleNewOptionChange}
                handleNewSubOptionChange={handleNewSubOptionChange}
                addOption={addOption}
                addSubOption={addSubOption}
                removeOption={removeOption}
                removeSubOption={removeSubOption}
                handleImagePreview={handleImagePreview}
                saveProduct={saveProduct}
                setModalOpen={setModalOpen}
                loading={loading}
              />
            )}

            {message && <div className="mt-4 text-red-500">{message}</div>}
          </section>

          <section>
            <ul className="divide-y divide-gray-200">
              {products.map((product: ProductType) => (
                <li
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow mb-4"
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
                  <div className="flex space-x-4">
                    <button
                      onClick={() => openModal(product)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => editProduct(product)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id!)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {activeTab === "clients" && (
        <div>
          <div className="flex flex-row gap-4 items-center pt-4 pb-4">
            <div>
              <h1 className="text-2xl font-bold pt-4 pb-4">
                Todos los Clientes
              </h1>
            </div>
            <div>
              <button
                onClick={() => {
                  setCurrentClient(null);
                  setIsClientFormModalOpen(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Crear Nuevo Cliente
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {clients.map((client) => (
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
                  <p>Seguro Comprado: {client.seguro_comprado ? "Sí" : "No"}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      editClient(client);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                  >
                    Editar
                  </button>
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

      {isClientFormModalOpen && (
        <Modal onClose={() => setIsClientFormModalOpen(false)}>
          <ClientForm
            onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
            initialClientData={currentClient}
          />
        </Modal>
      )}

      {selectedProduct && (
        <Modal onClose={closeModal}>
          <div className="flex gap-4">
            <div>
              <div>
                <img
                  src={selectedProduct.imageUrl}
                  alt=""
                  width={200}
                  height={100}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1>{selectedProduct?.name}</h1>
              <p className="text-gray-500">{selectedProduct.description}</p>
              <p className="text-gray-500">USD {selectedProduct.basePrice}</p>
              <p className="text-gray-500">
                <span className="font-bold">Dimensiones externas: </span>
                {selectedProduct.externalDimensions}
              </p>
              <p className="text-gray-500">
                <span className="font-bold">Dimensiones internas: </span>
                {selectedProduct.internalDimensions}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold">Uploading...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();

  const clients = await Client.find().lean();
  const products = await Product.find().lean();
  const orders = await Order.find().populate("cliente").lean();

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default withAuth(Admin, ["Administrador"]);
