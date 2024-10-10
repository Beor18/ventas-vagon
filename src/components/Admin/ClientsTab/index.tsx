import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface ClientType {
  _id: string;
  nombre: string;
  direccion_residencial: string;
  direccion_unidad: string;
  propietario_terreno: string;
  proposito_unidad: string;
  estado_civil: string;
  lugar_empleo: string;
  email: string;
  identificacion: string;
  telefono: string;
  telefono_alterno: string;
  forma_pago: string;
  contacto_referencia: string;
  asegurador: string;
  seguro_comprado: boolean;
}

interface ClientsTabProps {
  clients: ClientType[];
  openClientForm: () => void;
  editClient: (client: ClientType) => void;
  deleteClient: (id: string) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({
  clients,
  openClientForm,
  editClient,
  deleteClient,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">All Clients</h2>
        <Button onClick={openClientForm} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Client
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map((client: ClientType) => (
          <Card key={client._id}>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{client.nombre}</h3>
              <p>
                <strong>Residential Address:</strong>{" "}
                {client.direccion_residencial}
              </p>
              <p>
                <strong>Unit Address:</strong> {client.direccion_unidad}
              </p>
              <p>
                <strong>Land Owner:</strong> {client.propietario_terreno}
              </p>
              <p>
                <strong>Unit Purpose:</strong> {client.proposito_unidad}
              </p>
              <p>
                <strong>Marital Status:</strong> {client.estado_civil}
              </p>
              <p>
                <strong>Workplace:</strong> {client.lugar_empleo}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>ID:</strong> {client.identificacion}
              </p>
              <p>
                <strong>Phone:</strong> {client.telefono}
              </p>
              <p>
                <strong>Alternate Phone:</strong> {client.telefono_alterno}
              </p>
              <p>
                <strong>Payment Method:</strong> {client.forma_pago}
              </p>
              <p>
                <strong>Reference Contact:</strong> {client.contacto_referencia}
              </p>
              <p>
                <strong>Insurer:</strong> {client.asegurador}
              </p>
              <p>
                <strong>Insurance Purchased:</strong>{" "}
                {client.seguro_comprado ? "Yes" : "No"}
              </p>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => editClient(client)}>
                  Edit Client
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteClient(client._id)}
                >
                  Delete Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
