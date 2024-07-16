import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as XLSX from "xlsx";

export default function Select({ product, onClose }: any) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  };

  const handleOptionSelect = (option: any) => {
    setSelectedOptions({ ...selectedOptions, [option.type]: option });
  };

  const calculateTotal = () => {
    const basePrice = product?.basePrice;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option: any) => sum + option.price,
      0
    );
    const subtotal = basePrice + optionsPrice;
    const total = subtotal + subtotal * (tax / 100) - discount;
    return total;
  };

  const exportOrder = async () => {
    const order = {
      productId: product?._id,
      productName: product?.name,
      options: selectedOptions,
      total: calculateTotal(),
      discount,
      tax,
      session,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la orden");
      }

      // Opcional: Si deseas manejar alguna acción adicional al guardar la orden
      alert("Orden guardada exitosamente");

      // // Generar y descargar el archivo Excel
      // const worksheet = XLSX.utils.json_to_sheet([order]);
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workbook, worksheet, "Order");
      // XLSX.writeFile(workbook, "order.xlsx");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la orden");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{product?.name}</h2>
      <p className="text-gray-700 mb-4">Base Price: ${product?.basePrice}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <h2>Opciones: </h2>
          </div>
          <div>
            {product?.options.map((option: any) => (
              <button
                key={option._id}
                onClick={() => handleOptionSelect(option)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {option.name} - ${option.price}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax (%)
          </label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            placeholder="Tax (%)"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="Discount"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>
      <div className="text-right">
        <h3 className="text-lg font-semibold mb-2">
          Total: ${calculateTotal()}
        </h3>
        <button
          onClick={exportOrder}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Crear Orden
        </button>
      </div>
    </div>
  );
}
