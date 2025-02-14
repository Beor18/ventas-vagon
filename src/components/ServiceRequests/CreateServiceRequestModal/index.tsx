"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "@/components/FormFields";
import { ServiceRequest } from "@/types/types";
import { useSession } from "next-auth/react";
import { useClientManagement } from "@/hooks/useClientManagement";
import { useProducts } from "@/hooks/useProducts";
import { upload } from "@vercel/blob/client";
import { X } from "lucide-react";

interface CreateServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<ServiceRequest, "_id">) => void;
}

export function CreateServiceRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateServiceRequestModalProps) {
  const { data: session } = useSession();
  const { clients } = useClientManagement();
  const { products, loading } = useProducts();
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({
    client: "",
    town: "",
    problem: "",
    installer: "",
    product: "",
    seller: session?.user?.id || "",
    assignedEquipment: "",
    claimDate: new Date(),
    assignmentDate: new Date(),
    images: [],
    comments: [],
    status: "pending",
    type: "delivery",
    warranty: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const installersRes = await fetch("/api/installers");
        const installersData = await installersRes.json();

        setInstallers(installersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.problem || !formData.installer) {
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        files.map((file) =>
          upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        )
      );

      const requestData = {
        ...formData,
        images: uploadedUrls.map((res) => res.url),
      } as Omit<ServiceRequest, "_id">;

      await onSubmit(requestData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Servicio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                name="client"
                value={formData.client}
                onValueChange={(value) => handleSelectChange("client", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="town">Pueblo</Label>
              <Input
                id="town"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installer">Instalador</Label>
              <Select
                name="installer"
                value={formData.installer}
                onValueChange={(value) =>
                  handleSelectChange("installer", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar instalador" />
                </SelectTrigger>
                <SelectContent>
                  {installers.map((installer: any) => (
                    <SelectItem key={installer._id} value={installer._id}>
                      {installer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Producto</Label>
              <Select
                name="product"
                value={formData.product}
                onValueChange={(value) => handleSelectChange("product", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {!loading &&
                    products?.map((product: any) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Solicitud</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="installation">Instalación</SelectItem>
                  <SelectItem value="repair">Reparación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedEquipment">Equipo Asignado</Label>
              <Input
                id="assignedEquipment"
                name="assignedEquipment"
                value={formData.assignedEquipment}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimDate">Fecha de Reclamación</Label>
              <Input
                type="date"
                id="claimDate"
                name="claimDate"
                value={format(
                  new Date(formData.claimDate || Date.now()),
                  "yyyy-MM-dd"
                )}
                onChange={(e) =>
                  handleSelectChange(
                    "claimDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentDate">Fecha de Asignación</Label>
              <Input
                type="date"
                id="assignmentDate"
                name="assignmentDate"
                value={format(
                  new Date(formData.assignmentDate || Date.now()),
                  "yyyy-MM-dd"
                )}
                onChange={(e) =>
                  handleSelectChange(
                    "assignmentDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionDate">Fecha de Resolución</Label>
              <Input
                type="date"
                id="resolutionDate"
                name="resolutionDate"
                value={
                  formData.resolutionDate
                    ? format(new Date(formData.resolutionDate), "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) =>
                  handleSelectChange(
                    "resolutionDate",
                    new Date(e.target.value).toISOString()
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problema</Label>
            <Textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Imágenes</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file, i) => (
                  <div key={i} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                      onClick={() =>
                        setFiles(files.filter((_, index) => index !== i))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={files.length === 0}>
              Crear Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
