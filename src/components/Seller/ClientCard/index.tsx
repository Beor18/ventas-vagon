import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const ClientCard = ({ client, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{client.nombre}</h3>
            <p>Email: {client.email}</p>
            <p>Teléfono: {client.telefono}</p>
            <p>Dirección: {client.direccion_residencial}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(client._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
