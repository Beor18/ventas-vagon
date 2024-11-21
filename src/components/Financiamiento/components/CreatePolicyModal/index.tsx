import { InsurancePolicy, Client } from "@/components/Financiamiento/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PolicyForm } from "@/components/Financiamiento/components/PolicyForm";

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    policy: Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt">
  ) => void;
  clients: Client[];
}

export function CreatePolicyModal({
  isOpen,
  onClose,
  onSubmit,
  clients,
}: CreatePolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Solicitar Prestamo</DialogTitle>
        </DialogHeader>
        <PolicyForm onSubmit={onSubmit} clients={clients} />
      </DialogContent>
    </Dialog>
  );
}
