/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, Eye, Copy } from "lucide-react";
import { ProductType } from "@/types/types";

interface ProductsTabProps {
  products: ProductType[];
  openModal: () => void;
  editProduct: (product: ProductType) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: ProductType) => void;
  duplicateProduct: (product: ProductType) => void; // Nueva prop para duplicar producto
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  openModal,
  editProduct,
  deleteProduct,
  setSelectedProduct,
  duplicateProduct,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          Product Management ({products.length})
        </h2>
        <Button onClick={openModal} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product: ProductType) => (
          <Card key={product._id} className="overflow-hidden">
            <CardContent className="p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-bold mb-4">USD {product.basePrice}</p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="h-4 w-4 mr-2" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editProduct(product)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateProduct(product)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(product._id!)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
