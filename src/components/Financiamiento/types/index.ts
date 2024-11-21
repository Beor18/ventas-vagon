export interface Client {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface InsurancePolicy {
  _id: any;
  nombre: any;
  direccion_postal: any;
  direccion_fisica: any;
  fecha_nacimiento: any;
  telefono_contacto: any;
  costo_propiedad: any;
  modelo_propiedad: any;
  uso_propiedad: any;
  vendedor: any;
  comentarios: any;
  documentos: any[];
  cliente: any;
  createdAt: any;
  updatedAt: any;
}
