import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import OptionCard from "@/components/OptionCard";
import { ProductType, OptionType } from "@/types/types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface OptionsTabProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newOption: OptionType;
  setNewOption: (option: OptionType) => void;
  handleOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => void;
  handleSubOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
  handleNewOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOption: () => void;
  addSubOption: (optionIndex: number) => void;
  removeOption: (optionIndex: number) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  handleGallerySelect: any;
}

const OptionsTab: React.FC<OptionsTabProps> = ({
  product,
  setProduct,
  handleOptionChange,
  handleSubOptionChange,
  addOption,
  addSubOption,
  removeOption,
  removeSubOption,
  handleImagePreview,
  handleGallerySelect,
}) => {
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const items = Array.from(product.options);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setProduct({ ...product, options: items });
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="options">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-3 gap-4"
            >
              {product.options.map((option, optionIndex) => (
                <Draggable
                  key={option.name + "-" + optionIndex || optionIndex}
                  draggableId={`option-${option.name || optionIndex}`}
                  index={optionIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <OptionCard
                        option={option}
                        optionIndex={optionIndex}
                        handleOptionChange={handleOptionChange}
                        handleImagePreview={handleImagePreview}
                        setProduct={setProduct}
                        product={product}
                        addSubOption={addSubOption}
                        removeOption={removeOption}
                        handleSubOptionChange={handleSubOptionChange}
                        removeSubOption={removeSubOption}
                        handleGallerySelect={handleGallerySelect}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={addOption} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Option
      </Button>
    </div>
  );
};

export default OptionsTab;
