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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
                <Button className="mt-2" onClick={() => openDialog(order)}>
                  Ver Orden
                </Button>
              </div>
            </div>
          ))}
        </div>
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
