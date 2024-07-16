/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "@Src/models/Product";
import Order from "@Src/models/Order";
import withAuth from "../lib/withAuth";

function Admin({ products, orders }: any) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    imageUrl: "",
    quantity: 1,
    material: "",
    externalDimensions: "",
    internalDimensions: "",
    foldingState: "",
    totalWeight: 0,
    basePrice: 0,
  });
  const [options, setOptions] = useState<any>([]);
  const [newOption, setNewOption] = useState<any>({
    name: "",
    price: 0,
    imageUrl: "",
    type: "",
    specification: "",
    pcs: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleProductChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleOptionChange = (e: any, index: number) => {
    const { name, value } = e.target;
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [name]: value };
    setOptions(updatedOptions);
  };

  const handleNewOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const addOption = () => {
    setOptions([...options, { ...newOption }]);
    setNewOption({
      name: "",
      price: 0,
      imageUrl: "",
      type: "",
      specification: "",
      pcs: 0,
    });
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_: any, i: number) => i !== index);
    setOptions(updatedOptions);
  };

  const handleImageUpload = async (e: any, callback: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      callback(data.filePath);
    } catch (error) {
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    setLoading(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, options }),
      });
      setProduct({
        name: "",
        description: "",
        imageUrl: "",
        quantity: 1,
        material: "",
        externalDimensions: "",
        internalDimensions: "",
        foldingState: "",
        totalWeight: 0,
        basePrice: 0,
      });
      setOptions([]);
      setMessage("Product saved successfully");
    } catch (error) {
      setMessage("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Gestión de Productos */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add New Product
        </button>

        {modalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        New Product
                      </h3>
                      <div className="mt-2">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Product Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleProductChange}
                            placeholder="Product Name"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={product.description}
                            onChange={handleProductChange}
                            placeholder="Product Description"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Image
                          </label>
                          <input
                            type="file"
                            name="image"
                            onChange={(e) =>
                              handleImageUpload(e, (filePath: string) =>
                                setProduct({ ...product, imageUrl: filePath })
                              )
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleProductChange}
                            placeholder="Quantity"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Material
                          </label>
                          <input
                            type="text"
                            name="material"
                            value={product.material}
                            onChange={handleProductChange}
                            placeholder="Material"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            External Dimensions
                          </label>
                          <input
                            type="text"
                            name="externalDimensions"
                            value={product.externalDimensions}
                            onChange={handleProductChange}
                            placeholder="External Dimensions"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Internal Dimensions
                          </label>
                          <input
                            type="text"
                            name="internalDimensions"
                            value={product.internalDimensions}
                            onChange={handleProductChange}
                            placeholder="Internal Dimensions"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Folding State
                          </label>
                          <input
                            type="text"
                            name="foldingState"
                            value={product.foldingState}
                            onChange={handleProductChange}
                            placeholder="Folding State"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Total Weight
                          </label>
                          <input
                            type="number"
                            name="totalWeight"
                            value={product.totalWeight}
                            onChange={handleProductChange}
                            placeholder="Total Weight"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Base Price
                          </label>
                          <input
                            type="number"
                            name="basePrice"
                            value={product.basePrice}
                            onChange={handleProductChange}
                            placeholder="Base Price"
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                        {/* Opciones */}
                        <h4 className="text-lg font-medium text-gray-900 mt-4">
                          Options
                        </h4>
                        {options.map((option: any, index: number) => (
                          <div key={index} className="mb-2 border-b pb-2">
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Option Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={option.name}
                                onChange={(e) => handleOptionChange(e, index)}
                                placeholder="Option Name"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Option Price
                              </label>
                              <input
                                type="number"
                                name="price"
                                value={option.price}
                                onChange={(e) => handleOptionChange(e, index)}
                                placeholder="Option Price"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Option Image
                              </label>
                              <input
                                type="file"
                                name="image"
                                onChange={(e) =>
                                  handleImageUpload(e, (filePath: string) => {
                                    const updatedOptions = [...options];
                                    updatedOptions[index] = {
                                      ...updatedOptions[index],
                                      imageUrl: filePath,
                                    };
                                    setOptions(updatedOptions);
                                  })
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Option Type
                              </label>
                              <input
                                type="text"
                                name="type"
                                value={option.type}
                                onChange={(e) => handleOptionChange(e, index)}
                                placeholder="Option Type"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Specification
                              </label>
                              <input
                                type="text"
                                name="specification"
                                value={option.specification}
                                onChange={(e) => handleOptionChange(e, index)}
                                placeholder="Specification"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                PCS
                              </label>
                              <input
                                type="number"
                                name="pcs"
                                value={option.pcs}
                                onChange={(e) => handleOptionChange(e, index)}
                                placeholder="PCS"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            </div>
                            <button
                              onClick={() => removeOption(index)}
                              className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                              Remove Option
                            </button>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <h4 className="text-lg font-medium text-gray-900 mt-4">
                            Add New Option
                          </h4>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Option Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={newOption.name}
                              onChange={handleNewOptionChange}
                              placeholder="Option Name"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Option Price
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={newOption.price}
                              onChange={handleNewOptionChange}
                              placeholder="Option Price"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Option Image
                            </label>
                            <input
                              type="file"
                              name="image"
                              onChange={(e) =>
                                handleImageUpload(e, (filePath: string) =>
                                  setNewOption({
                                    ...newOption,
                                    imageUrl: filePath,
                                  })
                                )
                              }
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Option Type
                            </label>
                            <input
                              type="text"
                              name="type"
                              value={newOption.type}
                              onChange={handleNewOptionChange}
                              placeholder="Option Type"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Specification
                            </label>
                            <input
                              type="text"
                              name="specification"
                              value={newOption.specification}
                              onChange={handleNewOptionChange}
                              placeholder="Specification"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              PCS
                            </label>
                            <input
                              type="number"
                              name="pcs"
                              value={newOption.pcs}
                              onChange={handleNewOptionChange}
                              placeholder="PCS"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                          </div>
                          <button
                            onClick={addOption}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          >
                            Add Option
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={saveProduct}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {message && <div className="mt-4 text-red-500">{message}</div>}
      </section>

      {/* Gestión de Órdenes */}
      {/* <section>
        <h2 className="text-xl font-bold mb-2">Gestión de Órdenes</h2>
        <ul>
          {orders.map((order: any) => (
            <li
              key={order._id}
              className="mb-2 p-2 border border-gray-300 rounded-md"
            >
              <p>Order ID: {order._id}</p>
              <p>Client Name: {order.clientName}</p>
              <p>Total Price: {order.totalPrice}</p>
              <ul>
                {order.items.map((item: any) => (
                  <li key={item._id} className="ml-4">
                    {item.name} - {item.quantity} pcs
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section> */}
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();

  const products = await Product.find().lean();
  const orders = await Order.find().lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default withAuth(Admin, ["Administrador"]);
