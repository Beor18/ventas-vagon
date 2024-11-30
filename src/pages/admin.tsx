"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import withAuth from "../lib/withAuth";
import { useProductManagement } from "@/hooks/useProductManagement";
import { useClientManagement } from "@/hooks/useClientManagement";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { LoadingOverlay } from "@/components/Admin/LoadingOverlay";
import ProductForm from "@/components/ProductForm";
import ClientForm from "@/components/ClientForm";
import InsurancePolicies from "@/components/Insurance";
import { ClientsTab } from "@/components/Admin/ClientsTab";
import { OrdersTab } from "@/components/Admin/OrdersTab";
import { ProductDetails } from "@/components/product-details";
import { ProductsTab } from "@/components/Admin/ProductsTab";
import { Button } from "@/components/ui/button";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/models/Client";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Financiamiento from "@/components/Financiamiento";

const Admin = ({ initialProducts, orders }) => {
  const {
    products,
    activeTab,
    setActiveTab,
    openProductModal,
    closeProductModal,
    selectedProduct,
    handleSaveProduct,
    resetProductForm,
    editProduct,
    deleteProduct,
    setSelectedProduct,
    modalOpen,
    loading,
    message,
    product,
    setProduct,
    newOption,
    setNewOption,
    newSubOption,
    setNewSubOption,
    newDesign,
    setNewDesign,
    newColorOption,
    setNewColorOption,
    handleProductChange,
    handleOptionChange,
    handleSubOptionChange,
    handleNewOptionChange,
    handleNewSubOptionChange,
    handleNewDesignChange,
    handleNewColorOptionChange,
    addOption,
    addSubOption,
    addDesign,
    addColorOption,
    editColorOption,
    removeOption,
    removeSubOption,
    removeDesign,
    removeColorOption,
    handleImagePreview,
    handleGallerySelect,
    duplicateProduct,
  } = useProductManagement(initialProducts);

  const {
    clients,
    currentClient,
    isClientFormModalOpen,
    openClientForm,
    closeClientForm,
    handleCreateClient,
    handleUpdateClient,
    handleSaveClient,
  } = useClientManagement();

  const { ordersList, deleteOrder, editOrder, fabricante } =
    useOrderManagement(orders);

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="seguros">Insurance</TabsTrigger>
          <TabsTrigger value="financiamiento">Financiamiento</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab
            products={products}
            openModal={openProductModal}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
            setSelectedProduct={setSelectedProduct}
            duplicateProduct={duplicateProduct}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab
            fabricante={fabricante}
            orders={ordersList}
            editOrder={editOrder}
            deleteOrder={deleteOrder}
          />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsTab
            clients={clients}
            openClientForm={openClientForm}
            editClient={openClientForm}
            deleteClient={handleSaveClient}
          />
        </TabsContent>

        <TabsContent value="seguros">
          <InsurancePolicies />
        </TabsContent>
        <TabsContent value="financiamiento">
          <Financiamiento />
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
          newColorOption={newColorOption}
          setNewColorOption={setNewColorOption}
          handleProductChange={handleProductChange}
          handleOptionChange={handleOptionChange}
          handleSubOptionChange={handleSubOptionChange}
          handleNewOptionChange={handleNewOptionChange}
          handleNewSubOptionChange={handleNewSubOptionChange}
          handleNewDesignChange={handleNewDesignChange}
          handleNewColorOptionChange={handleNewColorOptionChange}
          addOption={addOption}
          addSubOption={addSubOption}
          addDesign={addDesign}
          addColorOption={addColorOption}
          editColorOption={editColorOption}
          removeOption={removeOption}
          removeSubOption={removeSubOption}
          removeDesign={removeDesign}
          removeColorOption={removeColorOption}
          handleImagePreview={handleImagePreview}
          handleGallerySelect={handleGallerySelect}
          saveProduct={handleSaveProduct}
          setModalOpen={closeProductModal}
          loading={loading}
        />
      )}

      <Dialog open={isClientFormModalOpen} onOpenChange={closeClientForm}>
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

    return { props: { initialProducts: products, orders } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: { initialProducts: [], orders: [] } };
  }
}

export default withAuth(Admin, ["Administrador"]);
