import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function ClientForm({ onSubmit, initialClientData }: any) {
  const [newClient, setNewClient] = useState({
    nombre: "",
    direccion_residencial: "",
    direccion_unidad: "",
    pin_localidad: { lat: 0, long: 0 },
    informacion_terreno: { fotos: [], videos: [] },
    propietario_terreno: "",
    proposito_unidad: "",
    estado_civil: "",
    lugar_empleo: "",
    email: "",
    identificacion: "",
    telefono: "",
    telefono_alterno: "",
    contrato_firmado: "",
    forma_pago: "",
    contacto_referencia: "",
    asegurador: "",
    seguro_comprado: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    identificacion: "",
  });

  useEffect(() => {
    if (initialClientData) {
      setNewClient(initialClientData);
    }
  }, [initialClientData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({
      ...newClient,
      pin_localidad: {
        ...newClient.pin_localidad,
        lat: parseFloat(e.target.value),
      },
    });
  };

  const handleLongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({
      ...newClient,
      pin_localidad: {
        ...newClient.pin_localidad,
        long: parseFloat(e.target.value),
      },
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewClient({
      ...newClient,
      seguro_comprado: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialClientData) {
      // Validación de identificación única
      const idCheckResponse = await fetch(
        `/api/client/check?identificacion=${newClient.identificacion}`
      );
      const idCheckResult = await idCheckResponse.json();
      if (idCheckResult.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          identificacion: "La identificación ya está registrada",
        }));
        return;
      }

      // Validación de correo único
      const emailCheckResponse = await fetch(
        `/api/client/check?email=${newClient.email}`
      );
      const emailCheckResult = await emailCheckResponse.json();
      if (emailCheckResult.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "El correo ya está registrado",
        }));
        return;
      }

      setErrors({ email: "", identificacion: "" });
    }

    onSubmit(newClient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialClientData ? "Actualizar Cliente" : "Crear Nuevo Cliente"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={newClient.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion_residencial">Dirección Residencial</Label>
          <Input
            id="direccion_residencial"
            name="direccion_residencial"
            value={newClient.direccion_residencial}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion_unidad">Dirección de la Unidad</Label>
          <Input
            id="direccion_unidad"
            name="direccion_unidad"
            value={newClient.direccion_unidad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin_localidad_lat">Latitud</Label>
          <Input
            id="pin_localidad_lat"
            name="pin_localidad_lat"
            type="number"
            value={newClient?.pin_localidad?.lat}
            onChange={handleLatChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin_localidad_long">Longitud</Label>
          <Input
            id="pin_localidad_long"
            name="pin_localidad_long"
            type="number"
            value={newClient?.pin_localidad?.long}
            onChange={handleLongChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propietario_terreno">Propietario del Terreno</Label>
          <Input
            id="propietario_terreno"
            name="propietario_terreno"
            value={newClient?.propietario_terreno}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proposito_unidad">Propósito de la Unidad</Label>
          <Input
            id="proposito_unidad"
            name="proposito_unidad"
            value={newClient.proposito_unidad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado_civil">Estado Civil</Label>
          <select
            id="estado_civil"
            name="estado_civil"
            value={newClient.estado_civil}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione</option>
            <option value="Casado">Casado</option>
            <option value="Soltero">Soltero</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lugar_empleo">Lugar de Empleo</Label>
          <Input
            id="lugar_empleo"
            name="lugar_empleo"
            value={newClient.lugar_empleo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newClient.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="identificacion">Identificación (único)</Label>
          <Input
            id="identificacion"
            name="identificacion"
            value={newClient.identificacion}
            onChange={handleInputChange}
            required
          />
          {errors.identificacion && (
            <p className="text-red-500 text-sm">{errors.identificacion}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={newClient.telefono}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono_alterno">Teléfono Alterno</Label>
          <Input
            id="telefono_alterno"
            name="telefono_alterno"
            type="tel"
            value={newClient.telefono_alterno}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="forma_pago">Forma de Pago</Label>
          <Input
            id="forma_pago"
            name="forma_pago"
            value={newClient.forma_pago}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contacto_referencia">Contacto de Referencia</Label>
          <Input
            id="contacto_referencia"
            name="contacto_referencia"
            value={newClient.contacto_referencia}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asegurador">Asegurador</Label>
          <Input
            id="asegurador"
            name="asegurador"
            value={newClient.asegurador}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="seguro_comprado"
            checked={newClient.seguro_comprado}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="seguro_comprado">Seguro Comprado</Label>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {initialClientData ? "Actualizar Cliente" : "Crear Cliente"}
      </Button>
    </form>
  );
}

export default ClientForm;
