import { useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@Src/components/Modal";
import Select from "@Src/components/Select";
import withAuth from "../lib/withAuth";

function Vendor({ products }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto py-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(product)}
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700">Base Price: ${product.basePrice}</p>
            </div>
          ))}
        </div>
        {selectedProduct && (
          <Modal onClose={closeModal}>
            <Select product={selectedProduct} onClose={closeModal} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const products = await Product.find().lean();
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
}

export default withAuth(Vendor, ["Administrador"]);
