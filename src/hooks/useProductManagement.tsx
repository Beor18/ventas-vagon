import { useState, useCallback, useEffect } from "react";
import {
  ProductType,
  OptionType,
  SubOptionType,
  DesignType,
  ColorOptionType,
} from "@/types/types";
import { upload } from "@vercel/blob/client";
import { useToast } from "@/hooks/use-toast";

export const useProductManagement = (initialProducts: ProductType[]) => {
  const { toast } = useToast();
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
  const [isUploading, setIsUploading] = useState(false);
  const [galleryLoaded, setGalleryLoaded] = useState(false);

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

  const resetProductForm = useCallback(() => {
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
  }, []);

  const loadGalleryImages = useCallback(async () => {
    if (galleryLoaded || isLoadingGallery) return;

    setIsLoadingGallery(true);
    try {
      const response = await fetch("/api/upload/list");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();

      if (data?.blobs) {
        const processedImages = data.blobs.map((img: any) => ({
          ...img,
          url: img.downloadUrl,
        }));
        setGalleryImages(processedImages);
        setGalleryLoaded(true);
      }
    } catch (error) {
      console.error("Error loading gallery images:", error);
    } finally {
      setIsLoadingGallery(false);
    }
  }, [galleryLoaded, isLoadingGallery]);

  const openProductModal = useCallback(() => {
    resetProductForm();
    loadGalleryImages();
    setModalOpen(true);
  }, [resetProductForm, loadGalleryImages]);

  const closeProductModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Funciones para manejar opciones, subopciones, diseño y colores
  const handleOptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, optionIndex: number) => {
      const { name, value } = e.target;
      setProduct((prev) => {
        const updatedOptions = [...prev.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          [name]: value,
        };
        return { ...prev, options: updatedOptions };
      });
    },
    []
  );

  const handleSubOptionChange = useCallback(
    (
      optionIndex: number,
      subOptionIndex: number,
      field: string,
      value: string | number
    ) => {
      setProduct((prev) => {
        const updatedOptions = JSON.parse(JSON.stringify(prev.options));
        const currentSuboption =
          updatedOptions[optionIndex].suboptions[subOptionIndex];

        // Solo actualizar el campo específico, manteniendo el resto de propiedades
        updatedOptions[optionIndex].suboptions[subOptionIndex] = {
          ...currentSuboption,
          [field]: value,
        };

        return {
          ...prev,
          options: updatedOptions,
        };
      });
    },
    []
  );

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

  const addSubOption = useCallback((optionIndex: number) => {
    setProduct((prevProduct) => {
      const updatedOptions = [...prevProduct.options];
      const newSubOption = {
        name: "",
        price: 0,
        imageUrl: "",
        code: "",
        details: "",
      };

      // Asegurarse de que la opción existe y tiene un array de subopciones
      if (updatedOptions[optionIndex]) {
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          suboptions: [
            ...(updatedOptions[optionIndex].suboptions || []),
            newSubOption,
          ],
        };
      }

      return {
        ...prevProduct,
        options: updatedOptions,
      };
    });
  }, []);

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

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      return blob.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagePreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewCallback(URL.createObjectURL(file));
      const imageUrl = await handleImageUpload(file);
      setImageUrlCallback(imageUrl);
    }
  };

  const handleGallerySelect = useCallback(
    (image: any, optionIndex?: number, subOptionIndex?: number) => {
      const imageUrl = image?.downloadUrl || image?.url;
      if (!imageUrl) return;

      setProduct((prev) => {
        // Crear una copia profunda del estado anterior
        const updatedProduct = JSON.parse(JSON.stringify(prev));

        if (
          typeof optionIndex === "number" &&
          typeof subOptionIndex === "number"
        ) {
          // Para subopciones
          updatedProduct.options[optionIndex].suboptions[
            subOptionIndex
          ].imageUrl = imageUrl;
        } else if (typeof optionIndex === "number") {
          // Para opciones
          updatedProduct.options[optionIndex].imageUrl = imageUrl;
        } else {
          // Para el producto principal
          updatedProduct.imageUrl = imageUrl;
        }

        return updatedProduct;
      });
    },
    []
  );

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      // Validaciones
      // if (!product.name || !product.description) {
      //   toast({
      //     title: "Error",
      //     description: "Por favor complete todos los campos requeridos",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      const method = product._id ? "PUT" : "POST";
      const endpoint = product._id
        ? `/api/products/${product._id}`
        : "/api/products";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Error al guardar el producto");

      const savedProduct = await response.json();

      if (product._id) {
        setProducts(
          products.map((p) => (p._id === product._id ? savedProduct : p))
        );
      } else {
        setProducts([...products, savedProduct]);
      }

      toast({
        title: "Éxito",
        description: `Producto ${
          product._id ? "actualizado" : "creado"
        } correctamente`,
      });

      setModalOpen(false);
      resetProductForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el producto",
        variant: "destructive",
      });
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
    isUploading,
  };
};
