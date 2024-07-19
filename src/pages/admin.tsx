/* eslint-disable @next/next/no-img-element */
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "@Src/models/Product";
import Order from "@Src/models/Order";
import withAuth from "../lib/withAuth";
import ProductForm from "@Src/components/ProductForm";

interface ProductType {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  material: string;
  externalDimensions: string;
  internalDimensions: string;
  foldingState: string;
  totalWeight: number;
  basePrice: number;
  options: OptionType[];
}

interface OptionType {
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  specification: string;
  pcs: number;
  suboptions: SubOptionType[];
}

interface SubOptionType {
  code: string;
  price: number;
  imageUrl: string;
  details: string;
  name: string;
}

const Admin = ({ initialProducts, orders }: any) => {
  const [products, setProducts] = useState(initialProducts);
  const [product, setProduct] = useState<ProductType>({
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
    options: [],
  });
  const [imagePreview, setImagePreview] = useState("");
  const [newOption, setNewOption] = useState<OptionType>({
    name: "",
    price: 0,
    imageUrl: "",
    type: "",
    specification: "",
    pcs: 0,
    suboptions: [],
  });
  const [newSubOption, setNewSubOption] = useState<SubOptionType>({
    code: "",
    price: 0,
    imageUrl: "",
    details: "",
    name: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleProductChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleOptionChange = (e: any, optionIndex: number) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleSubOptionChange = (
    e: any,
    optionIndex: number,
    subOptionIndex: number
  ) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions[subOptionIndex] = {
      ...updatedOptions[optionIndex].suboptions[subOptionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleNewOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const handleNewSubOptionChange = (e: any) => {
    const { name, value } = e.target;
    setNewSubOption({ ...newSubOption, [name]: value });
  };

  const addOption = () => {
    setProduct({
      ...product,
      options: [...product.options, { ...newOption, suboptions: [] }],
    });
    setNewOption({
      name: "",
      price: 0,
      imageUrl: "",
      type: "",
      specification: "",
      pcs: 0,
      suboptions: [],
    });
  };

  const addSubOption = (optionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions.push({ ...newSubOption });
    setProduct({ ...product, options: updatedOptions });
    setNewSubOption({
      code: "",
      price: 0,
      imageUrl: "",
      details: "",
      name: "",
    });
  };

  const removeOption = (optionIndex: number) => {
    const updatedOptions = product.options.filter(
      (_: any, i: number) => i !== optionIndex
    );
    setProduct({ ...product, options: updatedOptions });
  };

  const removeSubOption = (optionIndex: number, subOptionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions = updatedOptions[
      optionIndex
    ].suboptions.filter((_: any, i: number) => i !== subOptionIndex);
    setProduct({ ...product, options: updatedOptions });
  };

  const handleImageUpload = async (file: File, callback: any) => {
    setLoading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      callback(newBlob.url);
    } catch (error) {
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = async (
    e: any,
    setImageUrlCallback: any,
    setPreviewCallback: any
  ) => {
    const file = e.target.files[0];
    setPreviewCallback(URL.createObjectURL(file));
    await handleImageUpload(file, setImageUrlCallback);
  };

  const saveProduct = async () => {
    const productToSave = { ...product, options: product.options };
    if (!productToSave._id) {
      await createProduct(productToSave);
    } else {
      await updateProduct(productToSave);
    }
  };

  const createProduct = async (productData: ProductType) => {
    setLoading(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      await fetchProducts();
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
        options: [],
      });
      setNewOption({
        name: "",
        price: 0,
        imageUrl: "",
        type: "",
        specification: "",
        pcs: 0,
        suboptions: [],
      });
      setImagePreview("");
      setMessage("Product saved successfully");
    } catch (error) {
      setMessage("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productData: ProductType) => {
    setLoading(true);
    try {
      await fetch(`/api/products/${productData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      await fetchProducts();
      setMessage("Product updated successfully");
      setModalOpen(false);
    } catch (error) {
      setMessage("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      await fetchProducts();
      setMessage("Product deleted successfully");
    } catch (error) {
      setMessage("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product: ProductType) => {
    setProduct(product);
    setImagePreview(product.imageUrl);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
        <button
          onClick={() => {
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
              options: [],
            });
            setImagePreview("");
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add New Product
        </button>

        {modalOpen && (
          <ProductForm
            product={product}
            setProduct={setProduct}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            newOption={newOption}
            setNewOption={setNewOption}
            newSubOption={newSubOption}
            setNewSubOption={setNewSubOption}
            handleProductChange={handleProductChange}
            handleOptionChange={handleOptionChange}
            handleSubOptionChange={handleSubOptionChange}
            handleNewOptionChange={handleNewOptionChange}
            handleNewSubOptionChange={handleNewSubOptionChange}
            addOption={addOption}
            addSubOption={addSubOption}
            removeOption={removeOption}
            removeSubOption={removeSubOption}
            handleImagePreview={handleImagePreview}
            saveProduct={saveProduct}
            setModalOpen={setModalOpen}
            loading={loading}
          />
        )}

        {message && <div className="mt-4 text-red-500">{message}</div>}
      </section>

      <section>
        <ul className="divide-y divide-gray-200">
          {products.map((product: ProductType) => (
            <li
              key={product._id}
              className="py-4 flex justify-between items-center"
            >
              <div className="flex flex-row gap-4">
                <div>
                  <img src={product.imageUrl} alt="" width={100} height={100} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{product.description}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => editProduct(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id!)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold">Uploading...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();

  const products = await Product.find().lean();
  const orders = await Order.find().lean();

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default withAuth(Admin, ["Administrador"]);
