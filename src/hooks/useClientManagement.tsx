import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const useClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);

  const { data: session } = useSession();

  const openClientForm = (client = null) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const closeClientForm = () => {
    setCurrentClient(null);
    setIsClientFormModalOpen(false);
  };

  const handleCreateClient = async (clientData) => {
    try {
      const response = await fetch(`/api/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clientData, vendedor: session.user?.email }),
      });
      if (response.ok) {
        await fetchClients(); // Refresca la lista de clientes
        closeClientForm();
      } else {
        console.error("Failed to create client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      const response = await fetch(`/api/client?id=${clientData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (response.ok) {
        await fetchClients(); // Refresca la lista de clientes
        closeClientForm();
      } else {
        console.error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleSaveClient = (clientData) => {
    if (clientData._id) {
      handleUpdateClient(clientData);
    } else {
      handleCreateClient(clientData);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/client");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    currentClient,
    isClientFormModalOpen,
    openClientForm,
    closeClientForm,
    handleCreateClient,
    handleUpdateClient,
    handleSaveClient,
  };
};
