import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { InsurancePolicy } from "@/components/Financiamiento/types";

interface PolicyListProps {
  policies: InsurancePolicy[];
  onCreateClick: () => void;
  onEditClick: (policy: InsurancePolicy) => void;
  onViewClick: (policy: InsurancePolicy) => void;
  onDeleteClick: (id: string) => void;
}

export function PolicyList({
  policies,
  onCreateClick,
  onEditClick,
  onViewClick,
  onDeleteClick,
}: PolicyListProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Solicitar Prestamo</CardTitle>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Solicitar Prestamo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Costo de Propiedad</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy._id}>
                <TableCell>{policy.cliente.nombre}</TableCell>
                <TableCell>{policy.cliente.telefono}</TableCell>
                <TableCell>
                  ${policy.costo_propiedad.toLocaleString()}
                </TableCell>
                <TableCell>{policy.vendedor}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewClick(policy)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditClick(policy)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteClick(policy._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
