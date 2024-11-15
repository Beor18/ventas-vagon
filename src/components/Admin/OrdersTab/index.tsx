"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  FileText,
  Trash2,
  User,
  Calendar,
  DollarSign,
  Percent,
  Tag,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { handleExportToPDFAdmin } from "@/lib/exportToPdf";
import { handleExportToPDFManufacture } from "@/lib/exportToPdfManufacture";
import { OrderEditModal } from "@/components/OrderEditModal";

interface OrderType {
  _id: string;
  productName: string;
  total: number;
  discount: number;
  tax: number;
  status: string;
  vendedorName: string;
  createdAt: string;
  cliente?: {
    nombre: string;
  };
  comentaries: string;
}

interface OrdersTabProps {
  orders: OrderType[];
  editOrder: (id: string, updatedData: Partial<OrderType>) => void;
  deleteOrder: (id: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  editOrder,
  deleteOrder,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const handleEditOrder = (orderId: string) => {
    const orderToEdit = orders.find((order) => order._id === orderId);
    if (orderToEdit) {
      setSelectedOrder(orderToEdit);
      setIsEditModalOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center md:text-left">
        All Orders ({orders.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: OrderType) => (
          <Card key={order._id} className="flex flex-col">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-xl font-semibold truncate">
                {order.productName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4 py-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total
                </span>
                <span className="text-lg font-semibold">
                  ${order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Percent className="w-4 h-4 mr-2" />
                  Discount
                </span>
                <span>{order.discount}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Tag className="w-4 h-4 mr-2" />
                  Tax
                </span>
                <span>{order.tax}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  Status
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2" />
                Seller: {order.vendedorName}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2" />
                Client: {order.cliente?.nombre || "N/A"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {format(new Date(order.createdAt), "PPpp")}
              </div>
              <div className="flex items-start text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span>
                  Comments:{" "}
                  {order.comentaries || (
                    <span className="font-semibold">No comments yet!</span>
                  )}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 bg-muted/50 pt-6">
              <Button
                className="w-full text-xs sm:text-sm"
                onClick={() => handleEditOrder(order._id)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Editar Orden
              </Button>
              <Button
                className="w-full text-xs sm:text-sm"
                onClick={() => handleExportToPDFAdmin(order)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF (Seller)
              </Button>
              <Button
                className="w-full text-xs sm:text-sm"
                onClick={() => handleExportToPDFManufacture(order)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF (Manufacturer)
              </Button>
              <Button
                variant="destructive"
                className="w-full text-xs sm:text-sm"
                onClick={() => deleteOrder(order._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <OrderEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        orderId={selectedOrder?._id || ""}
        editOrder={editOrder}
        initialData={selectedOrder || ({} as OrderType)}
      />
    </div>
  );
};
