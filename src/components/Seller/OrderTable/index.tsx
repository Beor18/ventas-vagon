import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const OrderTable = ({
  loading,
  orders,
  session,
  onOpenOrderDetail,
  onExportToPDF,
  editOrder,
}) => {
  const filteredOrders = orders.filter(
    (order) => order.vendedorEmail === session?.user?.email
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-between items-center">
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
      </div> */}
      <Card className="rounded-md border shadow-sm overflow-hidden">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Número de orden</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead>Fecha de la orden</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell className="hover:bg-muted/50 transition-colors">
                    {order.productName}
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>{order.discount}%</TableCell>
                  <TableCell>{order.tax}%</TableCell>
                  <TableCell>
                    {" "}
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
                  <TableCell>{order.cliente?.nombre || "N/A"}</TableCell>
                  <TableCell>
                    {order.comentaries || "Sin comentarios"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "PP")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onOpenOrderDetail(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editOrder(order)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Editar orden
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExportToPDF(order)}>
                          <FileText className="mr-2 h-4 w-4" />
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
  );
};

export default OrderTable;
