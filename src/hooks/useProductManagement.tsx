import { useState } from "react";
import {
  ProductType,
  OptionType,
  SubOptionType,
  DesignType,
  ColorOptionType,
} from "@/types/types";
import { upload } from "@vercel/blob/client";

export const useProductManagement = (initialProducts: ProductType[]) => {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estado de datos del producto y sus opciones
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
    colorOptions: [],
    designs: [],
  });

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

  const [newDesign, setNewDesign] = useState<DesignType>({
    designType: "",
    cost: 0,
    imageUrl: "",
  });

  const [newColorOption, setNewColorOption] = useState<ColorOptionType>({
    colorName: "",
    colorCode: "",
    additionalPrice: 0,
    imageUrl: "",
  });

  const openProductModal = () => {
    resetProductForm();
    setModalOpen(true);
  };

  const closeProductModal = () => {
    setModalOpen(false);
  };

  const resetProductForm = () => {
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
      colorOptions: [],
      designs: [],
    });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Funciones para manejar opciones, subopciones, diseño y colores
  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => {
    const { name, value } = e.target;
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [name]: value,
    };
    setProduct({ ...product, options: updatedOptions });
  };

  const handleSubOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const handleNewOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const handleNewSubOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== optionIndex),
    }));
  };

  const removeSubOption = (optionIndex: number, subOptionIndex: number) => {
    const updatedOptions = [...product.options];
    updatedOptions[optionIndex].suboptions = updatedOptions[
      optionIndex
    ].suboptions.filter((_, i) => i !== subOptionIndex);
    setProduct({ ...product, options: updatedOptions });
  };

  const handleNewDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDesign((prev) => ({ ...prev, [name]: value }));
  };

  const addDesign = () => {
    setProduct((prev) => ({
      ...prev,
      designs: [...(prev.designs || []), newDesign],
    }));
    setNewDesign({ designType: "", cost: 0, imageUrl: "" });
  };

  const removeDesign = (designIndex: number) => {
    setProduct((prev) => ({
      ...prev,
      designs: prev.designs.filter((_, index) => index !== designIndex),
    }));
  };

  const handleNewColorOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewColorOption((prev) => ({ ...prev, [name]: value }));
  };

  const addColorOption = () => {
    setProduct((prev) => ({
      ...prev,
      colorOptions: [...(prev.colorOptions || []), newColorOption],
    }));
    setNewColorOption({
      colorName: "",
      colorCode: "",
      additionalPrice: 0,
      imageUrl: "",
    });
  };

  const removeColorOption = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== index),
    }));
  };

  const handleImagePreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewCallback(URL.createObjectURL(file));
      await handleImageUpload(file, setImageUrlCallback);
    }
  };

  const handleImageUpload = async (
    file: File,
    callback: (url: string) => void
  ) => {
    setLoading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      if (newBlob.url) {
        callback(newBlob.url);
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      // Lógica para guardar el producto en la base de datos
      setMessage("Product saved successfully");
      closeProductModal();
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product: ProductType) => {
    setProduct(product);
    setModalOpen(true);
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
      setMessage("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    activeTab,
    setActiveTab,
    modalOpen,
    openProductModal,
    closeProductModal,
    selectedProduct,
    setSelectedProduct,
    loading,
    message,
    handleProductChange,
    handleOptionChange,
    handleSubOptionChange,
    addOption,
    addSubOption,
    removeOption,
    removeSubOption,
    handleNewOptionChange,
    handleNewSubOptionChange,
    addDesign,
    removeDesign,
    handleNewDesignChange,
    addColorOption,
    removeColorOption,
    handleNewColorOptionChange,
    handleImagePreview,
    handleImageUpload,
    handleSaveProduct,
    editProduct,
    deleteProduct,
    product,
    setProduct,
    resetProductForm,
    newOption,
    setNewOption,
    newSubOption,
    setNewSubOption,
    newDesign,
    setNewDesign,
    newColorOption,
    setNewColorOption,
  };
};
