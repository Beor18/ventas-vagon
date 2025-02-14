import { ServiceRequest } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { ViewServiceRequestModal } from "../ViewServiceRequestModal";
import { useState } from "react";

interface ServiceRequestListProps {
  requests: ServiceRequest[];
  onUpdate: () => void;
}

export function ServiceRequestList({
  requests,
  onUpdate,
}: ServiceRequestListProps) {
  const { data: session } = useSession();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const getStatusBadgeColor = (status: ServiceRequest["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Reclamación</TableHead>
            <TableHead>Instalador</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.client}</TableCell>
              <TableCell className="capitalize">{request.type}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell>
                {format(new Date(request.claimDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{request.installer}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {session?.user?.role === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Handle edit
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewServiceRequestModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onUpdate={onUpdate}
      />
    </>
  );
}
