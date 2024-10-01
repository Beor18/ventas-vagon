/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRef, useState } from "react";

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

interface ProductFormProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  imagePreview: string;
  setImagePreview: (url: string) => void;
  newOption: OptionType;
  setNewOption: (option: OptionType) => void;
  newSubOption: SubOptionType;
  setNewSubOption: (subOption: SubOptionType) => void;
  handleProductChange: (e: any) => void;
  handleOptionChange: (e: any, optionIndex: number) => void;
  handleSubOptionChange: (
    e: any,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
  handleNewOptionChange: (e: any) => void;
  handleNewSubOptionChange: (e: any) => void;
  addOption: () => void;
  addSubOption: (optionIndex: number) => void;
  removeOption: (optionIndex: number) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  handleImagePreview: (
    e: any,
    setImageUrlCallback: any,
    setPreviewCallback: any
  ) => void;
  saveProduct: () => void;
  setModalOpen: (open: boolean) => void;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  imagePreview,
  setImagePreview,
  newOption,
  setNewOption,
  newSubOption,
  setNewSubOption,
  handleProductChange,
  handleOptionChange,
  handleSubOptionChange,
  handleNewOptionChange,
  handleNewSubOptionChange,
  addOption,
  addSubOption,
  removeOption,
  removeSubOption,
  handleImagePreview,
  saveProduct,
  setModalOpen,
  loading,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputFileRefOption = useRef<HTMLInputElement>(null);
  const inputFileRefSubOption = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Product Information",
      content: (
        <>
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
              Image
            </label>
            <input
              type="file"
              name="image"
              ref={inputFileRef}
              onChange={(e) =>
                handleImagePreview(
                  e,
                  (url: string) => setProduct({ ...product, imageUrl: url }),
                  setImagePreview
                )
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="mt-2 h-32 w-32 object-cover"
              />
            )}
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
        </>
      ),
    },
    {
      title: "Options",
      content: (
        <>
          <h4 className="text-lg font-medium text-gray-900 mt-4">Options</h4>
          {product.options.map((option, optionIndex) => (
            <div key={optionIndex} className="mb-2 border-b pb-2">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Option Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={option.name}
                  onChange={(e) => handleOptionChange(e, optionIndex)}
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
                  value={option.price}
                  onChange={(e) => handleOptionChange(e, optionIndex)}
                  placeholder="Option Price"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Option Image
                </label>
                <input
                  type="file"
                  name="image"
                  ref={inputFileRefOption}
                  onChange={(e) =>
                    handleImagePreview(
                      e,
                      (url: string) => {
                        const updatedOptions = [...product.options];
                        updatedOptions[optionIndex] = {
                          ...updatedOptions[optionIndex],
                          imageUrl: url,
                        };
                        setProduct({
                          ...product,
                          options: updatedOptions,
                        });
                      },
                      (url: string) => {
                        const updatedOptions = [...product.options];
                        updatedOptions[optionIndex].imageUrl = url;
                        setProduct({
                          ...product,
                          options: updatedOptions,
                        });
                      }
                    )
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt="Option Image"
                    className="mt-2 h-20 w-20 object-cover"
                  />
                )}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Option Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={option.type}
                  onChange={(e) => handleOptionChange(e, optionIndex)}
                  placeholder="Option Type"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Specification
                </label>
                <input
                  type="text"
                  name="specification"
                  value={option.specification}
                  onChange={(e) => handleOptionChange(e, optionIndex)}
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
                  value={option.pcs}
                  onChange={(e) => handleOptionChange(e, optionIndex)}
                  placeholder="PCS"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <h5 className="text-md font-medium text-gray-700 mt-2">
                Suboptions
              </h5>
              {option.suboptions.map((suboption, subOptionIndex) => (
                <div key={subOptionIndex} className="mb-2 border-b pb-2 ml-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suboption Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={suboption.name}
                      onChange={(e) =>
                        handleSubOptionChange(e, optionIndex, subOptionIndex)
                      }
                      placeholder="Suboption Name"
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suboption Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={suboption.price}
                      onChange={(e) =>
                        handleSubOptionChange(e, optionIndex, subOptionIndex)
                      }
                      placeholder="Suboption Price"
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suboption Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      ref={inputFileRefSubOption}
                      onChange={(e) =>
                        handleImagePreview(
                          e,
                          (url: string) => {
                            const updatedOptions = [...product.options];
                            updatedOptions[optionIndex].suboptions[
                              subOptionIndex
                            ] = {
                              ...updatedOptions[optionIndex].suboptions[
                                subOptionIndex
                              ],
                              imageUrl: url,
                            };
                            setProduct({
                              ...product,
                              options: updatedOptions,
                            });
                          },
                          (url: string) => {
                            const updatedOptions = [...product.options];
                            updatedOptions[optionIndex].suboptions[
                              subOptionIndex
                            ].imageUrl = url;
                            setProduct({
                              ...product,
                              options: updatedOptions,
                            });
                          }
                        )
                      }
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {suboption.imageUrl && (
                      <img
                        src={suboption.imageUrl}
                        alt="Suboption Image"
                        className="mt-2 h-16 w-16 object-cover"
                      />
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suboption Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={suboption.code}
                      onChange={(e) =>
                        handleSubOptionChange(e, optionIndex, subOptionIndex)
                      }
                      placeholder="Suboption Code"
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Details
                    </label>
                    <input
                      type="text"
                      name="details"
                      value={suboption.details}
                      onChange={(e) =>
                        handleSubOptionChange(e, optionIndex, subOptionIndex)
                      }
                      placeholder="Details"
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <button
                    onClick={() => removeSubOption(optionIndex, subOptionIndex)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove Suboption
                  </button>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 ml-4">
                <h6 className="text-md font-medium text-gray-900 mt-4">
                  Add New Suboption
                </h6>
                <button
                  onClick={() => addSubOption(optionIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Suboption
                </button>
              </div>
              <button
                onClick={() => removeOption(optionIndex)}
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Remove Option
              </button>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <h4 className="text-lg font-medium text-gray-900 mt-4">
              Add New Option
            </h4>
            <button
              onClick={addOption}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Option
            </button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {product._id ? "Edit Product" : "New Product"}
                </h3>
                <div className="mt-2">{steps[currentStep].content}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={saveProduct}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
            )}
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Previous
              </button>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
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

export default ProductForm;
