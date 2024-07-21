import { useState } from "react";

function ClientForm({ onSubmit }: any) {
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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleLatChange = (e: any) => {
    setNewClient({
      ...newClient,
      pin_localidad: {
        ...newClient.pin_localidad,
        lat: parseFloat(e.target.value),
      },
    });
  };

  const handleLongChange = (e: any) => {
    setNewClient({
      ...newClient,
      pin_localidad: {
        ...newClient.pin_localidad,
        long: parseFloat(e.target.value),
      },
    });
  };

  const handleCheckboxChange = (e: any) => {
    setNewClient({
      ...newClient,
      seguro_comprado: e.target.checked,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(newClient);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-4"
    >
      <h2 className="text-xl font-semibold mb-4">Crear Nuevo Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={newClient.nombre}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="direccion_residencial"
          placeholder="Dirección Residencial"
          value={newClient.direccion_residencial}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="direccion_unidad"
          placeholder="Dirección de la Unidad"
          value={newClient.direccion_unidad}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />

        <div className="flex flex-col">
          <label>Latitud</label>
          <input
            type="number"
            name="pin_localidad_lat"
            placeholder="Latitud"
            value={newClient.pin_localidad.lat}
            onChange={handleLatChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label>Longitud</label>
          <input
            type="number"
            name="pin_localidad_long"
            placeholder="Longitud"
            value={newClient.pin_localidad.long}
            onChange={handleLongChange}
            className="border p-2 rounded"
          />
        </div>
        <input
          type="text"
          name="propietario_terreno"
          placeholder="Propietario del Terreno"
          value={newClient.propietario_terreno}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="proposito_unidad"
          placeholder="Propósito de la Unidad"
          value={newClient.proposito_unidad}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="estado_civil"
          placeholder="Estado Civil"
          value={newClient.estado_civil}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="lugar_empleo"
          placeholder="Lugar de Empleo"
          value={newClient.lugar_empleo}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newClient.email}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="identificacion"
          placeholder="Identificación"
          value={newClient.identificacion}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={newClient.telefono}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="tel"
          name="telefono_alterno"
          placeholder="Teléfono Alterno"
          value={newClient.telefono_alterno}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="forma_pago"
          placeholder="Forma de Pago"
          value={newClient.forma_pago}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="contacto_referencia"
          placeholder="Contacto de Referencia"
          value={newClient.contacto_referencia}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="asegurador"
          placeholder="Asegurador"
          value={newClient.asegurador}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="seguro_comprado"
            checked={newClient.seguro_comprado}
            onChange={handleCheckboxChange}
          />
          <span>Seguro Comprado</span>
        </label>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Crear Cliente
      </button>
    </form>
  );
}

export default ClientForm;
