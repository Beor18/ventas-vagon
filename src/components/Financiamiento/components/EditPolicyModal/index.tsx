import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PolicyForm } from "@/components/Financiamiento/components/PolicyForm";
import { InsurancePolicy, Client } from "@/components/Financiamiento/types";

interface EditPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: InsurancePolicy | null;
  onSubmit: (policy: InsurancePolicy) => void;
  clients: Client[];
}

export function EditPolicyModal({
  isOpen,
  onClose,
  policy,
  onSubmit,
  clients,
}: EditPolicyModalProps) {
  if (!policy) return null;

  const handleSubmit = (
    updatedPolicy: Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt">
  ) => {
    onSubmit({
      ...policy,
      ...updatedPolicy,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Prestamo</DialogTitle>
        </DialogHeader>
        <PolicyForm policy={policy} onSubmit={handleSubmit} clients={clients} />
      </DialogContent>
    </Dialog>
  );
}
