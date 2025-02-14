import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ServiceRequest } from "@/types/types";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ViewServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  onUpdate: () => void;
}

export function ViewServiceRequestModal({
  isOpen,
  onClose,
  request,
  onUpdate,
}: ViewServiceRequestModalProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  if (!request) return null;

  const handleStatusChange = async (newStatus: ServiceRequest["status"]) => {
    try {
      const response = await fetch(`/api/service-requests/${request._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Error updating status");

      onUpdate();
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        `/api/service-requests/${request._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newComment,
            author: session?.user?.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Error adding comment");

      setNewComment("");
      onUpdate();
      toast({
        title: "Éxito",
        description: "Comentario agregado correctamente",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el comentario",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Solicitud</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p>
              <strong>Cliente:</strong> {request.client}
            </p>
            <p>
              <strong>Pueblo:</strong> {request.town}
            </p>
            <p>
              <strong>Instalador:</strong> {request.installer}
            </p>
            <p>
              <strong>Producto:</strong> {request.product}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Tipo:</strong> {request.type}
            </p>
            <p>
              <strong>Estado:</strong> {request.status}
            </p>
            <p>
              <strong>Fecha de Reclamación:</strong>{" "}
              {format(new Date(request.claimDate), "dd/MM/yyyy")}
            </p>
            <p>
              <strong>Equipo Asignado:</strong> {request.assignedEquipment}
            </p>
          </div>

          <div className="col-span-2">
            <p>
              <strong>Problema:</strong>
            </p>
            <p className="mt-1">{request.problem}</p>
          </div>

          {request.images.length > 0 && (
            <div className="col-span-2">
              <p className="font-semibold mb-2">Imágenes:</p>
              <div className="grid grid-cols-3 gap-4">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="col-span-2 space-y-4">
            <div>
              <p className="font-semibold mb-2">Comentarios:</p>
              <div className="space-y-2">
                {request.comments.map((comment, index) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}{" "}
                      - {comment.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Agregar comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment}>Agregar Comentario</Button>
            </div>
          </div>

          {(session?.user?.role === "admin" ||
            session?.user?.role === "installer") && (
            <div className="col-span-2 flex justify-end space-x-2">
              {request.status !== "completed" && (
                <Button
                  onClick={() => handleStatusChange("completed")}
                  variant="default"
                >
                  Marcar como Completado
                </Button>
              )}
              {request.status === "pending" && (
                <Button
                  onClick={() => handleStatusChange("in_progress")}
                  variant="default"
                >
                  Iniciar Trabajo
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
