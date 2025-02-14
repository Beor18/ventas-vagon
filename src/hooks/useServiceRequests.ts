import { useState, useCallback } from "react";
import { ServiceRequest } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

export function useServiceRequests() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/service-requests");
      if (!response.ok) throw new Error("Error fetching requests");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createRequest = useCallback(
    async (request: Omit<ServiceRequest, "_id">) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/service-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error("Error creating request");

        toast({
          title: "Éxito",
          description: "Solicitud creada correctamente",
        });

        return true;
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "No se pudo crear la solicitud",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const updateRequest = useCallback(
    async (id: string, data: Partial<ServiceRequest>) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/service-requests/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Error updating request");

        toast({
          title: "Éxito",
          description: "Solicitud actualizada correctamente",
        });

        return true;
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la solicitud",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return {
    isLoading,
    fetchRequests,
    createRequest,
    updateRequest,
  };
}
