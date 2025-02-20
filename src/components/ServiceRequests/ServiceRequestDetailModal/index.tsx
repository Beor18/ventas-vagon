import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ServiceRequest } from "@/types/types";

interface ServiceRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
}

const statusMap = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  approved: { label: "Aprobado", variant: "outline" as const },
  in_progress: { label: "En Proceso", variant: "secondary" as const },
  completed: { label: "Completado", variant: "outline" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
};

export function ServiceRequestDetailModal({
  isOpen,
  onClose,
  request,
}: ServiceRequestDetailModalProps) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Solicitud</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium">{(request.client as any).nombre}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pueblo</p>
            <p className="font-medium">{request.town}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Instalador</p>
            <p className="font-medium">{(request.installer as any).name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Estado</p>
            <Badge variant={statusMap[request.status].variant}>
              {statusMap[request.status].label}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tipo de Solicitud</p>
            <p className="font-medium capitalize">
              {request.type === "delivery"
                ? "Entrega"
                : request.type === "installation"
                ? "Instalación"
                : "Reparación"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Equipo Asignado</p>
            <p className="font-medium">{request.assignedEquipment}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Fecha de Reclamación
            </p>
            <p className="font-medium">
              {format(new Date(request.claimDate), "dd/MM/yyyy", {
                locale: es,
              })}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Fecha de Asignación</p>
            <p className="font-medium">
              {format(new Date(request.assignmentDate), "dd/MM/yyyy", {
                locale: es,
              })}
            </p>
          </div>
          <div className="col-span-2 space-y-2">
            <p className="text-sm text-muted-foreground">Problema</p>
            <p className="font-medium">{request.problem}</p>
          </div>
          {request.images && request.images.length > 0 && (
            <div className="col-span-2 space-y-2">
              <p className="text-sm text-muted-foreground">Imágenes</p>
              <div className="grid grid-cols-3 gap-4">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
