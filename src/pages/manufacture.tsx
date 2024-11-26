/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import withAuth from "@/lib/withAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FileText, MoreVertical } from "lucide-react";

import { format } from "date-fns";
import { handleExportToPDFManufacture } from "@/lib/exportToPdfManufacture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

function Manufacture() {
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const openDialog = (order: any) => {
    handleViewOrder(order);
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setShowDialog(false);
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
    if (accessToken && session?.user?.email) {
      fetch(`/api/orders?fabricanteEmail=${session?.user?.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data)); // `data` será un array filtrado de órdenes
    }
  }, [accessToken, session?.user?.email]);

  const fetchProductDetails = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`);
    const product = await res.json();
    return product;
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
          closeDialog();
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
          closeDialog();
        });
    }
  };

  const handleViewOrder = async (order: any) => {
    const productDetails = await fetchProductDetails(order.productId);
    setSelectedOrder({ ...order, productDetails });
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto p-8 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Lista de Ordenes</h1>
        <Card className="rounded-md border shadow-sm overflow-hidden">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Número de orden</TableHead>
                  <TableHead>Producto</TableHead>
                  {/* <TableHead>Total</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Tax</TableHead> */}
                  <TableHead>Estado</TableHead>
                  <TableHead>Cliente</TableHead>

                  <TableHead>Fecha de la Orden</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    {/* <TableCell>${order.total}</TableCell>
                    <TableCell>{order.discount || "0"}%</TableCell>
                    <TableCell>{order.tax || "0"}%</TableCell> */}
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.vendedorName}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(order)}>
                            Ver Orden
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExportToPDFManufacture(order)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Exportar a PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Orden: {selectedOrder?._id}</DialogTitle>
            <DialogDescription>Detalles de la orden</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>{selectedOrder.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer</TableCell>
                    <TableCell>{selectedOrder.vendedorName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{selectedOrder.vendedorEmail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Comentarios</TableCell>
                    <TableCell>
                      {selectedOrder.comentaries ||
                        "No hay comentarios disponibles"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Producto</TableCell>
                    <TableCell>
                      <img
                        src={selectedOrder.productDetails.imageUrl}
                        alt={selectedOrder.productDetails.name}
                        width={320}
                        height={240}
                        className="w-[320px] h-auto mb-4"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nombre</TableCell>
                    <TableCell>{selectedOrder.productDetails.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Descripción</TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.description ||
                        "No hay descripción disponible"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Dimensiones externas
                    </TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.externalDimensions ||
                        "No hay dimensiones externas disponibles"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Dimensiones internas
                    </TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.internalDimensions ||
                        "No hay dimensiones internas disponibles"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex gap-4 mt-4">
                <Button onClick={() => approveOrder(selectedOrder._id)}>
                  Aprobar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowCommentInput((prev) => !prev)}
                >
                  Cancelar orden
                </Button>
              </div>
              {showCommentInput && (
                <div className="mt-4">
                  <Textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Añadir comentarios"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    className="mt-2"
                    onClick={() => rejectOrder(selectedOrder._id)}
                  >
                    Confirmar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function fetchAccessToken() {
  const response = await fetch("/api/jwt");
  const data = await response.json();
  return data.accessToken;
}

export default withAuth(Manufacture, ["Administrador", "Fabricante"]);
