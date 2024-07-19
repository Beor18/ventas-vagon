/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProductOption {
  _id: string;
  name: string;
  price: number;
  suboptions?: ProductSubOption[];
}

interface ProductSubOption {
  _id: string;
  name: string;
  price: number;
  code?: string;
  details?: string;
  imageUrl?: string;
}

interface SelectedOptions {
  [key: string]: ProductOption;
}

interface SelectedSubOptions {
  [key: string]: {
    [key: string]: ProductSubOption;
  };
}

export default function Select({ product, onClose }: any) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedSubOptions, setSelectedSubOptions] =
    useState<SelectedSubOptions>({});
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

  const handleOptionSelect = (option: ProductOption) => {
    setSelectedOptions({ ...selectedOptions, [option._id]: option });
  };

  const handleOptionDeselect = (optionId: string) => {
    const newSelectedOptions = { ...selectedOptions };
    delete newSelectedOptions[optionId];
    setSelectedOptions(newSelectedOptions);

    const newSelectedSubOptions = { ...selectedSubOptions };
    delete newSelectedSubOptions[optionId];
    setSelectedSubOptions(newSelectedSubOptions);
  };

  const handleSubOptionSelect = (
    optionId: string,
    subOption: ProductSubOption
  ) => {
    setSelectedSubOptions({
      ...selectedSubOptions,
      [optionId]: {
        ...selectedSubOptions[optionId],
        [subOption._id]: subOption,
      },
    });
  };

  const handleSubOptionDeselect = (optionId: string, subOptionId: string) => {
    const newSelectedSubOptions = { ...selectedSubOptions };
    if (newSelectedSubOptions[optionId]) {
      delete newSelectedSubOptions[optionId][subOptionId];
      if (Object.keys(newSelectedSubOptions[optionId]).length === 0) {
        delete newSelectedSubOptions[optionId];
      }
    }
    setSelectedSubOptions(newSelectedSubOptions);
  };

  const calculateTotal = () => {
    const basePrice = product?.basePrice || 0;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.price,
      0
    );
    const subOptionsPrice = Object.values(selectedSubOptions).reduce(
      (sum, subOptions) =>
        sum +
        Object.values(subOptions).reduce(
          (subSum, subOption) => subSum + subOption.price,
          0
        ),
      0
    );
    const subtotal = basePrice + optionsPrice + subOptionsPrice;
    const total = subtotal + subtotal * (tax / 100) - discount;
    return total;
  };

  const exportOrder = async () => {
    const preparedOptions = Object.values(selectedOptions).map((option) => ({
      ...option,
      suboptions: selectedSubOptions[option._id]
        ? Object.values(selectedSubOptions[option._id])
        : [],
    }));

    const order = {
      productId: product?._id,
      productName: product?.name,
      options: preparedOptions,
      total: calculateTotal(),
      discount,
      tax,
      vendedorEmail: session?.user?.email,
      vendedorName: session?.user?.name,
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

      alert("Orden guardada exitosamente");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la orden");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{product?.name}</h2>
      <p className="text-gray-700 mb-4">Base Price: ${product?.basePrice}</p>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Opciones: </h3>
          </div>
          <div className="overflow-auto max-h-96 border p-2 rounded-lg">
            {product?.options.map((option: ProductOption) => (
              <div key={option._id} className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {option.name}
                  </span>
                  <span className="text-gray-600">${option.price}</span>
                  {selectedOptions[option._id] ? (
                    <button
                      onClick={() => handleOptionDeselect(option._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOptionSelect(option)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Select
                    </button>
                  )}
                </div>
                {selectedOptions[option._id] && option.suboptions && (
                  <div className="ml-4 mt-2 overflow-auto max-h-48 border-l-2 border-gray-200 pl-2">
                    {option.suboptions.map((subOption: ProductSubOption) => (
                      <div
                        key={subOption._id}
                        className="flex items-center justify-between mb-2"
                      >
                        <img
                          src={subOption.imageUrl}
                          alt={subOption.name}
                          className="w-10 h-10 mr-2"
                        />
                        <span className="font-medium text-gray-800">
                          {subOption.name}
                        </span>
                        <span className="text-gray-600">
                          ${subOption.price}
                        </span>
                        {selectedSubOptions[option._id] &&
                        selectedSubOptions[option._id][subOption._id] ? (
                          <button
                            onClick={() =>
                              handleSubOptionDeselect(option._id, subOption._id)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleSubOptionSelect(option._id, subOption)
                            }
                            className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
        <h3 className="text-lg font-semibold mb-4">
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
