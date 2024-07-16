import { useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@Src/components/Modal";
import Select from "@Src/components/Select";

export default function Home({ products }: any) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
      </div>
    </div>
  );
}
