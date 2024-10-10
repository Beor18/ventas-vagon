import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderType {
  _id: string;
  productName: string;
  total: number;
  discount: number;
  tax: number;
  status: string;
  vendedorName: string;
  cliente?: {
    nombre: string;
  };
  comentaries: string;
}

interface OrdersTabProps {
  orders: OrderType[];
  deleteOrder: (id: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  deleteOrder,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">All Orders ({orders.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orders.map((order: OrderType) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle>{order.productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold">
                Total price: ${order.total}
              </p>
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
};
