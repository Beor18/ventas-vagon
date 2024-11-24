/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ProductList = ({ products, onView }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product._id}>
          <CardContent className="p-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="rounded-md object-cover w-full h-full mb-4"
            />
            <h3 className="text-lg font-medium mb-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <p className="text-sm font-semibold mb-4">
              USD {product.basePrice}
            </p>
            <Button onClick={() => onView(product)} className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Ver Producto
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
