/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@/components/Modal";
import SelectComponent from "@/components/Select";
import withAuth from "../lib/withAuth";
import ClientForm from "@/components/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ClipboardList,
  X,
  Upload,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { OrderDetail } from "@/components/OrderDetails";
import InsurancePolicies from "@/components/Insurance";
import { handleExportToPDFSeller } from "@/lib/exportToPdf";

import Financiamiento from "@/components/Financiamiento";

import OrderTable from "@/components/Seller/OrderTable";
import ProductList from "@/components/Seller/ProductList";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { OrderEditModal } from "@/components/OrderEditModal";
import ClientsTable from "@/components/Seller/ClientTable";
import { PaymentUploadModal } from "@/components/PaymentUploadModal";
import { PaymentsTable } from "@/components/Seller/PaymentsTable";

interface FullScreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  src,
  alt,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vw] max-h-[90vh] p-0 overflow-hidden bg-opacity-90">
        <div className="relative w-full h-full flex items-center justify-center">
          <DialogClose className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Seller({ products, orders }: { products: any[]; orders: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  //const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("orders");
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { fabricante, ordersList, editOrder, loading } =
    useOrderManagement(orders);

  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchClients();
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openClientFormModal = (client = null) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const closeClientFormModal = () => {
    setIsClientFormModalOpen(false);
    setCurrentClient(null);
  };

  const editClient = (client: any) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const handleOpenOrderEdit = (order) => {
    const product = products.find((p) => p._id === order.productId);
    setSelectedOrder({ ...order, product });
    setIsEditModalOpen(true);
  };

  const handleOpenOrderDetail = (order) => {
    const product = products.find((p) => p._id === order.productId);
    setSelectedOrder({ ...order, product });
    setIsOrderDetailOpen(true);
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
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

  // const openOrderDetail = (order: any) => {
  //   const product = products.find((p) => p._id === order.productId);
  //   setSelectedOrder({ ...order, product });
  // };

  // const closeOrderDetail = () => {
  //   setSelectedOrder(null);
  // };

  const openFullScreenImage = (src: any) => {
    setFullScreenImage(src);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const response = await fetch("/api/payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 mb-12">
          <TabsTrigger value="orders">
            <ClipboardList className="mr-2 h-4 w-4" />
            Mis Órdenes
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            Lista de Productos
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" />
            Mis Clientes
          </TabsTrigger>
          <TabsTrigger value="insurance">Seguros</TabsTrigger>
          <TabsTrigger value="financiamiento">Financiamiento</TabsTrigger>
          <TabsTrigger value="payments">
            <FileText className="mr-2 h-4 w-4" />
            Pagos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Mis Ordenes (
              {
                orders.filter(
                  (order: any) => order.vendedorEmail === session?.user?.email
                ).length
              }
              )
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button onClick={() => setIsPaymentModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Button>
                {/* <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-8 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                /> */}
              </div>
            </div>
          </div>
          <OrderTable
            loading={loading}
            orders={ordersList}
            editOrder={handleOpenOrderEdit}
            session={session}
            onOpenOrderDetail={handleOpenOrderDetail}
            onExportToPDF={handleExportToPDFSeller}
          />
        </TabsContent>
        <TabsContent value="products">
          <ProductList products={products} onView={openModal} />
        </TabsContent>
        <TabsContent value="clients">
          <ClientsTable
            clients={clients}
            openClientFormModal={openClientFormModal}
            handleDeleteClient={handleDeleteClient}
          />
        </TabsContent>
        <TabsContent value="insurance">
          <InsurancePolicies />
        </TabsContent>
        <TabsContent value="financiamiento">
          <Financiamiento />
        </TabsContent>
        <TabsContent value="payments">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Pagos Registrados</h2>
            <Button onClick={() => setIsPaymentModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Registrar Pago
            </Button>
          </div>
          <PaymentsTable payments={payments} loading={loadingPayments} />
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <SelectComponent product={selectedProduct} onClose={closeModal} />
        </Modal>
      )}

      {isClientFormModalOpen && (
        <Modal isOpen={isClientFormModalOpen} onClose={closeClientFormModal}>
          <ClientForm
            onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
            initialClientData={currentClient}
          />
        </Modal>
      )}

      <OrderDetail
        isOpen={isOrderDetailOpen}
        onClose={handleCloseOrderDetail}
        order={selectedOrder}
        openFullScreenImage={openFullScreenImage}
      />

      <OrderEditModal
        fabricante={fabricante}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        orderId={selectedOrder?._id || ""}
        editOrder={editOrder}
        initialData={selectedOrder || {}}
      />

      {fullScreenImage && (
        <FullScreenImage
          src={fullScreenImage}
          alt="Full screen image"
          onClose={closeFullScreenImage}
        />
      )}

      <PaymentUploadModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch products
    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/products`
    );
    if (!productsResponse.ok) {
      throw new Error(
        `Failed to fetch products: ${productsResponse.statusText}`
      );
    }
    const products = await productsResponse.json();

    // Fetch orders
    const ordersResponse = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/orders`
    );
    if (!ordersResponse.ok) {
      throw new Error(`Failed to fetch orders: ${ordersResponse.statusText}`);
    }
    const orders = await ordersResponse.json();

    return { props: { products, orders } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { products: [], orders: [] } };
  }
}

export default withAuth(Seller, ["Administrador", "Vendedor"]);
