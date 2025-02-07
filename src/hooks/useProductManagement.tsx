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
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

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
    loadGalleryImages();
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
    const newOptionWithId = {
      ...JSON.parse(JSON.stringify(newOption)),
      id: new Date().getTime(), // Genera un ID único
    };

    setProduct((prevProduct) => {
      const updatedProduct = {
        ...prevProduct,
        options: [
          ...JSON.parse(JSON.stringify(prevProduct.options)),
          newOptionWithId,
        ],
      };
      return updatedProduct;
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

  const editColorOption = (
    index: number,
    updatedColorOption: ColorOptionType
  ) => {
    setProduct((prev) => {
      const updatedColorOptions = [...prev.colorOptions];
      updatedColorOptions[index] = updatedColorOption;
      return {
        ...prev,
        colorOptions: updatedColorOptions,
      };
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

  const handleGallerySelect = (
    image: any,
    optionIndex?: number,
    subOptionIndex?: number
  ) => {
    const imageUrl = image?.downloadUrl || image?.url;

    if (optionIndex !== undefined) {
      const updatedOptions = [...product.options];

      if (subOptionIndex !== undefined) {
        // Actualizar subopción
        updatedOptions[optionIndex].suboptions[subOptionIndex].imageUrl =
          imageUrl;
      } else {
        // Actualizar opción
        updatedOptions[optionIndex].imageUrl = imageUrl;
      }

      setProduct({ ...product, options: updatedOptions });
    }
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    try {
      const method = product._id ? "PUT" : "POST";
      const endpoint = product._id
        ? `/api/products/${product._id}`
        : "/api/products";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) => {
          if (product._id) {
            return prevProducts.map((p) =>
              p._id === updatedProduct._id ? updatedProduct : p
            );
          } else {
            return [...prevProducts, updatedProduct];
          }
        });
        setMessage("Product saved successfully");
        closeProductModal();
      } else {
        throw new Error("Failed to save product");
      }
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

  const duplicateProduct = async (product: ProductType) => {
    try {
      // Crear el objeto duplicado sin el campo `_id`
      const duplicatedProduct: ProductType = {
        ...product,
        _id: undefined, // Eliminar el ID para crear uno nuevo en la base de datos
        name: `${product.name} (Copy)`, // Agregar un indicador de duplicado al nombre
      };

      // Realizar la solicitud POST para guardar el producto duplicado
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedProduct),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        console.log("Producto duplicado con éxito:", newProduct);
      } else {
        throw new Error("No se pudo duplicar el producto");
      }
    } catch (error) {
      console.error("Error al duplicar el producto:", error);
    }
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

  const loadGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const response = await fetch("/api/upload/list");
      const data = await response.json();
      console.log("Loading gallery images:", data);

      if (!data?.blobs?.length) {
        console.warn("No images found in gallery");
        return;
      }

      const processedImages = data.blobs.map((img: any) => ({
        ...img,
        url: img.downloadUrl,
      }));

      setGalleryImages(processedImages);
      console.log("Gallery images loaded:", processedImages);
    } catch (error) {
      console.error("Error loading gallery images:", error);
    } finally {
      setIsLoadingGallery(false);
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
    editColorOption,
    removeColorOption,
    handleNewColorOptionChange,
    handleImagePreview,
    handleImageUpload,
    handleGallerySelect,
    handleSaveProduct,
    editProduct,
    duplicateProduct,
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
    galleryImages,
    loadGalleryImages,
    isLoadingGallery,
  };
};
