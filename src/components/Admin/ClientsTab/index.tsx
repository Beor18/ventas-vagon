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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PlusCircle, MoreVertical, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">All Clients ({clients.length})</h2>
        <Button onClick={openClientForm} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Client
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search clients..."
            className="pl-8 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Card className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">
                Residential Address
              </TableHead>
              <TableHead className="font-semibold">Unit Address</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client: ClientType) => (
              <TableRow key={client._id}>
                <TableCell className="font-medium">{client.nombre}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.telefono}</TableCell>
                <TableCell>{client.direccion_residencial}</TableCell>
                <TableCell>{client.direccion_unidad}</TableCell>
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
                      <DropdownMenuItem onClick={() => editClient(client)}>
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteClient(client._id)}
                        className="text-red-600"
                      >
                        Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
