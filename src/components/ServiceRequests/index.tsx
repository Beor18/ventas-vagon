"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { ServiceRequest } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreateServiceRequestModal } from "./CreateServiceRequestModal";
import { ServiceRequestDetailModal } from "./ServiceRequestDetailModal";

const statusMap = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  approved: { label: "Aprobado", variant: "outline" as const },
  in_progress: { label: "En Proceso", variant: "secondary" as const },
  completed: { label: "Completado", variant: "outline" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
};

export default function ServiceRequests() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/service-requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async (
    newRequest: Omit<ServiceRequest, "_id">
  ) => {
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) throw new Error("Error creating request");

      await fetchRequests();
      setIsCreateModalOpen(false);
      toast({
        title: "Éxito",
        description: "Solicitud creada correctamente",
      });
    } catch (error) {
      console.error("Error creating service request:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Solicitudes de Servicio</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Instalador</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>
                  {format(
                    new Date(request.createdAt || Date.now()),
                    "dd/MM/yyyy",
                    {
                      locale: es,
                    }
                  )}
                </TableCell>
                <TableCell>{(request.client as any).nombre}</TableCell>
                <TableCell className="capitalize">
                  {request.type === "delivery"
                    ? "Entrega"
                    : request.type === "installation"
                    ? "Instalación"
                    : "Reparación"}
                </TableCell>
                <TableCell>{(request.installer as any).name}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[request.status].variant}>
                    {statusMap[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateServiceRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <ServiceRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}
