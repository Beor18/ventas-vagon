import { useState } from "react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@/components/Modal";
import Select from "@/components/Select";

export default function Home({ products }: any) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-4 flex-grow"></div>
    </div>
  );
}
