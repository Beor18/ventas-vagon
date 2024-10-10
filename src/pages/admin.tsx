/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Eye, X } from "lucide-react";
import ProductForm from "@/components/ProductForm";
import ClientForm from "@/components/ClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import withAuth from "../lib/withAuth";
import { connectToDatabase } from "../lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Client from "@/models/Client";

import { upload } from "@vercel/blob/client";
import { ProductDetails } from "@/components/product-details";
import { DesignType } from "@/types/types";

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
  designs: any;
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
    designs: [],
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

  const [newDesign, setNewDesign] = useState<DesignType>({
    designType: "",
    cost: 0,
    imageUrl: "",
  });

  const handleNewDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDesign((prev) => ({ ...prev, [name]: value }));
  };

  const addDesign = () => {
    setProduct((prev) => ({
      ...prev,
      designs: [...prev.designs, newDesign],
    }));
    setNewDesign({ designType: "", cost: 0, imageUrl: "" });
  };

  const removeDesign = (designIndex: number) => {
    setProduct((prev) => ({
      ...prev,
      designs: prev.designs.filter((_, index) => index !== designIndex),
    }));
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleSubOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const handleNewOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const handleNewSubOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const updatedOptions = product.options.filter((_, i) => i !== optionIndex);
    setProduct({ ...product, options: updatedOptions });
  };

  const removeSubOption = (optionIndex: number, subOptionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions = updatedOptions[
      optionIndex
    ].suboptions.filter((_, i) => i !== subOptionIndex);
    setProduct({ ...product, options: updatedOptions });
  };

  const handleImageUpload = async (
    file: File,
    callback: (url: string) => void
  ) => {
    setLoading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      if (newBlob.url) {
        callback(newBlob.url);
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewCallback(URL.createObjectURL(file));
      await handleImageUpload(file, setImageUrlCallback);
    }
  };

  const saveProduct = async () => {
    const productToSave = { ...product, options: product.options };
    if (!productToSave._id) {
      await createProduct(productToSave);
    } else {
      await updateProduct(productToSave);
    }
    setModalOpen(false);
    fetchProducts();
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
      resetProductForm();
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

  const deleteOrder = async (orderId: string) => {
    try {
      await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });
      setMessage("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      setMessage("Error deleting order");
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
        setMessage("Client created successfully");
      } else {
        setMessage("Failed to create client");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error creating client");
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
        setMessage("Client updated successfully");
      } else {
        setMessage("Failed to update client");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error updating client");
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
        setMessage("Client deleted successfully");
      } else {
        setMessage("Failed to delete client");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error deleting client");
    }
  };

  const resetProductForm = () => {
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
      designs: [],
    });
    setImagePreview("");
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

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="seguros">Insurance</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab
            products={products}
            openModal={() => {
              resetProductForm();
              setModalOpen(true);
            }}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab orders={ordersList} deleteOrder={deleteOrder} />
        </TabsContent>
        <TabsContent value="clients">
          <ClientsTab
            clients={clients}
            openClientForm={() => {
              setCurrentClient(null);
              setIsClientFormModalOpen(true);
            }}
            editClient={editClient}
            deleteClient={handleDeleteClient}
          />
        </TabsContent>
        <TabsContent value="seguros">
          <h2 className="text-3xl font-bold mb-6">Insurance Management</h2>
          {/* Add insurance management content here */}
        </TabsContent>
      </Tabs>

      {modalOpen && (
        <ProductForm
          product={product}
          setProduct={setProduct}
          newOption={newOption}
          setNewOption={setNewOption}
          newSubOption={newSubOption}
          setNewSubOption={setNewSubOption}
          newDesign={newDesign}
          setNewDesign={setNewDesign}
          handleProductChange={handleProductChange}
          handleOptionChange={handleOptionChange}
          handleSubOptionChange={handleSubOptionChange}
          handleNewOptionChange={handleNewOptionChange}
          handleNewSubOptionChange={handleNewSubOptionChange}
          handleNewDesignChange={handleNewDesignChange}
          addOption={addOption}
          addSubOption={addSubOption}
          addDesign={addDesign}
          removeOption={removeOption}
          removeSubOption={removeSubOption}
          removeDesign={removeDesign}
          handleImagePreview={handleImagePreview}
          saveProduct={saveProduct}
          setModalOpen={setModalOpen}
          loading={loading}
        />
      )}

      <Dialog
        open={isClientFormModalOpen}
        onOpenChange={setIsClientFormModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentClient ? "Edit Client" : "Create New Client"}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
            initialClientData={currentClient}
          />
          <DialogClose asChild>
            <Button onClick={() => setIsClientFormModalOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-6xl h-[90vh] sm:h-[90vh] max-h-[90vh] overflow-y-scroll overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && <ProductDetails product={selectedProduct} />}
          <DialogClose asChild>
            <Button onClick={() => setSelectedProduct(null)} className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {loading && <LoadingOverlay />}

      {message && (
        <div className="fixed bottom-8 right-8 bg-blue-500 text-white p-6 rounded-md shadow-lg text-lg">
          {message}
        </div>
      )}
    </div>
  );
};

const ProductsTab = ({
  products,
  openModal,
  editProduct,
  deleteProduct,
  setSelectedProduct,
}) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">
        Product Management ({products.length})
      </h2>
      <Button onClick={openModal} size="lg">
        <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: ProductType) => (
        <Card key={product._id} className="overflow-hidden">
          <CardContent className="p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <p className="text-lg font-bold mb-4">USD {product.basePrice}</p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProduct(product)}
              >
                <Eye className="h-4 w-4 mr-2" /> View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editProduct(product)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteProduct(product._id!)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const OrdersTab = ({ orders, deleteOrder }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold">All Orders ({orders.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {orders.map((order: any) => (
        <Card key={order._id}>
          <CardHeader>
            <CardTitle>{order.productName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold">Total price: ${order.total}</p>
            <p>Discount: {order.discount}%</p>
            <p>Tax: {order.tax}%</p>
            <p>Status: {order.status}</p>
            <p className="border-t pt-4 mt-4">Seller: {order.vendedorName}</p>
            <p>Client: {order.cliente?.nombre || "N/A"}</p>
            <p>
              Comments:{" "}
              {order.comentaries === "" ? (
                <span className="font-bold">No comments yet!</span>
              ) : (
                order.comentaries
              )}
            </p>
            <Button
              variant="destructive"
              onClick={() => deleteOrder(order._id)}
            >
              Delete Order
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ClientsTab = ({ clients, openClientForm, editClient, deleteClient }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">All Clients</h2>
      <Button onClick={openClientForm} size="lg">
        <PlusCircle className="mr-2 h-5 w-5" /> Create New Client
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {clients.map((client: any) => (
        <Card key={client._id}>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">{client.nombre}</h3>
            <p>
              <strong>Residential Address:</strong>{" "}
              {client.direccion_residencial}
            </p>
            <p>
              <strong>Unit Address:</strong> {client.direccion_unidad}
            </p>
            <p>
              <strong>Land Owner:</strong> {client.propietario_terreno}
            </p>
            <p>
              <strong>Unit Purpose:</strong> {client.proposito_unidad}
            </p>
            <p>
              <strong>Marital Status:</strong> {client.estado_civil}
            </p>
            <p>
              <strong>Workplace:</strong> {client.lugar_empleo}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
            <p>
              <strong>ID:</strong> {client.identificacion}
            </p>
            <p>
              <strong>Phone:</strong> {client.telefono}
            </p>
            <p>
              <strong>Alternate Phone:</strong> {client.telefono_alterno}
            </p>
            <p>
              <strong>Payment Method:</strong> {client.forma_pago}
            </p>
            <p>
              <strong>Reference Contact:</strong> {client.contacto_referencia}
            </p>
            <p>
              <strong>Insurer:</strong> {client.asegurador}
            </p>
            <p>
              <strong>Insurance Purchased:</strong>{" "}
              {client.seguro_comprado ? "Yes" : "No"}
            </p>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => editClient(client)}>
                Edit Client
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteClient(client._id)}
              >
                Delete Client
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// const ProductDetails = ({ product }) => (
//   <div className="space-y-6">
//     <img
//       src={product.imageUrl}
//       alt={product.name}
//       className="w-full object-cover rounded-lg"
//     />
//     <div>
//       <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
//       <p className="text-gray-600 mb-4">{product.description}</p>
//       <p className="text-2xl font-bold mb-4">USD {product.basePrice}</p>
//       <p className="mb-2">
//         <span className="font-bold">External Dimensions: </span>
//         {product.externalDimensions}
//       </p>
//       <p>
//         <span className="font-bold">Internal Dimensions: </span>
//         {product.internalDimensions}
//       </p>
//     </div>
//   </div>
// );

const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <Card>
      <CardContent className="flex items-center space-x-4 p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        <CardTitle className="text-2xl">Uploading...</CardTitle>
      </CardContent>
    </Card>
  </div>
);

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
