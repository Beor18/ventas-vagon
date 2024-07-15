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

  const handleProductChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const addOption = () => {
    setOptions([...options, newOption]);
    setNewOption({
      name: "",
      price: 0,
      imageUrl: "",
      type: "",
      specification: "",
      pcs: 0,
    });
  };

  const saveProduct = async () => {
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
  };

  // const [order, setOrder] = useState({
  //   client: "",
  //   productId: "",
  //   quantity: 1,
  //   total: 0,
  //   status: "",
  // });

  // const handleOrderChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setOrder({ ...order, [name]: value });
  // };

  // const saveOrder = async () => {
  //   const selectedProduct = products.find(
  //     (p: any) => p._id === order.productId
  //   );
  //   const total = selectedProduct.basePrice * order.quantity;

  //   await fetch("/api/orders", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ ...order, total }),
  //   });
  //   setOrder({ client: "", productId: "", quantity: 1, total: 0, status: "" });
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Gestión de Productos */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
        <div className="mb-4">
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
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleProductChange}
              placeholder="Image URL"
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
          <button
            onClick={saveProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Save Product
          </button>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Add Option</h2>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Option Name
            </label>
            <input
              type="text"
              name="name"
              value={newOption.name}
              onChange={handleOptionChange}
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
              onChange={handleOptionChange}
              placeholder="Option Price"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={newOption.imageUrl}
              onChange={handleOptionChange}
              placeholder="Image URL"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Specification
            </label>
            <textarea
              name="specification"
              value={newOption.specification}
              onChange={handleOptionChange}
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
              onChange={handleOptionChange}
              placeholder="PCS"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={addOption}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Add Option
          </button>
        </div>
        <ul className="list-disc pl-5">
          {options.map((option: any, index: any) => (
            <li key={index} className="mb-2">
              {option.name} - ${option.price}
            </li>
          ))}
        </ul>
      </section>

      {/* Gestión de Órdenes */}
      {/* <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Gestión de Órdenes</h2>
        <div className="mb-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              name="client"
              value={order.client}
              onChange={handleOrderChange}
              placeholder="Nombre del Cliente"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Producto
            </label>
            <select
              name="productId"
              value={order.productId}
              onChange={handleOrderChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              {products.map((product: any) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              value={order.quantity}
              onChange={handleOrderChange}
              placeholder="Cantidad"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={saveOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Guardar Orden
          </button>
        </div>
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
