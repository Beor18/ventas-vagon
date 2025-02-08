"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { handleExportToPDFAdmin } from "@/lib/exportToPdf";
import { handleExportToPDFManufacture } from "@/lib/exportToPdfManufacture";
import { OrderEditModal } from "@/components/OrderEditModal";
import { Card } from "@/components/ui/card";
import { OrderDetail } from "@/components/OrderDetails";

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
  fabricante?: any;
  orders: OrderType[];
  editOrder: (id: string, updatedData: Partial<OrderType>) => void;
  deleteOrder: (id: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  fabricante,
  orders,
  editOrder,
  deleteOrder,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const handleOpenOrderDetail = (orderId) => {
    const order: any = orders.find((order) => order._id === orderId);
    setSelectedOrder({ ...order });
    setIsOrderDetailOpen(true);
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
  };

  const handleEditOrder = (orderId: string) => {
    const orderToEdit = orders.find((order) => order._id === orderId);
    if (orderToEdit) {
      setSelectedOrder(orderToEdit);
      setIsEditModalOpen(true);
    }
  };

  const openFullScreenImage = (src: string) => {
    setFullScreenImage(src);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendedorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Orders ({orders.length})</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-8 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Card className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Número de orden</TableHead>
              <TableHead className="font-semibold">Producto</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Vendedor</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Fecha de la orden</TableHead>
              <TableHead className="font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: OrderType) => (
              <TableRow
                key={order._id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{order._id}</TableCell>
                <TableCell className="font-medium">
                  {order.productName}
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{order.vendedorName}</TableCell>
                <TableCell>{order.cliente?.nombre || "N/A"}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "PP")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleOpenOrderDetail(order._id)}
                      >
                        Ver detalle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditOrder(order._id)}
                      >
                        Edit order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportToPDFAdmin(order)}
                      >
                        Export PDF (Seller)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportToPDFManufacture(order)}
                      >
                        Export PDF (Manufacturer)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-600"
                      >
                        Delete order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
        initialData={selectedOrder || ({} as OrderType)}
      />
    </div>
  );
};
