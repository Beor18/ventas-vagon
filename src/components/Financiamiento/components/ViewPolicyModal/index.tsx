import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { InsurancePolicy } from "@/components/Financiamiento/types";

interface ViewPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: InsurancePolicy | null;
}

export function ViewPolicyModal({
  isOpen,
  onClose,
  policy,
}: ViewPolicyModalProps) {
  if (!policy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles del Prestamo</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p>
              <strong>Nombre:</strong> {policy.cliente.nombre}
            </p>
            <p>
              <strong>Dirección Física:</strong>{" "}
              {policy.cliente.direccion_residencial}
            </p>
            <p>
              <strong>Identificación:</strong>
              {policy.cliente.identificacion}
              {/* {format(new Date(policy.fecha_nacimiento), "dd/MM/yyyy")} */}
            </p>
            <p>
              <strong>Teléfono:</strong> {policy.cliente.telefono}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <strong>Costo de Propiedad:</strong> $
              {policy.costo_propiedad.toLocaleString()}
            </p>
            <p>
              <strong>Modelo de Propiedad:</strong> {policy.modelo_propiedad}
            </p>
            <p>
              <strong>Uso de Propiedad:</strong> {policy.uso_propiedad}
            </p>
            <p>
              <strong>Vendedor:</strong> {policy.vendedor}
            </p>
            <p>
              <strong>Comentarios:</strong> {policy.comentarios}
            </p>
          </div>
          <div className="col-span-2">
            <h4 className="text-sm font-semibold mb-2">Documentos:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {policy.documentos.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-800">
                    Documento {index + 1}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
