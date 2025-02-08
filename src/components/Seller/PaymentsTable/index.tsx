import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface PaymentsTableProps {
  payments: any[];
  loading?: boolean;
}

export function PaymentsTable({ payments, loading }: PaymentsTableProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Archivos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                {format(new Date(payment.paymentDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>#{payment.orderId._id.toString().slice(-6)}</TableCell>
              <TableCell>{payment.clientId.nombre}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.notes}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(payment.receiptUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Recibo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(payment.invoiceUrl, "_blank")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Factura
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
