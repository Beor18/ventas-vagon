export interface ProductType {
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
  colorOptions: ColorOptionType[];
  designs: DesignType[];
}

export interface OptionType {
  id?: string | number;
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  specification: string;
  pcs: number;
  suboptions: SubOptionType[];
}

export interface SubOptionType {
  code: string;
  price: number;
  imageUrl: string;
  details: string;
  name: string;
}

export interface DesignType {
  designType: string;
  cost: number;
  imageUrl: string;
}

export interface ColorOptionType {
  colorName: string;
  colorCode: string;
  additionalPrice: number;
  imageUrl: string;
}

export interface ServiceRequest {
  _id?: string;
  client: string; // ID del cliente
  town: string;
  problem: string;
  installer: string; // ID del instalador
  product: string; // ID del producto
  seller: string; // ID del vendedor
  assignedEquipment: string;
  claimDate: Date;
  assignmentDate: Date;
  resolutionDate?: Date;
  images: string[];
  comments: Comment[];
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
  type: "delivery" | "installation" | "repair";
  warranty: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  _id?: string;
  text: string;
  author: string; // ID del usuario
  createdAt: Date;
}

export interface Installer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}
