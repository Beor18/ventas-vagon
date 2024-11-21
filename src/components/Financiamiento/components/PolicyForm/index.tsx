import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upload } from "@vercel/blob/client";
import { InsurancePolicy, Client } from "@/components/Financiamiento/types";

interface PolicyFormProps {
  policy?: InsurancePolicy;
  onSubmit: (
    policy: Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt">
  ) => void;
  clients: Client[];
}

type FormDataType = Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt"> & {
  fecha_nacimiento: any;
  cliente: any;
};

export function PolicyForm({ policy, onSubmit, clients }: PolicyFormProps) {
  const [formData, setFormData] = useState<FormDataType>(() => {
    if (policy) {
      const { _id, createdAt, updatedAt, ...rest } = policy;
      return {
        ...rest,
        fecha_nacimiento:
          policy.fecha_nacimiento instanceof Date
            ? policy.fecha_nacimiento.toISOString().split("T")[0]
            : new Date(policy.fecha_nacimiento).toISOString().split("T")[0],
        cliente: policy.cliente ? policy.cliente._id : "",
      };
    } else {
      return {
        nombre: "",
        direccion_postal: "",
        direccion_fisica: "",
        fecha_nacimiento: new Date().toISOString().split("T")[0],
        telefono_contacto: "",
        costo_propiedad: 0,
        modelo_propiedad: "",
        uso_propiedad: "",
        vendedor: "",
        comentarios: "",
        documentos: [],
        cliente: "",
      };
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "costo_propiedad" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedUrls = await Promise.all(
      uploadedFiles.map(async (file) => {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        return blob.url;
      })
    );

    const updatedPolicy: Omit<
      InsurancePolicy,
      "_id" | "createdAt" | "updatedAt"
    > = {
      ...formData,
      documentos: [...(formData.documentos || []), ...uploadedUrls],
      fecha_nacimiento: new Date(formData.fecha_nacimiento),
      costo_propiedad: Number(formData.costo_propiedad),
    };

    onSubmit(updatedPolicy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select
            name="cliente"
            value={formData.cliente}
            onValueChange={(value) => handleSelectChange("cliente", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
          <Input
            id="telefono_contacto"
            name="telefono_contacto"
            value={formData.telefono_contacto}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion_postal">Dirección Postal</Label>
          <Input
            id="direccion_postal"
            name="direccion_postal"
            value={formData.direccion_postal}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion_fisica">Dirección Física</Label>
          <Input
            id="direccion_fisica"
            name="direccion_fisica"
            value={formData.direccion_fisica}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
          <Input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleInputChange}
            required
          />
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="costo_propiedad">Costo de Propiedad</Label>
          <Input
            id="costo_propiedad"
            name="costo_propiedad"
            type="number"
            value={formData.costo_propiedad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo_propiedad">Modelo de Propiedad</Label>
          <Input
            id="modelo_propiedad"
            name="modelo_propiedad"
            value={formData.modelo_propiedad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="uso_propiedad">Uso de Propiedad</Label>
          <Input
            id="uso_propiedad"
            name="uso_propiedad"
            value={formData.uso_propiedad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendedor">Vendedor</Label>
          <Input
            id="vendedor"
            name="vendedor"
            value={formData.vendedor}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentos">
            Documentos <span className="text-red-800">*</span>
          </Label>
          <Input
            id="documentos"
            name="documentos"
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comentarios">Comentarios</Label>
        <Textarea
          id="comentarios"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit">
        {policy ? "Actualizar Prestamo" : "Solicitar Prestamo"}
      </Button>
    </form>
  );
}
