"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PolicyList } from "@/components/Financiamiento/components/PolicyList";
import { CreatePolicyModal } from "@/components/Financiamiento/components/CreatePolicyModal";
import { EditPolicyModal } from "@/components/Financiamiento/components/EditPolicyModal";
import { ViewPolicyModal } from "@/components/Financiamiento/components/ViewPolicyModal";
import { sendPolicyEmail } from "@/lib/sendPolicyEmail";
import {
  fetchPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  fetchClients,
} from "@/lib/api";
import { InsurancePolicy, Client } from "@/components/Financiamiento/types";

export default function Financiamiento() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies().then(setPolicies);
    fetchClients().then(setClients);
  }, []);

  const refetchPolicies = async () => {
    const updatedPolicies = await fetchPolicies();
    setPolicies(updatedPolicies);
  };

  const handleCreatePolicy = async (
    newPolicy: Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const createdPolicy = await createPolicy(newPolicy);
      setIsCreateModalOpen(false);
      toast({
        title: "Éxito",
        description: "El prestamo se creó correctamente.",
      });
      await sendPolicyEmail(createdPolicy, true);
      await refetchPolicies();
    } catch (error) {
      console.error("Error creating insurance policy:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el prestamo.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePolicy = async (updatedPolicy: InsurancePolicy) => {
    try {
      const updated = await updatePolicy(updatedPolicy);
      setIsEditModalOpen(false);
      setSelectedPolicy(null);
      toast({ title: "Éxito", description: "Se actualizó correctamente." });
      await sendPolicyEmail(updated, false);
      await refetchPolicies();
    } catch (error) {
      console.error("Error updating insurance policy:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePolicy = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar?")) {
      try {
        await deletePolicy(id);
        await refetchPolicies();
        toast({
          title: "Éxito",
          description: "El prestamo se eliminó correctamente.",
        });
      } catch (error) {
        console.error("Error deleting insurance policy:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el prestamo.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <CreatePolicyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePolicy}
        clients={clients}
      />
      <EditPolicyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        policy={selectedPolicy}
        onSubmit={handleUpdatePolicy}
        clients={clients}
      />
      <ViewPolicyModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        policy={selectedPolicy}
      />
      <PolicyList
        policies={policies}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onEditClick={(policy) => {
          setSelectedPolicy(policy);
          setIsEditModalOpen(true);
        }}
        onViewClick={(policy) => {
          setSelectedPolicy(policy);
          setIsViewModalOpen(true);
        }}
        onDeleteClick={handleDeletePolicy}
      />
    </div>
  );
}
