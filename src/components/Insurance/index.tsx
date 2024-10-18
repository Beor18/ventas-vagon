import { useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { format } from "date-fns";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InsurancePolicy {
  _id: string;
  nombre: string;
  direccion_postal: string;
  direccion_fisica: string;
  fecha_nacimiento: string;
  telefono_contacto: string;
  costo_propiedad: number;
  modelo_propiedad: string;
  uso_propiedad: string;
  vendedor: string;
  comentarios: string;
  documentos: string[];
  createdAt: string;
  updatedAt: string;
}

export default function InsurancePolicies() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    nombre: "",
    direccion_postal: "",
    direccion_fisica: "",
    fecha_nacimiento: "",
    telefono_contacto: "",
    costo_propiedad: 0,
    modelo_propiedad: "",
    uso_propiedad: "",
    vendedor: "",
    comentarios: "",
    documentos: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/seguro");
      if (!response.ok) {
        throw new Error("Failed to fetch insurance policies");
      }
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error("Error fetching insurance policies:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta póliza?")) {
      try {
        const response = await fetch(`/api/seguro?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete insurance policy");
        }
        fetchPolicies();
      } catch (error) {
        console.error("Error deleting insurance policy:", error);
      }
    }
  };

  const handleEdit = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
    setIsEditModalOpen(true);
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uploadedUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });
          return blob.url;
        })
      );

      const policyWithDocuments = {
        ...newPolicy,
        documentos: uploadedUrls,
      };

      const response = await fetch("/api/seguro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policyWithDocuments),
      });
      if (!response.ok) {
        throw new Error("Failed to create insurance policy");
      }
      const createdPolicy = await response.json();
      fetchPolicies();
      setIsCreateModalOpen(false);
      setNewPolicy({
        nombre: "",
        direccion_postal: "",
        direccion_fisica: "",
        fecha_nacimiento: "",
        telefono_contacto: "",
        costo_propiedad: 0,
        modelo_propiedad: "",
        uso_propiedad: "",
        vendedor: "",
        comentarios: "",
        documentos: [],
      });
      setUploadedFiles([]);
      toast({
        title: "Éxito",
        description: "La póliza de seguro se creó correctamente.",
      });
      await sendPolicyEmail(createdPolicy, true);
    } catch (error) {
      console.error("Error creating insurance policy:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la póliza de seguro.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    try {
      const uploadedUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });
          return blob.url;
        })
      );

      const updatedPolicy = {
        ...selectedPolicy,
        documentos: [...selectedPolicy.documentos, ...uploadedUrls],
      };

      const response = await fetch(`/api/seguro?id=${selectedPolicy._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPolicy),
      });
      if (!response.ok) {
        throw new Error("Failed to update insurance policy");
      }
      fetchPolicies();
      setIsEditModalOpen(false);
      setSelectedPolicy(null);
      setUploadedFiles([]);
      toast({
        title: "Éxito",
        description: "La póliza de seguro se actualizó correctamente.",
      });
      await sendPolicyEmail(updatedPolicy, false);
    } catch (error) {
      console.error("Error updating insurance policy:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la póliza de seguro.",
        variant: "destructive",
      });
    }
  };

  const sendPolicyEmail = async (policy: InsurancePolicy, isNew: boolean) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "ventas@vagonpuertorico.com",
          subject: isNew
            ? "Nueva Póliza de Seguro Creada"
            : "Póliza de Seguro Actualizada",
          text: `
            Detalles de la póliza:
            Nombre: ${policy.nombre}
            Dirección Postal: ${policy.direccion_postal}
            Dirección Física: ${policy.direccion_fisica}
            Fecha de Nacimiento: ${policy.fecha_nacimiento}
            Teléfono de Contacto: ${policy.telefono_contacto}
            Costo de Propiedad: ${policy.costo_propiedad}
            Modelo de Propiedad: ${policy.modelo_propiedad}
            Uso de Propiedad: ${policy.uso_propiedad}
            Vendedor: ${policy.vendedor}
            Comentarios: ${policy.comentarios}
            Documentos: ${policy.documentos.join(", ")}
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Advertencia",
        description:
          "La póliza se guardó, pero hubo un problema al enviar el correo electrónico.",
        //variant: "warning",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPolicy((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectedPolicy((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pólizas de Seguro</CardTitle>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Seguro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Póliza de Seguro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={newPolicy.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono_contacto">
                    Teléfono de Contacto
                  </Label>
                  <Input
                    id="telefono_contacto"
                    name="telefono_contacto"
                    value={newPolicy.telefono_contacto}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion_postal">Dirección Postal</Label>
                  <Input
                    id="direccion_postal"
                    name="direccion_postal"
                    value={newPolicy.direccion_postal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion_fisica">Dirección Física</Label>
                  <Input
                    id="direccion_fisica"
                    name="direccion_fisica"
                    value={newPolicy.direccion_fisica}
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
                    value={newPolicy.fecha_nacimiento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo_propiedad">Costo de Propiedad</Label>
                  <Input
                    id="costo_propiedad"
                    name="costo_propiedad"
                    type="number"
                    value={newPolicy.costo_propiedad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo_propiedad">Modelo de Propiedad</Label>
                  <Input
                    id="modelo_propiedad"
                    name="modelo_propiedad"
                    value={newPolicy.modelo_propiedad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uso_propiedad">Uso de Propiedad</Label>
                  <Input
                    id="uso_propiedad"
                    name="uso_propiedad"
                    value={newPolicy.uso_propiedad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendedor">Vendedor</Label>
                  <Input
                    id="vendedor"
                    name="vendedor"
                    value={newPolicy.vendedor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentos">Documentos</Label>
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
                  value={newPolicy.comentarios}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit">Crear Póliza</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Costo de Propiedad</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy._id}>
                <TableCell>{policy.nombre}</TableCell>
                <TableCell>{policy.telefono_contacto}</TableCell>
                <TableCell>
                  ${policy.costo_propiedad.toLocaleString()}
                </TableCell>
                <TableCell>{policy.vendedor}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedPolicy(policy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Póliza</DialogTitle>
                        </DialogHeader>
                        {selectedPolicy && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p>
                                <strong>Nombre:</strong> {selectedPolicy.nombre}
                              </p>
                              <p>
                                <strong>Dirección Postal:</strong>{" "}
                                {selectedPolicy.direccion_postal}
                              </p>
                              <p>
                                <strong>Dirección Física:</strong>{" "}
                                {selectedPolicy.direccion_fisica}
                              </p>
                              <p>
                                <strong>Fecha de Nacimiento:</strong>{" "}
                                {format(
                                  new Date(selectedPolicy.fecha_nacimiento),
                                  "dd/MM/yyyy"
                                )}
                              </p>
                              <p>
                                <strong>Teléfono:</strong>{" "}
                                {selectedPolicy.telefono_contacto}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Costo de Propiedad:</strong> $
                                {selectedPolicy.costo_propiedad.toLocaleString()}
                              </p>
                              <p>
                                <strong>Modelo de Propiedad:</strong>{" "}
                                {selectedPolicy.modelo_propiedad}
                              </p>
                              <p>
                                <strong>Uso de Propiedad:</strong>{" "}
                                {selectedPolicy.uso_propiedad}
                              </p>
                              <p>
                                <strong>Vendedor:</strong>{" "}
                                {selectedPolicy.vendedor}
                              </p>
                              <p>
                                <strong>Comentarios:</strong>{" "}
                                {selectedPolicy.comentarios}
                              </p>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold mb-2">
                                Documentos:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selectedPolicy.documentos.map((doc, index) => (
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
                        )}
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isEditModalOpen}
                      onOpenChange={setIsEditModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(policy)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Editar Póliza de Seguro</DialogTitle>
                        </DialogHeader>
                        {selectedPolicy && (
                          <form
                            onSubmit={handleUpdatePolicy}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-nombre">Nombre</Label>
                                <Input
                                  id="edit-nombre"
                                  name="nombre"
                                  value={selectedPolicy.nombre}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-telefono_contacto">
                                  Teléfono de Contacto
                                </Label>
                                <Input
                                  id="edit-telefono_contacto"
                                  name="telefono_contacto"
                                  value={selectedPolicy.telefono_contacto}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-direccion_postal">
                                  Dirección Postal
                                </Label>
                                <Input
                                  id="edit-direccion_postal"
                                  name="direccion_postal"
                                  value={selectedPolicy.direccion_postal}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-direccion_fisica">
                                  Dirección Física
                                </Label>
                                <Input
                                  id="edit-direccion_fisica"
                                  name="direccion_fisica"
                                  value={selectedPolicy.direccion_fisica}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-fecha_nacimiento">
                                  Fecha de Nacimiento
                                </Label>
                                <Input
                                  id="edit-fecha_nacimiento"
                                  name="fecha_nacimiento"
                                  type="date"
                                  value={
                                    selectedPolicy.fecha_nacimiento.split(
                                      "T"
                                    )[0]
                                  }
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-costo_propiedad">
                                  Costo de Propiedad
                                </Label>
                                <Input
                                  id="edit-costo_propiedad"
                                  name="costo_propiedad"
                                  type="number"
                                  value={selectedPolicy.costo_propiedad}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-modelo_propiedad">
                                  Modelo de Propiedad
                                </Label>
                                <Input
                                  id="edit-modelo_propiedad"
                                  name="modelo_propiedad"
                                  value={selectedPolicy.modelo_propiedad}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-uso_propiedad">
                                  Uso de Propiedad
                                </Label>
                                <Input
                                  id="edit-uso_propiedad"
                                  name="uso_propiedad"
                                  value={selectedPolicy.uso_propiedad}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-vendedor">Vendedor</Label>
                                <Input
                                  id="edit-vendedor"
                                  name="vendedor"
                                  value={selectedPolicy.vendedor}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-comentarios">
                                Comentarios
                              </Label>
                              <Textarea
                                id="edit-comentarios"
                                name="comentarios"
                                value={selectedPolicy.comentarios}
                                onChange={handleEditInputChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-documentos">
                                Documentos Adicionales
                              </Label>
                              <Input
                                id="edit-documentos"
                                name="documentos"
                                type="file"
                                onChange={handleFileChange}
                                multiple
                              />
                            </div>
                            <Button type="submit">Actualizar Póliza</Button>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(policy._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
